import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';

const Map = dynamic(() => import('../../../components/Map/MapClient'), {
  ssr: false
});

type Place = Restaurant | Bar;

interface PlacePageProps {
  place: Place | null;
  error: string | null;
}

export default function PlacePage({ place, error }: PlacePageProps) {
  if (error || !place) {
    return <div className="error">Error: {error || 'Place not found'}</div>;
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
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Fetch data server-side
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { neighborhood, name } = context.query;

  if (!neighborhood || !name) {
    return {
      props: {
        place: null,
        error: 'Invalid parameters'
      }
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/places?neighborhood=${neighborhood}&name=${name}`);
    
    if (!response.ok) {
      throw new Error('Place not found');
    }

    const data = await response.json();

    return {
      props: {
        place: data,
        error: null
      }
    };
  } catch (error: unknown) {
    return {
      props: {
        place: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    };
  }
};
