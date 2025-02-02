import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import SEO from '../components/SEO';

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
    router.push(`/neighborhoods?to=${category}`);
  };

  return (
    <>
      <SEO 
        title="Choose Your NYC Experience | Food & Drinks | NYC Curated"
        description="Discover the best food and drinks in New York City. Choose your experience and explore hand-picked recommendations in every neighborhood."
        slogan="Find the perfect spot in NYC, whether you're craving amazing food or seeking the best bars."
      />

      <h2 className="title">What are you looking for?</h2>

      <div className="categories-container" style={{ animationDelay: '0.375s' }}>
        <CategoryOption
          backgroundImage="https://plus.unsplash.com/premium_photo-1698867575634-d39ef95fa6a7?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          label="Food"
          onClick={() => setCategory('eat')}
        />
        <CategoryOption
          backgroundImage="https://images.unsplash.com/photo-1593433855865-6046a14605b9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          label="Drinks"
          onClick={() => setCategory('drink')}
        />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  };
};

export default WhatAreYouLookingFor;