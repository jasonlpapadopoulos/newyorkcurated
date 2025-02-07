import { GetStaticProps, GetStaticPaths } from 'next';
import { NextPage } from 'next';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';
import neighborhoodsData from '../../data/neighborhoods.json';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import { generatePlaceUrl } from '../../utils/url';

// Dynamic import for Map to avoid SSR issues
const Map = dynamic(() => import('../../components/Map'), {
  ssr: false
});

type Place = Restaurant | Bar;

interface NeighborhoodPageProps {
  neighborhood: {
    name: string;
    value: string;
    description: string;
    image: string;
  };
  restaurants: Restaurant[];
  bars: Bar[];
}

const NeighborhoodPage: NextPage<NeighborhoodPageProps> = ({ 
  neighborhood, 
  restaurants,
  bars 
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const closeToaster = () => {
    setSelectedPlace(null);
  };

  return (
    <>
      <SEO
        title={`Best Restaurants & Bars in ${neighborhood.name} NYC | New York Curated`}
        description={`Discover hand-picked recommendations for the best restaurants and bars in ${neighborhood.name}, NYC. Local expert guides to ${neighborhood.name}'s dining and nightlife scene.`}
        image={neighborhood.image}
      />
      
      <div className="neighborhood-page">
        {/* Hero Section */}
        <div className="place-hero">
          <img 
            src={neighborhood.image} 
            alt={neighborhood.name}
            className="place-hero-image"
          />
        </div>

        <div className="individual-place-content">
          <h1 className="place-title">{neighborhood.name}</h1>
          
          <p className="place-description">
            {neighborhood.description || `Discover the vibrant spirit of ${neighborhood.name}, 
            where classic New York charm meets contemporary culture. From hidden culinary gems 
            to trendy nightlife spots, this neighborhood offers a unique blend of experiences 
            that capture the essence of NYC.`}
          </p>

          {/* Restaurants Section */}
          <section className="neighborhood-section">
            <h2 className="section-title">Restaurants</h2>
            <div className="scroll-container">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="place-card">
                  <a href={generatePlaceUrl(restaurant)}>
                    <img 
                      src={restaurant.image_url} 
                      alt={restaurant.place_name}
                      className="place-card-image"
                    />
                    <div className="place-card-content">
                      <h3 className="place-card-title">{restaurant.place_name}</h3>
                      <p className="place-card-cuisine">{restaurant.cuisine}</p>
                      <p className="place-card-budget">{restaurant.budget}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Bars Section */}
          <section className="neighborhood-section">
            <h2 className="section-title">Bars</h2>
            <div className="scroll-container">
              {bars.map(bar => (
                <div key={bar.id} className="place-card">
                  <a href={generatePlaceUrl(bar)}>
                    <img 
                      src={bar.image_url} 
                      alt={bar.place_name}
                      className="place-card-image"
                    />
                    <div className="place-card-content">
                      <h3 className="place-card-title">{bar.place_name}</h3>
                      <p className="place-card-type">
                        {Object.entries(bar)
                          .filter(([key, value]) => 
                            ['cocktail', 'dive', 'jazz', 'wine', 'rooftop', 'speakeasy', 'beer', 'pub'].includes(key) && value
                          )
                          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                          .join(', ')}
                      </p>
                      <p className="place-card-budget">{bar.budget}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Map Section */}
          <section className="neighborhood-section">
            <h2 className="section-title">Explore {neighborhood.name}</h2>
            <div className="neighborhood-map">
              <Map 
                places={[...restaurants, ...bars]}
                onMarkerClick={handleMarkerClick}
                markerColors={{
                  restaurant: '#4A90E2', // Blue for restaurants
                  bar: '#FF9F1C' // Orange for bars
                }}
              />
            </div>
          </section>
        </div>

        {/* Place Toaster */}
        {selectedPlace && (
          <div className="place-toaster show">
            <button className="place-toaster-close" onClick={closeToaster}>&times;</button>
            <a href={generatePlaceUrl(selectedPlace)}>
              <div className="place-content">
                <h3 className="place-name">{selectedPlace.place_name}</h3>
                <div className="place-info">
                  {'cuisine' in selectedPlace ? (
                    <span>{selectedPlace.cuisine}</span>
                  ) : (
                    <span>
                      {Object.entries(selectedPlace)
                        .filter(([key, value]) => 
                          ['cocktail', 'dive', 'jazz', 'wine', 'rooftop', 'speakeasy', 'beer', 'pub'].includes(key) && value
                        )
                        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                        .join(', ')}
                    </span>
                  )}
                  <span>·</span>
                  <span>{selectedPlace.budget}</span>
                </div>
                <img 
                  src={selectedPlace.image_url} 
                  alt={selectedPlace.place_name}
                  className="place-image"
                />
                <div className="description-container">
                  <p className="place-description">{selectedPlace.description}</p>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Collect all unique neighborhood values
  const neighborhoods = new Set<string>();
  
  Object.values(neighborhoodsData).forEach(category => {
    Object.values(category).forEach(area => {
      if (Array.isArray(area)) {
        area.forEach(n => neighborhoods.add(n.value));
      } else {
        Object.values(area).forEach(subArea => {
          subArea.forEach((n: any) => neighborhoods.add(n.value));
        });
      }
    });
  });

  return {
    paths: Array.from(neighborhoods).map(slug => ({
      params: { slug }
    })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  // This would be replaced with your actual data fetching
  const neighborhood = {
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: slug,
    description: `Discover the vibrant spirit of ${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}, where classic New York charm meets contemporary culture. From hidden culinary gems to trendy nightlife spots, this neighborhood offers a unique blend of experiences that capture the essence of NYC.`,
    image: `https://source.unsplash.com/1600x900/?nyc,${slug}`
  };

  // Fetch places for this neighborhood
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [restaurants, bars] = await Promise.all([
    fetch(`${baseUrl}/api/restaurants?neighborhoods=${slug}`).then(res => res.json()),
    fetch(`${baseUrl}/api/bars?neighborhoods=${slug}`).then(res => res.json())
  ]);

  return {
    props: {
      neighborhood,
      restaurants,
      bars
    },
    revalidate: 86400 // Revalidate once per day
  };
};

export default NeighborhoodPage;