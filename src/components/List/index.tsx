import { useEffect, useRef } from 'react';
import { Restaurant } from '../../types/restaurant';
import { Bar } from '../../types/bar';
import styles from '../../styles/places.module.css';

type Place = Restaurant | Bar;

interface ListProps {
  places: Place[];
  selectedPlaceId: string | null;
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

export default function List({ places, selectedPlaceId }: ListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPlaceId && listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-place-id="${selectedPlaceId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPlaceId]);

  if (!places || places.length === 0) {
    return (
      <div id="restaurant-list" ref={listRef}>
        <p className="no-results">No places found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div id="restaurant-list" ref={listRef}>
      {places.map(place => (
        <div 
          key={place.id} 
          className={`${styles.placeBox} ${selectedPlaceId === place.id ? styles.placeBoxSelected : ''}`}
          data-place-id={place.id}
        >
          <a href={`/place/${place.id}`}>
            <div className={styles.placeContent}>
              <h3 className={styles.placeName}>{place.name}</h3>
              <div className={styles.placeInfo}>
                <span className={styles.placeNeighborhood}>{getNeighborhoodName(place.neighborhood)}</span>
                <span>·</span>
                {'cuisine' in place ? (
                  <span className={styles.placeCuisine}>{place.cuisine}</span>
                ) : (
                  <span className={styles.placeSetting}>{place.setting}</span>
                )}
                <span>·</span>
                <span>{place.price}</span>
              </div>
              <img 
                src={place.imageUrl} 
                alt={place.name}
                className={styles.placeImage}
              />
              <div className={styles.descriptionContainer}>
                <p className={styles.placeDescription}>
                  {place.description}
                </p>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}