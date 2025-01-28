import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Map from './components/Map';
import List from './components/List';
import ResizeHandle from './components/ResizeHandle';
import Filters from './components/Filters';
import { sampleRestaurants } from '../../data/sample-restaurants';
import '../../styles/places.css';

export default function Results() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'food';
  const neighborhoodsParam = searchParams.get('neighborhoods');
  const [mapHeight, setMapHeight] = useState(33);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    meals: new Set<string>(),
    price: new Set<string>(),
    cuisine: new Set<string>()
  });

  useEffect(() => {
    if (neighborhoodsParam) {
      const neighborhoods = neighborhoodsParam.split(',');
      localStorage.setItem('selectedNeighborhoods', JSON.stringify(neighborhoods));
    }
  }, [neighborhoodsParam]);

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

  const handleMarkerClick = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    // Set map height to 30% when a marker is clicked
    setMapHeight(30);
  };

  const handleResize = (newHeight: number) => {
    setMapHeight(newHeight);
    const mapView = document.getElementById('map-view');
    const list = document.getElementById('restaurant-list');
    if (mapView && list) {
      mapView.style.height = `${newHeight}%`;
      list.style.height = `${100 - newHeight - 8}%`;
    }
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
          <Map 
            restaurants={sampleRestaurants} 
            onMarkerClick={handleMarkerClick}
          />
        </div>
        <div className="separator-section">
          <ResizeHandle onResize={handleResize} />
          <Filters 
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>
        <div 
          id="restaurant-list"
          style={{ height: `${100 - mapHeight - 8}%` }}
        >
          <List 
            restaurants={sampleRestaurants}
            selectedRestaurantId={selectedRestaurantId}
          />
        </div>
      </div>
    </>
  );
}