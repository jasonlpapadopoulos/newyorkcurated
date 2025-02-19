import { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import List from '../../components/List';
import Filters from '../../components/Filters';
import SEO from '../../components/SEO';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;
type ViewMode = 'list' | 'map';

interface ResultsPageProps {
  initialPlaces: Place[];
  category: string;
  neighborhoods: string[];
  uniqueCuisines: string[];
  error?: string;
  debugLog?: string;
}

const Results: NextPage<ResultsPageProps> = ({ 
  initialPlaces, 
  category, 
  neighborhoods, 
  uniqueCuisines,
  error, 
  debugLog 
}) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>(),
    setting: new Set<string>()
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

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

  const title = `Best ${category === 'food' ? 'Restaurants' : 'Bars'} in ${neighborhoods.join(', ')} | NYC Curated`;
  const description = `Discover the best ${category === 'food' ? 'places to eat' : 'bars'} in ${neighborhoods.join(', ')}. Hand-picked recommendations for ${category === 'food' ? 'restaurants' : 'bars'} in New York City.`;

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
          category={category}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          availableCuisines={uniqueCuisines} // Make sure this is being passed correctly
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
            />
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category = 'food', neighborhoods = '' } = context.query;
  const neighborhoodList = typeof neighborhoods === 'string' ? neighborhoods.split(',') : [];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const endpoint = category === 'food' ? 'restaurants' : 'bars';
  const fetchUrl = `${baseUrl}/api/${endpoint}?neighborhoods=${neighborhoods}`;

  let debugLog = `Fetching from: ${fetchUrl}`;
  let initialPlaces: Place[] = [];
  let uniqueCuisines: string[] = [];

  try {
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    initialPlaces = await response.json();

    // Extract unique cuisines from the actual restaurant data
    if (category === 'food') {
      uniqueCuisines = Array.from(new Set(
        initialPlaces
          .filter((place): place is Restaurant => 'cuisine_clean' in place)
          .map(place => place.cuisine)
          .filter(Boolean)
          .sort()
      ));
    }

  } catch (error) {
    debugLog += ` | Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return {
    props: {
      initialPlaces,
      category: category as string,
      neighborhoods: neighborhoodList,
      uniqueCuisines,
      debugLog,
    }
  };
};

export default Results;