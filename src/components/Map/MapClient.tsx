import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import type { Cafe } from '../../types/cafe';
import type { PartySpot } from '../../types/partySpot';

type Place = Restaurant | Bar | Cafe | PartySpot;

interface MapProps {
  places: Place[];
  singlePlace?: boolean;
  markerColors?: {
    restaurant: string;
    bar: string;
  };
  onMarkerClick?: (place: Place) => void;
}

export default function MapClient({ 
  places = [], 
  singlePlace = false,
  markerColors = {
    restaurant: '#4A90E2', // Blue for restaurants
    bar: '#FF9F1C' // Orange for bars
  },
  onMarkerClick
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);


  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
  
    mapRef.current = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060],
      zoom: singlePlace ? 15 : 11,
      zoomControl: false,
      attributionControl: false,
      minZoom: singlePlace ? 13 : 11,
    });
  
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
  
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapRef.current);
  
    // Detect user interaction
    mapRef.current.on('zoomstart', () => setUserInteracted(true));
    mapRef.current.on('dragstart', () => setUserInteracted(true));
  
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [singlePlace]);
  

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    const validPlaces = places.filter(place => place.lat && place.lon);

    validPlaces.forEach(place => {
      const isRestaurant = 'cuisine' in place;
      const markerColor = isRestaurant ? markerColors.restaurant : markerColors.bar;
    
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: ${markerColor};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });
    
      const marker = L.marker([place.lat, place.lon], { icon });
    
      if (singlePlace) {
        marker.bindPopup(`
          <div style="text-align: center;">
            <strong>${place.place_name}</strong><br>
            ${place.address}
          </div>
        `)
        mapRef.current?.whenReady(() => {
          setTimeout(() => {
            marker.openPopup();
          }, 100);  // Small delay (100ms)
        });
      } else {
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(place);
          } else {
            setSelectedPlace(place);
          }
        });
    
        marker.bindTooltip(place.place_name, {
          permanent: validPlaces.length <= 5,
          direction: 'top',
          offset: [0, -8],
          opacity: 0.9,
          className: 'place-label'
        });
      }
    
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
      bounds.extend([place.lat, place.lon]);
    });
    

    if (singlePlace && validPlaces.length === 1) {
      const place = validPlaces[0];
      setTimeout(() => {
        mapRef.current?.setView([place.lat, place.lon], 15, {
          animate: true,
          duration: 1
        });
      }, 100);
    } else if (validPlaces.length > 0 && !userInteracted) {
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1
      });
    }

  }, [places, singlePlace, markerColors, onMarkerClick]);

  useEffect(() => {
    if (!mapRef.current || singlePlace) return;

    const handleMapClick = () => {
      setSelectedPlace(null);
    };

    mapRef.current.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
      }
    };
  }, [singlePlace]);

  useEffect(() => {
    setUserInteracted(false);
  }, [places]);
  

  // Create URL slug for the place
  const createSlug = (place: Place) => {
    const nameSlug = place.place_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    return `/place/${place.neighborhood_clean}/${nameSlug}`;
  };

  return (
    <div id="map-view" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {!singlePlace && !onMarkerClick && selectedPlace && (
        <div className="place-toaster show">
          <button className="place-toaster-close" onClick={() => setSelectedPlace(null)}>&times;</button>
          
          <Link href={createSlug(selectedPlace)}>
            <div className="place-content" style={{ cursor: 'pointer' }}>
              <h3 className="place-name">{selectedPlace.place_name}</h3>
              <h3 className="place-info">
                {/* {selectedPlace.cuisine}
                <span>·</span> */}
                {"budget" in selectedPlace && <span>{(selectedPlace as { budget: string }).budget}</span>}
              </h3>
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