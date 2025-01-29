import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Map from './components/Map';
import List from './components/List';
import ResizeHandle from './components/ResizeHandle';
import Filters from './components/Filters';
import { sampleRestaurants } from '../../data/sample-restaurants';
import { sampleBars } from '../../data/sample-bars';
import { Restaurant } from '../../types/restaurant';
import { Bar } from '../../types/bar';
import '../../styles/places.css';

type Place = Restaurant | Bar;

export default function Results() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'food';
  const neighborhoods = searchParams.get('neighborhoods')?.split(',') || [];
  
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
    const neighborhoodMatch = neighborhoods.includes(place.neighborhood);
    const priceMatch = selectedFilters.price.size === 0 || selectedFilters.price.has(place.price);
    
    if (category === 'food') {
      const restaurant = place as Restaurant;
      const mealMatch = selectedFilters.meals.size === 0 || 
        [...selectedFilters.meals].some(meal => 
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
      <Helmet>
        <title>NYC {category === 'food' ? 'Food' : 'Drinks'}</title>
        <meta 
          name="description" 
          content={`Discover the best ${category} spots in New York City`} 
        />
      </Helmet>
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
            category={category}
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
}