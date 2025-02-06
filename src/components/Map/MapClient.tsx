import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';  // Import the Next.js router
import L from 'leaflet';
import Link from 'next/link';  // Import Next.js Link for routing
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

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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

  useEffect(() => {
    if (!mapRef.current) return;

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

      // Show toaster on marker click
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

  // Create URL slug for the place
  const createSlug = (place: Place) => {
    const nameSlug = place.place_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-');          // Replace spaces with dashes

    return `/place/${place.neighborhood_clean}/${nameSlug}`;
  };

  return (
    <div id="map-view" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Toaster UI */}
      {selectedPlace && (
        <div className="place-toaster show">
          <button className="place-toaster-close" onClick={() => setSelectedPlace(null)}>&times;</button>
          
          {/* Wrap the toaster content in a Link */}
          <Link href={createSlug(selectedPlace)}>
            <div className="place-content" style={{ cursor: 'pointer' }}>
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
          </Link>
        </div>
      )}
    </div>
  );
}
