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
  place: Place;
}

export default function PlacePage({ place }: PlacePageProps) {
  if (!place) {
    return <div className="error">Place not found</div>;
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

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  if (!params?.neighborhood || !params?.name) {
    return { notFound: true };
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  
  try {
    const response = await fetch(
      `${baseUrl}/api/places?neighborhood=${params.neighborhood}&name=${params.name}`
    );

    if (!response.ok) {
      return { notFound: true };
    }

    const place = await response.json();

    return {
      props: {
        place
      }
    };
  } catch (error) {
    console.error('Error fetching place:', error);
    return { notFound: true };
  }
}