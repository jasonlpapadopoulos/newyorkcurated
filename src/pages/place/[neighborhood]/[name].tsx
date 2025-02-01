import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';
import { query } from '../../../lib/db';

const Map = dynamic(() => import('../../../components/Map/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-900 animate-pulse rounded-lg" />
  ),
});

type Place = Restaurant | Bar;

interface PlacePageProps {
  place: Place | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    console.log("Fetching place data with params:", params); // Debug log

    const response = await fetch(`https://newyorkcurated.com/api/places?neighborhood=${params?.neighborhood}&name=${params?.name}`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const place = await response.json();
    console.log("API Response:", place); // Log API response

    return { props: { place } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: { place: null, error: "Failed to load place data" },
    };
  }
};


export default function PlacePage({ place, error }: PlacePageProps) {
  const router = useRouter();

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