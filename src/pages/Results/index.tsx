import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Map from '../../components/Map';
import List from '../../components/List';
import Filters from '../../components/Filters';
import SEO from '../../components/SEO';
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
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>(),
    setting: new Set<string>()
  });

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!neighborhoods) return;
      
      setLoading(true);
      try {
        const endpoint = category === 'food' ? 'restaurants' : 'bars';
        const response = await fetch(`/api/${endpoint}?neighborhoods=${neighborhoods}`);
        if (!response.ok) throw new Error('Failed to fetch places');
        const data = await response.json();
        setPlaces(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [neighborhoods, category]);

  const filteredPlaces = places.filter(place => {
    const priceMatch = selectedFilters.price.size === 0 || selectedFilters.price.has(place.budget);
    
    if (category === 'food') {
      const restaurant = place as Restaurant;
      const mealMatch = selectedFilters.meals.size === 0 || 
        Array.from(selectedFilters.meals).some(meal => 
          restaurant.meals[meal.toLowerCase() as keyof typeof restaurant.meals]
        );
      const cuisineMatch = selectedFilters.cuisine.size === 0 || 
        selectedFilters.cuisine.has(restaurant.cuisine_clean);
      return priceMatch && mealMatch && cuisineMatch;
    } else {
      const bar = place as Bar;
      const settingMatch = selectedFilters.setting.size === 0 || 
        Array.from(selectedFilters.setting).some(setting => 
          bar[setting.toLowerCase() as keyof Bar]
        );
      return priceMatch && settingMatch;
    }
  });

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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
              <h3 className="place-name">{selectedPlace.place_name}</h3>
              <div className="place-info">
                <span>{selectedPlace.neighborhood}</span>
                <span>·</span>
                {'cuisine' in selectedPlace ? (
                  <span>{selectedPlace.cuisine}</span>
                ) : (
                  <span>
                    {Object.entries(selectedPlace)
                      .filter(([key, value]) => 
                        ['cocktail', 'dive', 'jazz', 'wine', 'rooftop', 'speakeasy', 'beer', 'pub'].includes(key) && value
                      )
                      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                      .join(', ')}
                  </span>
                )}
                <span>·</span>
                <span>{selectedPlace.budget}</span>
              </div>
              <img 
                src={selectedPlace.image_url} 
                alt={selectedPlace.place_name}
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