import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SEO from '../../../components/SEO';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { auth } from '../../../lib/firebase';
import type { Restaurant } from '../../../types/restaurant';
import type { Bar } from '../../../types/bar';
import type { Cafe } from '../../../types/cafe';
import type { PartySpot } from '../../../types/partySpot';
import IndividualPlace from '../../../components/IndividualPlace';

const Map = dynamic(() => import('../../../components/Map/MapClient'), {
  ssr: false
});

type Place = Restaurant | Bar | Cafe | PartySpot;

interface PlacePageProps {
  place: Place | null;
  error: string | null;
}

export default function PlacePage({ place, error }: PlacePageProps) {
  const { isPlaceBookmarked, toggleBookmark } = useBookmarks();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<React.ReactNode | null>(null);

  if (error || !place) {
    return <div className="error">Error: {error || 'Place not found'}</div>;
  }

  // useEffect(() => {
  //   if (isRestaurant && place.place_name === "Bad Roman") {
  //     // Check if script already exists
  //     if (!document.getElementById("opentable-script")) {
  //       const script = document.createElement("script");
  //       script.src = "https://www.opentable.com/widget/reservation/loader?rid=1268701&domain=com&type=standard&theme=standard&lang=en-US&overlay=false&iframe=true";
  //       script.async = true;
  //       script.id = "opentable-script"; // Assign an ID to prevent duplicates
  //       document.body.appendChild(script);
  //     }
  //   }
  // }, [place]);

  const isRestaurant = 'cuisine' in place;

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);

    if (!auth.currentUser) {
      setSaveMessage(
        <span>
          You need an account to save a place.{' '}
          <Link href="/auth" passHref>
            <a className="custom-link" target="_blank" rel="noopener noreferrer">
              Sign up or log in.
            </a>
          </Link>
        </span>
      );
      setIsSaving(false);
      return;
    }

    const wasBookmarked = isPlaceBookmarked(place.id);
    
    await toggleBookmark(
      place.id,
      isRestaurant ? 'food' : 'drink'
    );

    if (wasBookmarked) {
      setSaveMessage(null);
    } else {
      setSaveMessage(
        <span>
          You can see your saved places in your{' '}
          <Link href="/account" passHref>
            <a className="custom-link" target="_blank" rel="noopener noreferrer">
              account.
            </a>
          </Link>
        </span>
      );
    }
    
    setIsSaving(false);
  };
  
  const structuredData = isRestaurant ? {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": place.place_name,
    "description": place.description,
    "image": place.image_url,
    "servesCuisine": (place as Restaurant).cuisine,
    "priceRange": place.budget,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "addressCountry": "US",
      "streetAddress": place.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.lat,
      "longitude": place.lon
    }
  } : {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "name": place.place_name,
    "description": place.description,
    "image": place.image_url,
    "priceRange": place.budget,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "addressCountry": "US",
      "streetAddress": place.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.lat,
      "longitude": place.lon
    }
  };
  console.log("IndividualPlace:", IndividualPlace);

  return (
    <>
      <SEO 
        title={`${place.place_name} - ${isRestaurant ? place.cuisine : 'Bar'} in ${place.neighborhood} | NYC Curated`}
        description={place.description}
        image={place.image_url}
        type="business.business"
        structuredData={structuredData}
      />
      
      <div className="place-page">
        <div className="place-hero">
          <img 
            src={place.image_url} 
            alt={place.place_name}
            className="place-hero-image"
          />
        </div>

        <div className="individual-place-content">
          <h1 className="place-title">{place.place_name}</h1>
          
          <IndividualPlace place={place} />


          <p className="place-description">{place.description}</p>

          {isRestaurant &&
          (place as Restaurant).reservation_url &&
          (place as Restaurant).reservation_url!.startsWith('http') && (
            <a 
              href={(place as Restaurant).reservation_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="reservation-button"
            >
              Make a Reservation
            </a>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`reservation-button ${isPlaceBookmarked(place.id) ? 'saved' : ''}`}
          >
            {isPlaceBookmarked(place.id) ? 'Saved!' : 'Save'}
          </button>

          {saveMessage && (
            <div className="place-meta">
              {saveMessage}
            </div>
          )}
          <div className="place-map">
            <Map 
              places={[place]}
              singlePlace={true}
            />
          </div>
        </div>
      </div>
{/* 
      {isRestaurant && place.place_name === "Bad Roman" && (
  <div id="ot-widget-container"></div>
)} */}

    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { neighborhood, name } = context.query;

  if (!neighborhood || !name) {
    return {
      props: {
        place: null,
        error: 'Invalid parameters'
      }
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/places?neighborhood=${encodeURIComponent(neighborhood as string)}&name=${encodeURIComponent(name as string)}`
    );
    
    if (!response.ok) {
      throw new Error('Place not found');
    }

    const data = await response.json();
    
    // Add debugging log
    // console.log('Server-side data:', data);
    console.log('Request URL:', `${baseUrl}/api/places?neighborhood=${encodeURIComponent(neighborhood as string)}&name=${encodeURIComponent(name as string)}`);

    return {
      props: {
        place: data,
        error: null
      }
    };
  } catch (error: unknown) {
    return {
      props: {
        place: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    };
  }
};