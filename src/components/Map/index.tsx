import dynamic from 'next/dynamic';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import type { Cafe } from '../../types/cafe';
import type { PartySpot } from '../../types/partySpot';

type Place = Restaurant | Bar | Cafe | PartySpot;

interface MapProps {
  places: Place[];
  onMarkerClick?: (place: Place) => void;
  markerEmojis?: {
    restaurant: string;
    bar: string;
    cafe?: string;
    spot?: string;
  };
}

// Placeholder for SSR rendering
const MapPlaceholder = () => (
  <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
);

// The actual Map component will be loaded dynamically on the client side
const Map = ({ places }: MapProps) => {
  return <MapPlaceholder />;
};

// Create a dynamic version of the Map that only loads on the client
const DynamicMap = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: MapPlaceholder,
});

export default DynamicMap;