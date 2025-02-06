import { useState } from 'react';
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
  error?: string;
  loading: boolean;
}

const Results: NextPage<ResultsPageProps> = ({ 
  initialPlaces, 
  category, 
  neighborhoods, 
  error, 
  loading
}) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>(),
    setting: new Set<string>()
  });

  // ✅ Display loading message before rendering content
  if (loading) {
    return (
      <div className="loading-container">
        🍽️ Finding the best {category === 'food' ? 'restaurants' : 'bars'} in {neighborhoods.join(', ')}...
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const filteredPlaces = initialPlaces.filter(place => {
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

  let initialPlaces: Place[] = [];
  let loading = true; // ✅ Start in loading state

  try {
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    initialPlaces = await response.json();
    loading = false; // ✅ Data is ready, remove loading state
  } catch (error) {
    console.error('❌ Server-side fetch error:', error);
  }

  return {
    props: {
      initialPlaces,
      category: category as string,
      neighborhoods: neighborhoodList,
      loading, // ✅ Correctly passing the loading state to the frontend
    }
  };
};

export default Results;
