import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;

interface MapProps {
  places: Place[];
}

export default function MapClient({ places = [] }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // State for selected place (to show in toaster)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      minZoom: 11,
    });

    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapRef.current);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    const validPlaces = places.filter(place => place.lat && place.lon);

    validPlaces.forEach(place => {
      const marker = L.marker([place.lat, place.lon], {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      });

      // Tooltip for name
      marker.bindTooltip(place.place_name, {
        permanent: validPlaces.length <= 5,
        direction: 'top',
        offset: [0, -30],
        opacity: 0.9,
        className: 'place-label'
      });

      // On marker click, show toaster
      marker.on('click', () => {
        setSelectedPlace(place);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
      bounds.extend([place.lat, place.lon]);
    });

  }, [places]);

  // Close toaster when clicking on the map
  useEffect(() => {
    if (!mapRef.current) return;
  
    // Close toaster when clicking on the map
    const handleMapClick = () => {
      setSelectedPlace(null);
    };
  
    mapRef.current.on('click', handleMapClick);
  
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
      }
    };
  }, []);
  

  return (
    <div id="map-view" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Toaster UI */}
      {selectedPlace && (
        <div className="place-toaster show">
          <button className="place-toaster-close" onClick={() => setSelectedPlace(null)}>&times;</button>
          <div className="place-content">
            <h3 className="place-name">{selectedPlace.place_name}</h3>
            {selectedPlace.image_url && (
              <img src={selectedPlace.image_url} alt={selectedPlace.place_name} className="place-image" />
            )}
            <div className="description-container">
              <p className="place-description">
                {selectedPlace.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
