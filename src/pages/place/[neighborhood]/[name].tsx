import { GetServerSideProps } from 'next';
import SEO from '../../../components/SEO';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';

type Place = Restaurant | Bar;

interface PlacePageProps {
  place: Place | null;
}

const PlacePage = ({ place }: PlacePageProps) => {
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
        <h1>{place.place_name}</h1>
        <p>{place.description}</p>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { neighborhood, name } = context.params ?? {};

  if (!neighborhood || !name) {
    return { notFound: true };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/places?neighborhood=${neighborhood}&name=${name}`);

    if (!response.ok) {
      return { notFound: true };
    }

    const place = await response.json();
    return { props: { place } };
  } catch (error) {
    console.error("Error fetching place:", error);
    return { notFound: true };
  }
};

export default PlacePage;
