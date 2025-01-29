import dynamic from 'next/dynamic';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;

interface MapProps {
  places: Place[];
  onMarkerClick: (place: Place) => void;
}

// This is a placeholder component that will be rendered during SSR
const MapPlaceholder = () => (
  <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
);

// The actual Map component will be loaded dynamically on the client side
const Map = ({ places, onMarkerClick }: MapProps) => {
  return <MapPlaceholder />;
};

// Create a dynamic version of the Map that only loads on the client
const DynamicMap = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: MapPlaceholder,
});

export default DynamicMap;