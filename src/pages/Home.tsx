import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Home() {
  return (
    <>
      <Helmet>
        <title>Plana - Curated Recommendations</title>
        <meta name="description" content="Find the best things to do in New York City with Plana's curated recommendations." />
      </Helmet>
      <h1 className="big-title">Plana</h1>
      <p className="subtitle">Curated Recommendations</p>
      <Link to="/what-are-you-looking-for">
        <img 
          className="city-image"
          id="rotating-image"
          src="https://images.unsplash.com/photo-1518563172008-e56c5dfbaef6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="NYC Skyline"
        />
      </Link>
      <Link to="/what-are-you-looking-for" className="city-button">New York City</Link>
      <p className="homepage-text">Find the best things to do.</p>
      <p className="comment">Just launched in New York.</p>
    </>
  );
}

export default Home;