import { useRouter } from 'next/router';
import Head from 'next/head';
import type { NextPage } from 'next';

interface CategoryOptionProps {
  backgroundImage: string;
  label: string;
  onClick: () => void;
}

const CategoryOption: React.FC<CategoryOptionProps> = ({ backgroundImage, label, onClick }) => (
  <div 
    onClick={onClick}
    className="category-option"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="category-overlay"></div>
    <div className="category-text">{label}</div>
  </div>
);

const WhatAreYouLookingFor: NextPage = () => {
  const router = useRouter();
  
  const setCategory = (category: string): void => {
    router.push(`/where?to=${category}`);
  };

  return (
    <>
      <Head>
        <title>New York Curated - Categories</title>
        <meta 
          name="description" 
          content="Discover food, drinks, and more in New York City." 
        />
      </Head>

      <div className="center-wrapper">
        <h2 className="subtitle">What are you looking for?</h2>
        <div className="categories-container" style={{ animationDelay: '0.375s' }}>
          <CategoryOption
            backgroundImage="https://plus.unsplash.com/premium_photo-1698867575634-d39ef95fa6a7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            label="Food"
            onClick={() => setCategory('food')}
          />
          <CategoryOption
            backgroundImage="https://images.unsplash.com/photo-1593433855865-6046a14605b9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            label="Drinks"
            onClick={() => setCategory('drinks')}
          />
        </div>
      </div>

    </>
  );
};

export default WhatAreYouLookingFor;