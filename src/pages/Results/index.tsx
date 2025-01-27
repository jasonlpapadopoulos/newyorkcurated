import { useState, useEffect } from 'react';
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
  const [mapHeight, setMapHeight] = useState(33); // Initialize at 33%
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>()
  });

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-group')) {
        const activeFilter = document.querySelector('.filter-button.active');
        if (activeFilter) {
          activeFilter.classList.remove('active');
          const options = activeFilter.nextElementSibling;
          if (options) {
            options.classList.remove('show');
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <ResizeHandle onResize={setMapHeight} />
          <Filters 
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>

        <div 
          id="restaurant-list"
          style={{ height: `${100 - mapHeight - 8}%` }} // 8% for separator section
        >
          <List restaurants={sampleRestaurants} />
        </div>
      </div>
    </>
  );
}