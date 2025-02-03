import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import List from '../../components/List';
import Filters from '../../components/Filters';
import SEO from '../../components/SEO';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;
type ViewMode = 'list' | 'map';

interface ResultsProps {
  places: Place[];
  category: string;
  neighborhoods: string;
}

const Results: NextPage<ResultsProps> = ({ places, category, neighborhoods }) => {
  const router = useRouter();
  const neighborhoodList = neighborhoods.split(',');
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>(),
    setting: new Set<string>()
  });

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

  const title = `Best ${category === 'food' ? 'Restaurants' : 'Bars'} in ${neighborhoodList.join(', ')} | NYC Curated`;
  const description = `Discover the best ${category === 'food' ? 'places to eat' : 'bars'} in ${neighborhoodList.join(', ')}. Hand-picked recommendations for ${category === 'food' ? 'restaurants' : 'bars'} in New York City.`;

  return (
    <>
      <SEO title={title} description={description} />
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

        <Filters category={category} selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />

        <div className="view-container">
          {viewMode === 'list' ? (
            <List places={filteredPlaces} selectedPlaceId={selectedPlace?.id || null} />
          ) : (
            <Map places={filteredPlaces} onMarkerClick={handleMarkerClick} />
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

// ✅ Server-side fetch in `getServerSideProps`
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const category = query.category as string || 'food';
  const neighborhoods = query.neighborhoods as string || '';

  if (!neighborhoods) {
    return { props: { places: [], category, neighborhoods } };
  }

  try {
    const endpoint = category === 'food' ? 'restaurants' : 'bars';
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}?neighborhoods=${neighborhoods}`;
    
    console.log("Fetching from API:", apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error("API response error:", response.status);
      return { props: { places: [], category, neighborhoods } };
    }

    const places = await response.json();
    return { props: { places, category, neighborhoods } };
  } catch (error) {
    console.error("Error fetching places:", error);
    return { props: { places: [], category, neighborhoods } };
  }
};

export default Results;
