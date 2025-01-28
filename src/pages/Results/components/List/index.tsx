import { useEffect, useRef } from 'react';
import { Restaurant } from '../../../../types/restaurant';

interface ListProps {
  restaurants: Restaurant[];
  selectedRestaurantId: string | null;
}

const getNeighborhoodName = (value: string): string => {
  const names: { [key: string]: string } = {
    'upper-east-side': 'Upper East Side',
    'upper-west-side': 'Upper West Side',
    'lower-east-side': 'Lower East Side',
    'east-village': 'East Village',
    'west-village': 'West Village',
    'hells-kitchen': "Hell's Kitchen",
    'korea-town': 'Korea Town',
    'murray-hill': 'Murray Hill',
    'midtown': 'Midtown',
    'soho': 'SoHo',
    'chinatown': 'Chinatown',
    'little-italy': 'Little Italy',
    'williamsburg': 'Williamsburg',
    'dumbo': 'DUMBO',
    'park-slope': 'Park Slope',
    'bushwick': 'Bushwick',
    'astoria': 'Astoria',
    'long-island-city': 'Long Island City',
    'flushing': 'Flushing',
    'harlem': 'Harlem'
  };
  
  return names[value] || value;
};

export default function List({ restaurants, selectedRestaurantId }: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRestaurantId && listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-restaurant-id="${selectedRestaurantId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedRestaurantId]);

  return (
    <div className="restaurant-list" ref={listRef}>
      {restaurants.map(restaurant => (
        <div 
          key={restaurant.id} 
          className={`place-box ${selectedRestaurantId === restaurant.id ? 'place-box-selected' : ''}`}
          data-restaurant-id={restaurant.id}
        >
          <a href={`/place/${restaurant.id}`}>
            <div className="place-content">
              <h3 className="place-name">{restaurant.name}</h3>
              <p className="place-neighborhood">{getNeighborhoodName(restaurant.neighborhood)}</p>
              <p className="place-meta">
                {restaurant.cuisine}, {restaurant.price}
              </p>
              <img 
                src={restaurant.imageUrl} 
                alt={restaurant.name}
                className="place-image"
              />
              <div className="description-container">
                <p className="place-description">
                  {restaurant.description}
                </p>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}