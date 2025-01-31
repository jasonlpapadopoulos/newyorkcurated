import { useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Map from '../../components/Map';
import List from '../../components/List';
import Filters from '../../components/Filters';
import SEO from '../../components/SEO';
import { sampleRestaurants } from '../../data/sample-restaurants';
import { sampleBars } from '../../data/sample-bars';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;
type ViewMode = 'list' | 'map';

const Results: NextPage = () => {
  const router = useRouter();
  const { category = 'food', neighborhoods = '' } = router.query;
  const neighborhoodList = typeof neighborhoods === 'string' ? neighborhoods.split(',') : [];
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
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
  };

  const toggleView = () => {
    setViewMode(prev => prev === 'list' ? 'map' : 'list');
    setSelectedPlace(null);
  };

  const title = `Best ${category === 'food' ? 'Restaurants' : 'Bars'} in ${neighborhoodList.join(', ')} | NYC Curated`;
  const description = `Discover the best ${category === 'food' ? 'places to eat' : 'bars'} in ${neighborhoodList.join(', ')}. Hand-picked recommendations for ${category === 'food' ? 'restaurants' : 'bars'} in New York City.`;

  return (
    <>
      <SEO 
        title={title}
        description={description}
      />
      <div className="results-container">
        <div className="view-toggle">
          <button 
            className={`view-toggle-option ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button 
            className={`view-toggle-option ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            Map
          </button>
        </div>

        <Filters 
          category={category as string}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />

        <div className="view-container">
          {viewMode === 'list' ? (
            <List 
              places={filteredPlaces}
              selectedPlaceId={selectedPlace?.id || null}
            />
          ) : (
            <Map 
              places={filteredPlaces} 
              onMarkerClick={handleMarkerClick}
            />
          )}
        </div>

        {selectedPlace && viewMode === 'map' && (
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
      </div>
    </>
  );
};

export default Results;