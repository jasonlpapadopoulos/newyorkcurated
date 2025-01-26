import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function WhatAreYouLookingFor() {
  const navigate = useNavigate();
  
  const setCategory = (category: string) => {
    navigate(`/neighborhoods?to=${category}`);
  };

  return (
    <>
      <Helmet>
        <title>New York Curated - Categories</title>
        <meta name="description" content="Discover food, drinks, and more in New York City." />
      </Helmet>
      <h2 className="title">What are you looking for?</h2>
      <div className="options-container">
        <a href="#" onClick={(e) => { e.preventDefault(); setCategory('eat'); }} className="option">
          <div className="option-icon food-icon"></div>
          <div className="option-text">Food</div>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); setCategory('drink'); }} className="option">
          <div className="option-icon drink-icon"></div>
          <div className="option-text">Drinks</div>
        </a>
      </div>
    </>
  );
}

export default WhatAreYouLookingFor;