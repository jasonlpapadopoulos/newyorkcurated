import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

type Place = Restaurant | Bar;

interface MapProps {
  places: Place[];
  onMarkerClick: (place: Place) => void;
}

export default function MapClient({ places = [], onMarkerClick }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const labelsRef = useRef<L.Tooltip[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      minZoom: 11
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

    // Clear existing markers and labels
    markersRef.current.forEach(marker => marker.remove());
    labelsRef.current.forEach(label => label.remove());
    markersRef.current = [];
    labelsRef.current = [];

    const bounds = L.latLngBounds([]);
    const validPlaces = places.filter(place => 
      place.coordinates && 
      place.coordinates.lat && 
      place.coordinates.lng
    );

    validPlaces.forEach(place => {
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      });
      
      const tooltip = L.tooltip({
        permanent: validPlaces.length <= 5,
        direction: 'top',
        offset: [0, -30],
        opacity: 0.9,
        className: 'place-label'
      }).setContent(place.name);
      
      marker.addTo(mapRef.current!);
      marker.bindTooltip(tooltip);
      
      marker.on('click', () => {
        onMarkerClick(place);
      });

      markersRef.current.push(marker);
      labelsRef.current.push(tooltip);
      bounds.extend([place.coordinates.lat, place.coordinates.lng]);
    });

    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds.pad(0.2));
    }
  }, [places, onMarkerClick]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ width: '100%', height: '100%' }} 
    />
  );
}