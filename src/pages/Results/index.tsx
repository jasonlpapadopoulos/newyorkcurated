import { GetServerSideProps } from 'next';
import SEO from '../../components/SEO';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;

interface ResultsProps {
  places: Place[];
  category: string;
  neighborhoods: string;
}

const ResultsPage = ({ places, category, neighborhoods }: ResultsProps) => {
  const neighborhoodList = neighborhoods.split(',');

  const title = `Best ${category === 'food' ? 'Restaurants' : 'Bars'} in ${neighborhoodList.join(', ')} | NYC Curated`;
  const description = `Discover the best ${category === 'food' ? 'places to eat' : 'bars'} in ${neighborhoodList.join(', ')}. Hand-picked recommendations for ${category === 'food' ? 'restaurants' : 'bars'} in NYC.`;

  return (
    <>
      <SEO title={title} description={description} />
      <div className="results-container">
        <h1>{title}</h1>
        {places.length === 0 ? <p>No places found.</p> : <ul>{places.map(place => <li key={place.id}>{place.place_name}</li>)}</ul>}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category = 'food', neighborhoods = '' } = context.query;

  if (!neighborhoods) {
    return { props: { places: [], category, neighborhoods } };
  }

  try {
    const endpoint = category === 'food' ? 'restaurants' : 'bars';
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}?neighborhoods=${neighborhoods}`);

    if (!response.ok) {
      return { props: { places: [], category, neighborhoods } };
    }

    const places = await response.json();
    return { props: { places, category, neighborhoods } };
  } catch (error) {
    console.error("Error fetching places:", error);
    return { props: { places: [], category, neighborhoods } };
  }
};

export default ResultsPage;
