import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Neighborhoods() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('to');

  const title = category === 'eat' ? 'Food' : 'Drinks';

  return (
    <>
      <Helmet>
        <title>NYC {title} Neighborhoods - Plana</title>
        <meta name="description" content={`Discover the best neighborhoods for ${title.toLowerCase()} in New York City with Plana's curated recommendations.`} />
      </Helmet>
      <h2 className="title">Choose a Neighborhood for {title}</h2>
      {/* Add your neighborhoods content here */}
    </>
  );
}

export default Neighborhoods;