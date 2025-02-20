import { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import List from '../../components/List';
import Filters from '../../components/Filters';
import SEO from '../../components/SEO';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import type { Cafe } from '../../types/cafe';
import type { PartySpot } from '../../types/partySpot';

type Place = Restaurant | Bar | Cafe | PartySpot;
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
    const hasBudget = (place: Place): place is Restaurant | Bar | PartySpot => 'budget' in place;
    const priceMatch = selectedFilters.price.size === 0 || (hasBudget(place) && selectedFilters.price.has(place.budget));
  
    if (category === 'food') {
      const restaurant = place as Restaurant;
      const mealMatch = selectedFilters.meals.size === 0 || 
        Array.from(selectedFilters.meals).some(meal => 
          restaurant.meals[meal.toLowerCase() as keyof typeof restaurant.meals]
        );
      const cuisineMatch = selectedFilters.cuisine.size === 0 || 
        selectedFilters.cuisine.has(restaurant.cuisine_clean);
      return priceMatch && mealMatch && cuisineMatch;
    } else if (category === 'drinks') {
      const bar = place as Bar;
      const settingMatch = selectedFilters.setting.size === 0 || 
        Array.from(selectedFilters.setting).some(setting => 
          bar[setting.toLowerCase() as keyof Bar]
        );
      return priceMatch && settingMatch;
    } else if (category === 'coffee') {
      const cafe = place as Cafe;
      return priceMatch; // You can add more filters later if needed
    } else if (category === 'party') {
      const partySpot = place as PartySpot;
      return priceMatch; // Add relevant party venue filters if needed
    }
  
    return false;
  });
  

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const categoryTitleMap: Record<string, string> = {
    food: "Restaurants",
    drinks: "Bars",
    coffee: "Cafés",
    party: "Party Spots"
  };
  
  const title = `Best ${categoryTitleMap[category as string] || "Places"} in ${neighborhoods.join(', ')} | NYC Curated`;
  const description = `Discover the best ${categoryTitleMap[category as string] || "places"} in ${neighborhoods.join(', ')}. Hand-picked recommendations in New York City.`;
  

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
  const endpointMap: Record<string, string> = {
    food: 'restaurants',
    drinks: 'bars',
    coffee: 'cafes',
    party: 'partySpots',
  };
  
  const endpoint = endpointMap[category as string] || 'restaurants'; // Default to restaurants if category is invalid
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