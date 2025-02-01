import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';

const Map = dynamic(() => import('../../../components/Map/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-900 animate-pulse rounded-lg" />
  ),
});

type Place = Restaurant | Bar;

export default function PlacePage() {
  const router = useRouter();
  const { neighborhood, name } = router.query;
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!neighborhood || !name) {
        console.log('Missing query parameters:', { neighborhood, name });
        return;
      }
      
      try {
        // Convert query parameters to strings
        const neighborhoodStr = Array.isArray(neighborhood) ? neighborhood[0] : neighborhood;
        const nameStr = Array.isArray(name) ? name[0] : name;
        
        const url = `/api/places?neighborhood=${encodeURIComponent(neighborhoodStr)}&name=${encodeURIComponent(nameStr)}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            console.error('Error response data:', errorData);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
          throw new Error(errorMessage);
        }
        
        let data;
        try {
          data = await response.json();
          console.log('Successfully parsed response data:', data);
        } catch (e) {
          console.error('Failed to parse response JSON:', e);
          throw new Error('Failed to parse response data');
        }
        
        if (!data) {
          throw new Error('No data received from API');
        }
        
        setPlace(data);
      } catch (error) {
        console.error('Error in fetchPlace:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      setLoading(true);
      setError(null);
      fetchPlace();
    }
  }, [router.isReady, neighborhood, name]);

  // Early return if the router is not ready
  if (!router.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading">Initializing...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="error">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error || 'Place not found'}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isRestaurant = 'cuisine' in place;
  const title = `${place.place_name} - ${isRestaurant ? place.cuisine : 'Bar'} in ${place.neighborhood} | NYC Curated`;

  return (
    <>
      <SEO 
        title={title}
        description={place.description}
        image={place.image_url}
      />
      
      <div className="place-page">
        <div className="place-hero">
          <img 
            src={place.image_url} 
            alt={place.place_name}
            className="place-hero-image"
          />
        </div>

        <div className="place-content">
          <h1 className="place-title">{place.place_name}</h1>
          
          <div className="place-meta">
            <span>{place.neighborhood}</span>
            <span className="separator">·</span>
            {isRestaurant ? (
              <span>{place.cuisine}</span>
            ) : (
              <span>
                {Object.entries(place)
                  .filter(([key, value]) => 
                    ['cocktail', 'dive', 'jazz', 'wine', 'rooftop', 'speakeasy', 'beer', 'pub'].includes(key) && value
                  )
                  .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                  .join(', ')}
              </span>
            )}
            <span className="separator">·</span>
            <span>{place.budget}</span>
          </div>

          <p className="place-description">{place.description}</p>

          <div className="place-map">
            <Map 
              places={[place]}
              onMarkerClick={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
}