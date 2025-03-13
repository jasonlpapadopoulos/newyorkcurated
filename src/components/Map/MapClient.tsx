import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import L from 'leaflet';
import Link from 'next/link';
import { Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import type { Cafe } from '../../types/cafe';
import type { PartySpot } from '../../types/partySpot';
import { createPortal } from "react-dom";

type Place = Restaurant | Bar | Cafe | PartySpot;

interface MapProps {
  places: Place[];
  singlePlace?: boolean;
  markerEmojis?: {
    restaurant: string;
    bar: string;
    cafe: string;
    party: string;
  };
  onMarkerClick?: (place: Place) => void;
}

export default function MapClient({ 
  places = [], 
  singlePlace = false,
  markerEmojis = {
    restaurant: '🍽️',
    bar: '🍸',
    cafe: '☕',
    party: '🪩'
  },
  onMarkerClick
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [initialBounds, setInitialBounds] = useState<L.LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState(11);


  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
  
    mapRef.current = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060],
      zoom: singlePlace ? 15 : 11,
      zoomControl: false,
      minZoom: singlePlace ? 13 : 11,
      attributionControl: false
    });
  
    L.control.zoom({ position: 'bottomleft' }).addTo(mapRef.current);
  
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapRef.current);
  
    // Detect user interaction
    mapRef.current.on('zoomstart', () => setUserInteracted(true));
    mapRef.current.on('dragstart', () => setUserInteracted(true));
    mapRef.current.on('zoomend', () => setCurrentZoom(mapRef.current!.getZoom()));
  
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [singlePlace]);
  
  const handleLocationClick = () => {
    setIsLocating(true);
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 12 });
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const onLocationFound = (e: L.LocationEvent) => {
      setIsLocating(false);
      
      // Remove existing user marker if any
      if (userMarker) {
        userMarker.remove();
      }

      // Create custom icon for user location
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: #4A90E2;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Add new marker
      const marker = L.marker(e.latlng, { icon: userIcon })
        .addTo(map)
        .bindPopup('You are here')
        .openPopup();

      setUserMarker(marker);
    };

    const onLocationError = () => {
      setIsLocating(false);
      alert('Unable to find your location. Please make sure location services are enabled.');
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
    };
  }, [mapRef.current, userMarker]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    const validPlaces = places.filter(place => place.lat && place.lon);

    validPlaces.forEach(place => {
      const isRestaurant = 'cuisine' in place;
      const markerEmoji = 
        isRestaurant ? markerEmojis.restaurant :
        place.place_type == 'food' ? markerEmojis.restaurant : 
        place.place_type == 'coffee' ? markerEmojis.cafe : 
        place.place_type == 'party' ? markerEmojis.party : 
        markerEmojis.bar;

    
      const icon = L.divIcon({
        className: 'custom-marker',
        // html: `<div style="
        //   width: 24px;
        //   height: 24px;
        //   background-color: ${markerColor};
        //   border: 2px solid white;
        //   border-radius: 50%;
        //   box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        // "></div>`,
        html: `<div style="
        width: 36px;
        height: 36px;
        background-color: black; /* Circle background */
        border-radius: 50%; /* Makes it a circle */
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${markerEmoji}
      </div>`,
      
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
          permanent: currentZoom >= 15, 
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
    

    if (singlePlace && validPlaces.length === 1 && !userInteracted) {
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

  }, [places, singlePlace, markerEmojis, onMarkerClick, currentZoom]);

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
  
  const handleResetView = () => {
    if (mapRef.current && initialBounds) {
      mapRef.current.fitBounds(initialBounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1
      });
    }
  };

  // Create URL slug for the place
  const createSlug = (place: Place) => {
    return `/place/${place.neighborhood_clean}/${place.place_name_clean}`;
  };

  return (
    <div id="map-view" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div className="map-controls">
      <button 
        className="map-button" 
        onClick={handleLocationClick}
        disabled={isLocating}
      >
        <Locate size={16} />
        {isLocating ? 'Locating...' : 'My Location'}
      </button>
      </div>

      {!singlePlace && !onMarkerClick && selectedPlace &&
  createPortal(
    <div className="place-toaster show">
      <button className="place-toaster-close" onClick={() => setSelectedPlace(null)}>&times;</button>
      <a href={createSlug(selectedPlace)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
  <div className="place-content" style={{ cursor: "pointer" }}>
    <h4 className="place-name">{selectedPlace.place_name}</h4>
    <div className="place-info">
      {"budget" in selectedPlace && <span>{(selectedPlace as { budget: string }).budget}</span>}
    </div>
    {selectedPlace.image_url && (
      <img src={selectedPlace.image_url} alt={selectedPlace.place_name} className="place-image" />
    )}
    <div className="description-container">
      <p className="place-description">
        {selectedPlace.description
          ? selectedPlace.description.length > 150
            ? selectedPlace.description.slice(0, selectedPlace.description.lastIndexOf(" ", 150)) + "..."
            : selectedPlace.description
          : ""}
      </p>
    </div>
  </div>
</a>

    </div>,
    document.body // This moves it outside the overflow:hidden parent
  )
}
    </div>
  );
}