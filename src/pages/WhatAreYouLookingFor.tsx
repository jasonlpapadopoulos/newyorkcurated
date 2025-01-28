import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface CategoryOptionProps {
  backgroundImage: string;
  label: string;
  onClick: () => void;
}

const CategoryOption = ({ backgroundImage, label, onClick }: CategoryOptionProps) => (
  <div 
    onClick={onClick}
    className="category-option"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="category-overlay"></div>
    <div className="category-text">{label}</div>
  </div>
);

function WhatAreYouLookingFor() {
  const navigate = useNavigate();
  
  const setCategory = (category: string): void => {
    navigate(`/neighborhoods?to=${category}`);
  };

  return (
    <>
      <Helmet>
        <title>New York Curated - Categories</title>
        <meta 
          name="description" 
          content="Discover food, drinks, and more in New York City." 
        />
      </Helmet>

      <h2 className="title">What are you looking for?</h2>

      <div className="categories-container">
        <CategoryOption
          backgroundImage="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
          label="Food"
          onClick={() => setCategory('eat')}
        />
        <CategoryOption
          backgroundImage="https://images.unsplash.com/photo-1575023782549-62ca0d244b39?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFydGluaXxlbnwwfHwwfHx8MA%3D%3D"
          label="Drinks"
          onClick={() => setCategory('drink')}
        />
      </div>
    </>
  );
}

export default WhatAreYouLookingFor;