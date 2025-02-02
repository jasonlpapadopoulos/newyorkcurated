import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
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
  debug?: any;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const debug: any = {};
  
  try {
    debug.requestInfo = {
      url: context.req.url,
      params: context.params,
      query: context.query
    };

    const { neighborhood, name } = context.params || {};
    
    if (!neighborhood || !name || Array.isArray(neighborhood) || Array.isArray(name)) {
      debug.error = { type: 'invalid_params', params: { neighborhood, name } };
      return {
        props: {
          place: null,
          error: 'Invalid parameters',
          debug
        }
      };
    }

    // Clean and normalize the parameters
    const cleanNeighborhood = String(neighborhood).trim().toLowerCase();
    const cleanName = String(name).trim().toLowerCase();

    debug.cleanParams = { cleanNeighborhood, cleanName };

    // Try restaurants first
    const restaurantQuery = `
      SELECT 
        id,
        place_name,
        description,
        cuisine,
        cuisine_clean,
        neighborhood,
        neighborhood_clean,
        budget,
        brunch,
        lunch,
        dinner,
        lat,
        lon,
        image_url
      FROM food
      WHERE neighborhood_clean = ? 
      AND LOWER(REPLACE(REPLACE(place_name, ' ', '-'), '''', '')) = ?
      LIMIT 1
    `;

    let results = await query(restaurantQuery, [cleanNeighborhood, cleanName]);
    debug.restaurantResults = results;
    
    if (Array.isArray(results) && results.length > 0) {
      const row = results[0] as any;
      const restaurant: Restaurant = {
        id: row.id,
        place_name: row.place_name,
        description: row.description,
        cuisine: row.cuisine,
        cuisine_clean: row.cuisine_clean,
        neighborhood: row.neighborhood,
        neighborhood_clean: row.neighborhood_clean,
        budget: row.budget,
        meals: {
          brunch: Boolean(row.brunch),
          lunch: Boolean(row.lunch),
          dinner: Boolean(row.dinner)
        },
        lat: row.lat,
        lon: row.lon,
        image_url: row.image_url
      };
      return { props: { place: restaurant, debug } };
    }

    // If not found in restaurants, try bars
    const barQuery = `
      SELECT 
        id,
        place_name,
        description,
        neighborhood,
        neighborhood_clean,
        budget,
        lat,
        lon,
        image_url,
        cocktail,
        dive,
        jazz,
        wine,
        rooftop,
        speakeasy,
        beer,
        pub
      FROM drinks
      WHERE neighborhood_clean = ?
      AND LOWER(REPLACE(REPLACE(place_name, ' ', '-'), '''', '')) = ?
      LIMIT 1
    `;

    results = await query(barQuery, [cleanNeighborhood, cleanName]);
    debug.barResults = results;
    
    if (Array.isArray(results) && results.length > 0) {
      const row = results[0] as any;
      const bar: Bar = {
        id: row.id,
        place_name: row.place_name,
        description: row.description,
        neighborhood: row.neighborhood,
        neighborhood_clean: row.neighborhood_clean,
        budget: row.budget,
        lat: row.lat,
        lon: row.lon,
        image_url: row.image_url,
        cocktail: Boolean(row.cocktail),
        dive: Boolean(row.dive),
        jazz: Boolean(row.jazz),
        wine: Boolean(row.wine),
        rooftop: Boolean(row.rooftop),
        speakeasy: Boolean(row.speakeasy),
        beer: Boolean(row.beer),
        pub: Boolean(row.pub)
      };
      return { props: { place: bar, debug } };
    }

    debug.error = { type: 'not_found' };
    return {
      props: {
        place: null,
        error: 'Place not found',
        debug
      }
    };
  } catch (error) {
    debug.error = {
      type: 'server_error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    return {
      props: {
        place: null,
        error: 'Failed to load place data',
        debug
      }
    };
  }
};

export default function PlacePage({ place, error, debug }: PlacePageProps) {
  const router = useRouter();

  if (error || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="error">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error || 'Place not found'}</p>
          {process.env.NODE_ENV !== 'production' && (
            <pre className="mt-4 p-4 bg-gray-900 text-white rounded overflow-auto max-w-full">
              {JSON.stringify(debug, null, 2)}
            </pre>
          )}
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