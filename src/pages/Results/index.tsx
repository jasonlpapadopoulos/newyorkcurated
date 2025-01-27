import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Map from './components/Map';
import List from './components/List';
import ResizeHandle from './components/ResizeHandle';
import Filters from './components/Filters';
import { sampleRestaurants } from '../../data/sample-restaurants';
import 'leaflet/dist/leaflet.css';

export default function Results() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'food';
  const [mapHeight, setMapHeight] = useState(50);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>()
  });

  const handleResize = (newMapHeight: number) => {
    setMapHeight(newMapHeight);
  };

  return (
    <>
      <Helmet>
        <title>NYC {category === 'food' ? 'Food' : 'Drinks'}</title>
        <meta 
          name="description" 
          content={`Discover the best ${category} spots in New York City`} 
        />
      </Helmet>

      <div className="results-container">
        <div 
          id="map-view" 
          style={{ height: `${mapHeight}%` }}
        >
          <Map restaurants={sampleRestaurants} />
        </div>

        <div className="separator-section">
          <Filters 
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
          <ResizeHandle onResize={handleResize} />
        </div>

        <div 
          id="restaurant-list"
          style={{ height: `${100 - mapHeight}%` }}
        >
          <List restaurants={sampleRestaurants} />
        </div>
      </div>
    </>
  );
}