import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { NextPage } from 'next';
import Map from '../../components/Map';
import List from '../../components/List';
import ResizeHandle from '../../components/ResizeHandle';
import Filters from '../../components/Filters';
import { sampleRestaurants } from '../../data/sample-restaurants';
import { sampleBars } from '../../data/sample-bars';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;

const Results: NextPage = () => {
  const router = useRouter();
  const { category = 'food', neighborhoods = '' } = router.query;
  const neighborhoodList = typeof neighborhoods === 'string' ? neighborhoods.split(',') : [];
  
  const [mapHeight, setMapHeight] = useState(33);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>(),
    setting: new Set<string>()
  });

  const places = category === 'drinks' ? sampleBars : sampleRestaurants;
  const filteredPlaces = places.filter(place => {
    const neighborhoodMatch = neighborhoodList.includes(place.neighborhood);
    const priceMatch = selectedFilters.price.size === 0 || selectedFilters.price.has(place.price);
    
    if (category === 'food') {
      const restaurant = place as Restaurant;
      const mealMatch = selectedFilters.meals.size === 0 || 
        Array.from(selectedFilters.meals).some(meal => 
          restaurant.meals[meal.toLowerCase() as keyof typeof restaurant.meals]
        );
      const cuisineMatch = selectedFilters.cuisine.size === 0 || 
        selectedFilters.cuisine.has(restaurant.cuisine.toLowerCase());
      return neighborhoodMatch && priceMatch && mealMatch && cuisineMatch;
    } else {
      const bar = place as Bar;
      const settingMatch = selectedFilters.setting.size === 0 || 
        selectedFilters.setting.has(bar.setting);
      return neighborhoodMatch && priceMatch && settingMatch;
    }
  });

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
    setMapHeight(95);
  };

  const handleResize = (newHeight: number) => {
    setMapHeight(newHeight);
    if (newHeight < 90) {
      setSelectedPlace(null);
    }
  };

  return (
    <>
      <Head>
        <title>NYC {category === 'food' ? 'Food' : 'Drinks'}</title>
        <meta 
          name="description" 
          content={`Discover the best ${category} spots in New York City`} 
        />
      </Head>
      <div className="results-container">
        <div id="map-view" style={{ height: `${mapHeight}%` }}>
          <Map 
            places={filteredPlaces} 
            onMarkerClick={handleMarkerClick}
          />
        </div>
        <div className="separator-section">
          <ResizeHandle onResize={handleResize} />
          <Filters 
            category={category as string}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>
        <div id="restaurant-list" style={{ height: `${100 - mapHeight - 8}%` }}>
          <List 
            places={filteredPlaces}
            selectedPlaceId={selectedPlace?.id || null}
          />
        </div>
      </div>

      {selectedPlace && (
        <div className="place-toaster show">
          <div className="place-content">
            <h3 className="place-name">{selectedPlace.name}</h3>
            <div className="place-info">
              <span>{selectedPlace.neighborhood}</span>
              <span>·</span>
              <span>
                {'cuisine' in selectedPlace ? selectedPlace.cuisine : selectedPlace.setting}
              </span>
              <span>·</span>
              <span>{selectedPlace.price}</span>
            </div>
            <img 
              src={selectedPlace.imageUrl} 
              alt={selectedPlace.name}
              className="place-image"
            />
            <div className="description-container">
              <p className="place-description">{selectedPlace.description}</p>
            </div>
            <button 
              className="place-toaster-close"
              onClick={() => setSelectedPlace(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Results;