import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Restaurant } from '../../types/restaurant';
import { Bar } from '../../types/bar';
import { Cafe } from '../../types/cafe';
import { PartySpot } from '../../types/partySpot';
import styles from './list.module.css';

type Place = Restaurant | Bar | Cafe | PartySpot;

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
      {places.map(place => {
        return (
          <div 
            key={place.id} 
            className={`place-box ${selectedPlaceId === place.id ? 'place-box-selected' : ''}`}
            data-place-id={place.id}
          >
            <Link href={`/place/${place.neighborhood_clean}/${place.place_name_clean}`}>
              <div className="place-content">
                <h3 className="place-name">{place.place_name}</h3>
                <div className="place-info">
                  <span className="place-neighborhood">{getNeighborhoodName(place.neighborhood)}</span>
                  <span>·</span>
                  {'cuisine' in place ? (
                    <span className="place-cuisine">{place.cuisine} ·</span>
                  ) : (
                    <span></span>
                  )}
                  {"budget" in place && <span>{(place as { budget: string }).budget}</span>}
                </div>
                <img 
                  src={place.image_url} 
                  alt={place.place_name}
                  className="place-image"
                />
                <div className="description-container">
                  <p className="place-description">
                    {place.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}