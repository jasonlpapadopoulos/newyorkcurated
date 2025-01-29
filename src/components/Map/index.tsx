import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '../../types/restaurant';
import { Bar } from '../../types/bar';

type Place = Restaurant | Bar;

interface MapProps {
  places: Place[];
  onMarkerClick: (place: Place) => void;
}

export default function Map({ places = [], onMarkerClick }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initialBounds = useRef<L.LatLngBounds | null>(null);
  const isAdjusting = useRef(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Add custom zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(mapRef.current);

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapRef.current);

    // Add custom info button
    const InfoControl = L.Control.extend({
      onAdd: function() {
        const button = L.DomUtil.create('button', 'info-button');
        button.innerHTML = 'i';
        
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
        const popup = L.DomUtil.create('div', 'attribution-popup');
        popup.style.display = 'none';
        popup.innerHTML = attribution;
        
        L.DomEvent.on(button, 'click', function() {
          popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        });
        
        const container = L.DomUtil.create('div');
        container.appendChild(button);
        container.appendChild(popup);
        
        return container;
      }
    });

    new InfoControl({ position: 'bottomright' }).addTo(mapRef.current);

    // Cleanup function
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

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Create bounds object
    const bounds = L.latLngBounds([]);

    // Add new markers
    places.forEach(place => {
      if (!place.coordinates || !place.coordinates.lat || !place.coordinates.lng) return;

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng])
        .addTo(mapRef.current!);

      // Handle marker click
      marker.on('click', () => {
        onMarkerClick(place);
      });

      bounds.extend([place.coordinates.lat, place.coordinates.lng]);
    });

    // Only fit bounds if we have valid bounds
    if (bounds.isValid()) {
      // Add some padding to the bounds
      const paddedBounds = bounds.pad(0.2); // 20% padding
      
      mapRef.current.fitBounds(paddedBounds, {
        padding: [50, 50],
        maxZoom: 15
      });
      
      // Store the initial bounds with padding
      initialBounds.current = paddedBounds;

      // Remove any existing moveend listeners
      mapRef.current.off('moveend');

      // Add event listener to prevent zooming/panning beyond initial bounds
      mapRef.current.on('moveend', () => {
        if (isAdjusting.current) return;
        
        const currentBounds = mapRef.current!.getBounds();
        const currentDiagonal = currentBounds.getNorthEast().distanceTo(currentBounds.getSouthWest());
        const initialDiagonal = initialBounds.current!.getNorthEast().distanceTo(initialBounds.current!.getSouthWest());

        // Only prevent zooming out beyond initial bounds
        if (currentDiagonal > initialDiagonal) {
          isAdjusting.current = true;
          mapRef.current!.fitBounds(initialBounds.current!, {
            animate: false
          });
          setTimeout(() => {
            isAdjusting.current = false;
          }, 0);
        }
      });

      // Add zoom end listener to prevent zooming out beyond initial bounds
      mapRef.current.on('zoomend', () => {
        if (isAdjusting.current) return;
        
        const currentZoom = mapRef.current!.getZoom();
        const boundsZoom = mapRef.current!.getBoundsZoom(initialBounds.current!);
        
        if (currentZoom < boundsZoom) {
          isAdjusting.current = true;
          mapRef.current!.setZoom(boundsZoom, {
            animate: false
          });
          setTimeout(() => {
            isAdjusting.current = false;
          }, 0);
        }
      });
    }
  }, [places, onMarkerClick]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
}