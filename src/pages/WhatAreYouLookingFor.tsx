import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function WhatAreYouLookingFor() {
  const navigate = useNavigate();
  
  const setCategory = (category: string) => {
    localStorage.setItem('selectedCategory', category);
    navigate('/neighborhoods');
  };

  return (
    <>
      <Helmet>
        <title>Plana - New York City</title>
        <meta name="description" content="Discover food, drinks, and more in New York City with Plana's curated recommendations." />
      </Helmet>
      <h2 className="title">What are you looking for?</h2>
      <div className="options-container">
        <button onClick={() => setCategory('food')} className="option">
          <div className="option-icon food-icon"></div>
          <div className="option-text">Food</div>
        </button>
        <button onClick={() => setCategory('drinks')} className="option">
          <div className="option-icon drink-icon"></div>
          <div className="option-text">Drinks</div>
        </button>
      </div>
    </>
  );
}

export default WhatAreYouLookingFor;