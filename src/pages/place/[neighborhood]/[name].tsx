import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';
import { query } from '../../../lib/db';

// Commenting out Map import since we won't use it for now
// const Map = dynamic(() => import('../../../components/Map/MapClient'), {
//   ssr: false,
//   loading: () => (
//     <div style={{ width: '100%', height: '400px', background: '#1a1a1a' }} />
//   ),
// });

type Place = Restaurant | Bar;

interface PlacePageProps {
  place: Place | null;
  error?: string;
}

const PlacePage = ({ place, error }: PlacePageProps) => {
  const router = useRouter();

  if (error || !place) {
    return (
      <div className="error">
        <p>{error || 'Place not found'}</p>
        <button onClick={() => router.back()}>Go Back</button>
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

          {/* Commenting out map section to test if it's causing the issue */}
          {/* <div className="place-map">
            <Map 
              places={[place]}
              onMarkerClick={() => {}}
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PlacePageProps> = async ({ params }) => {
  try {
    const { neighborhood, name } = params || {};
    
    if (!neighborhood || !name) {
      return { props: { place: null, error: 'Invalid parameters' } };
    }

    // Try restaurants first
    const restaurantQuery = `
      SELECT * FROM food 
      WHERE neighborhood_clean = ? 
      AND LOWER(REPLACE(place_name, ' ', '-')) = ?
      LIMIT 1
    `;

    let results = await query(restaurantQuery, [neighborhood, name]);
    
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
      return { props: { place: restaurant } };
    }

    // If not found in restaurants, try bars
    const barQuery = `
      SELECT * FROM drinks 
      WHERE neighborhood_clean = ? 
      AND LOWER(REPLACE(place_name, ' ', '-')) = ?
      LIMIT 1
    `;

    results = await query(barQuery, [neighborhood, name]);
    
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
      return { props: { place: bar } };
    }

    return { props: { place: null, error: 'Place not found' } };
  } catch (error) {
    return { 
      props: { 
        place: null, 
        error: error instanceof Error ? error.message : 'Failed to load place'
      } 
    };
  }
};

export default PlacePage;