import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapProps {
  restaurants: any[];
}

export default function Map({ restaurants }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Fix for Leaflet icon paths
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapRef.current) {
      mapRef.current = L.map('map-view').setView([40.7128, -74.0060], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    restaurants.forEach(restaurant => {
      const marker = L.marker([
        restaurant.coordinates.lat,
        restaurant.coordinates.lng
      ]).addTo(mapRef.current!);

      marker.bindPopup(`
        <div class="custom-popup">
          <strong>${restaurant.name}</strong><br>
          ${restaurant.cuisine} · ${restaurant.price}
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (restaurants.length > 0) {
      const bounds = L.latLngBounds(
        restaurants.map(r => [r.coordinates.lat, r.coordinates.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Invalidate size when component mounts
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [restaurants]);

  return null;
}