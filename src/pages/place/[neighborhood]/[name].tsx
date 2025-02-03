import dynamic from 'next/dynamic';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';

const Map = dynamic(() => import('../../../components/Map/MapClient'), {
  ssr: false, // Prevents server-side rendering of the map
});

type Place = Restaurant | Bar;

interface PlacePageProps {
  place: Place | null;
}

function PlacePage({ place }: PlacePageProps) {
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
        url={`https://newyorkcurated.com/places/${place.neighborhood}/${place.place_name}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": isRestaurant ? "Restaurant" : "BarOrPub",
          "name": place.place_name,
          "image": place.image_url,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": place.neighborhood,
            "addressRegion": "NY",
            "addressCountry": "US"
          },
          "servesCuisine": isRestaurant ? place.cuisine : undefined,
          "priceRange": place.budget
        }}
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
            <Map places={[place]} onMarkerClick={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ Fetch place details on the server before rendering the page

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Received params:", context.params);

  const { neighborhood, name } = context.params ?? {};

  if (!neighborhood || !name) {
    console.error("Missing parameters:", { neighborhood, name });
    return { notFound: true };
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/places?neighborhood=${neighborhood}&name=${name}`;
  console.log("Fetching from API:", apiUrl);

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("API responded with error:", response.status);
      return { notFound: true };
    }

    const place = await response.json();
    return { props: { place } };
  } catch (error) {
    console.error("Fetch error:", error);
    return { notFound: true };
  }
};



export default PlacePage;
