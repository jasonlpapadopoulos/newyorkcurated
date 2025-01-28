import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  restaurants: any[];
  onMarkerClick: (restaurantId: string) => void;
}

export default function Map({ restaurants, onMarkerClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Separate effect for handling the attribution click
  useEffect(() => {
    const clickAttributionButton = () => {
      const attributionButton = document.querySelector('.maplibregl-ctrl-attrib-button');
      if (attributionButton instanceof HTMLButtonElement) {
        attributionButton.click();
      } else {
        // If button not found yet, try again shortly
        setTimeout(clickAttributionButton, 100);
      }
    };

    // Start trying to click the button immediately
    clickAttributionButton();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = () => {
      if (!map.current) {
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=B3BKouph0K50bpJNGU0Y',
          center: [-74.0060, 40.7128],
          zoom: 13,
          attributionControl: true
        });

        map.current.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          'bottom-right'
        );

        map.current.on('error', (e) => {
          console.warn('Map error:', e.error);
        });
      }
    };

    const updateMarkers = () => {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      restaurants.forEach(restaurant => {
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';

        const marker = new maplibregl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([restaurant.coordinates.lng, restaurant.coordinates.lat])
          .setPopup(
            new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'custom-popup',
              offset: 25
            }).setHTML(`
              <div>
                <strong>${restaurant.name}</strong><br>
                ${restaurant.cuisine} · ${restaurant.price}
              </div>
            `)
          )
          .addTo(map.current!);

        // Add click handler to the marker element
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          onMarkerClick(restaurant.id);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds if there are markers
      if (restaurants.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        restaurants.forEach(restaurant => {
          bounds.extend([restaurant.coordinates.lng, restaurant.coordinates.lat]);
        });
        
        map.current!.fitBounds(bounds, {
          padding: 50,
          duration: 0
        });
      }
    };

    initializeMap();

    // Wait for map to load before adding markers
    if (map.current!.loaded()) {
      updateMarkers();
    } else {
      map.current!.on('load', updateMarkers);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [restaurants, onMarkerClick]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}