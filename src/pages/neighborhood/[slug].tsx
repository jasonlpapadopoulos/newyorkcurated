import { GetStaticProps, GetStaticPaths } from 'next';
import { NextPage } from 'next';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import type { Cafe } from '../../types/cafe';
import type { PartySpot } from '../../types/partySpot';
import { generatePlaceUrl } from '../../utils/url';
import type { Neighborhood } from '../../types/neighborhood';
import Map from '../../components/Map';

// Dynamic import for Map to avoid SSR issues
// const Map = dynamic(() => import('../../components/Map'), {
//   ssr: false
// });

type Place = Restaurant | Bar | Cafe | PartySpot;

interface NeighborhoodPageProps {
    neighborhood: Neighborhood;
    restaurants: Restaurant[];
    bars: Bar[];
    cafes?: Cafe[];
    partySpots?: PartySpot[];
}

const NeighborhoodPage: NextPage<NeighborhoodPageProps> = ({ 
  neighborhood, 
  restaurants,
  bars,
  cafes = [],
  partySpots = []
}) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const closeToaster = () => {
    setSelectedPlace(null);
  };

  if (!neighborhood) return <p>Loading...</p>;

  return (
    <>
      <SEO
        title={`Discover ${neighborhood.name} | New York Curated`}
        description={`Discover hand-picked recommendations for the best things to do in ${neighborhood.name}, New York City.`}
        image={neighborhood.image}
      />
      
      <div className="neighborhood-page">
        <div className="individual-place-content">
          <h1 className="place-title">{neighborhood.name}</h1>
          
          <p className="neighborhood-description">
            {neighborhood.description || `Discover the vibrant spirit of ${neighborhood.name}, 
            where classic New York charm meets contemporary culture. From hidden culinary gems 
            to trendy nightlife spots, this neighborhood offers a unique blend of experiences 
            that capture the essence of NYC.`}
          </p>

          {/* Restaurants Section */}
          <section className="neighborhood-section">
            <h2 className="section-title">Where to Eat</h2>
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
            <h2 className="section-title">Where to Drink</h2>
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
                            ['speakeasy', 'jazz', 'live_music', 'large_groups', 'date_spot', 'happy_hour', 'tasty_bites'].includes(key) && value
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

          {cafes.length > 0 && (
            <section className="neighborhood-section">
              <h2 className="section-title">Coffee?</h2>
              <div className="scroll-container">
                {cafes.map(cafe => (
                  <div key={cafe.id} className="place-card">
                    <a href={generatePlaceUrl(cafe)}>
                      <img 
                        src={cafe.image_url} 
                        alt={cafe.place_name}
                        className="place-card-image"
                      />
                      <div className="place-card-content">
                        <h3 className="place-card-title">{cafe.place_name}</h3>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {partySpots.length > 0 && (
            <section className="neighborhood-section">
              <h2 className="section-title">Party!</h2>
              <div className="scroll-container">
                {partySpots.map(spot => (
                  <div key={spot.id} className="place-card">
                    <a href={generatePlaceUrl(spot)}>
                      <img 
                        src={spot.image_url} 
                        alt={spot.place_name}
                        className="place-card-image"
                      />
                      <div className="place-card-content">
                        <h3 className="place-card-title">{spot.place_name}</h3>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}



          {/* Map Section */}
          <section className="neighborhood-section">
            <h2 className="section-title">All together</h2>
            <div className="neighborhood-map">
              <Map 
                places={[...restaurants, ...bars, ...cafes, ...partySpots]}
                // onMarkerClick={handleMarkerClick} remove bc this zooms out when closing toaster
                markerColors={{
                  restaurant: '#007BFF',
                  bar: '#FC74A6',
                  cafe: '#A239CA',
                  party: '#FFC72C'
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
                  {"budget" in selectedPlace && <span>{(selectedPlace as { budget: string }).budget}</span>}
                </div>
                <img 
                  src={selectedPlace.image_url} 
                  alt={selectedPlace.place_name}
                  className="place-image"
                />
                <div className="description-container">
                  <p className="neighborhood-description">{selectedPlace.description}</p>
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/neighborhoods`);
    const neighborhoods = await res.json();
  
    return {
      paths: neighborhoods.map((neighborhood: any) => ({
        params: { slug: neighborhood.value }
      })),
      fallback: false
    };
  };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/neighborhoods`);
  const neighborhoods = await res.json();

  const neighborhood = neighborhoods.find((n: any) => n.value === slug);

  const [restaurants, bars, cafes, partySpots] = await Promise.all([
    fetch(`${baseUrl}/api/restaurants?neighborhoods=${slug}`).then(res => res.json()),
    fetch(`${baseUrl}/api/bars?neighborhoods=${slug}`).then(res => res.json()),
    fetch(`${baseUrl}/api/cafes?neighborhoods=${slug}`).then(res => res.json()),
    fetch(`${baseUrl}/api/partySpots?neighborhoods=${slug}`).then(res => res.json())
  ]);

  return {
    props: {
      neighborhood,
      restaurants,
      bars,
      cafes,
      partySpots
    },
    revalidate: 86400 // Revalidate once per day
  };
};

export default NeighborhoodPage;
