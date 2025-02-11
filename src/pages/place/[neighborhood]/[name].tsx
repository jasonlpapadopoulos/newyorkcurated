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
  // Add debugging logs
  // console.log('Place data:', place);
  // console.log('Address:', place?.address);

  if (error || !place) {
    return <div className="error">Error: {error || 'Place not found'}</div>;
  }

  const isRestaurant = 'cuisine' in place;
  
  const structuredData = isRestaurant ? {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": place.place_name,
    "description": place.description,
    "image": place.image_url,
    "servesCuisine": (place as Restaurant).cuisine,
    "priceRange": place.budget,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "addressCountry": "US",
      "streetAddress": place.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.lat,
      "longitude": place.lon
    }
  } : {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "name": place.place_name,
    "description": place.description,
    "image": place.image_url,
    "priceRange": place.budget,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "addressCountry": "US",
      "streetAddress": place.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.lat,
      "longitude": place.lon
    }
  };

  return (
    <>
      <SEO 
        title={`${place.place_name} - ${isRestaurant ? place.cuisine : 'Bar'} in ${place.neighborhood} | NYC Curated`}
        description={place.description}
        image={place.image_url}
        type="business.business"
        structuredData={structuredData}
      />
      
      <div className="place-page">
        <div className="place-hero">
          <img 
            src={place.image_url} 
            alt={place.place_name}
            className="place-hero-image"
          />
        </div>

        <div className="individual-place-content">
          <h1 className="place-title">{place.place_name}</h1>
          
          <div className="place-meta">
            <span>{place.neighborhood}</span>
            <span className="separator">·</span>
            {isRestaurant ? (
              <span>{(place as Restaurant).cuisine}</span>
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
            {/* {place.address && (
              <>
                <span className="separator">·</span>
                <span>{place.address}</span>
              </>
            )} */}
          </div>

          <p className="place-description">{place.description}</p>

          {isRestaurant && (place as Restaurant).reservation_url && (
            <a 
              href={(place as Restaurant).reservation_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="reservation-button"
            >
              Make a Reservation
            </a>
          )}

          <div className="place-map">
            <Map 
              places={[place]}
              singlePlace={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/places?neighborhood=${encodeURIComponent(neighborhood as string)}&name=${encodeURIComponent(name as string)}`
    );
    
    if (!response.ok) {
      throw new Error('Place not found');
    }

    const data = await response.json();
    
    // Add debugging log
    // console.log('Server-side data:', data);
    // console.log('Request URL:', `${baseUrl}/api/places?neighborhood=${encodeURIComponent(neighborhood as string)}&name=${encodeURIComponent(name as string)}`);

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