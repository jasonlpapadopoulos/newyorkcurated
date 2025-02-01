import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';

const Map = dynamic(() => import('../../../components/Map/MapClient'), {
  ssr: false
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
      if (!neighborhood || !name) return;
      
      try {
        console.log('Fetching place data:', { neighborhood, name });
        const response = await fetch(`/api/places?neighborhood=${encodeURIComponent(neighborhood)}&name=${encodeURIComponent(name)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          
          throw new Error(
            errorData?.error || 
            `Failed to fetch place data (${response.status})`
          );
        }
        
        const data = await response.json();
        console.log('Place data received:', data);
        setPlace(data);
      } catch (error) {
        console.error('Error fetching place:', error);
        setError(error instanceof Error ? error.message : 'Failed to load place data');
      } finally {
        setLoading(false);
      }
    };

    if (neighborhood && name) {
      setLoading(true);
      setError(null);
      fetchPlace();
    }
  }, [neighborhood, name]);

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
          <h2>Error</h2>
          <p>{error || 'Place not found'}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isRestaurant = 'cuisine' in place;

  return (
    <>
      <SEO 
        title={`${place.place_name} - ${isRestaurant ? place.cuisine : 'Bar'} in ${place.neighborhood} | NYC Curated`}
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