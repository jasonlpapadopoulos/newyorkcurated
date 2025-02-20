import React from 'react';
import type { Restaurant } from '../types/restaurant';
import type { Bar } from '../types/bar';
import type { Cafe } from '../types/cafe';
import type { PartySpot } from '../types/partySpot';

// Type guards to determine the place type dynamically
function isItRestaurant(place: any): place is Restaurant {
  return 'cuisine' in place && 'meals' in place;
}

function isBar(place: any): place is Bar {
  return ['cocktail', 'dive', 'jazz', 'wine', 'rooftop', 'speakeasy', 'beer', 'pub'].some(key => key in place);
}

function isCafe(place: any): place is Cafe {
  return !('budget' in place) && !('cuisine' in place);
}

function isPartySpot(place: any): place is PartySpot {
  return 'budget' in place && !('cuisine' in place);
}

interface IndividualPlaceProps {
  place: Restaurant | Bar | Cafe | PartySpot;
}

const IndividualPlace: React.FC<IndividualPlaceProps> = ({ place }) => {
  return (
    <div className="place-meta">
    <span>{place.neighborhood}</span>
        {isItRestaurant(place) && (
            <>
            <span className="separator">·</span>
            <span>{place.cuisine}</span>
            </>
        )}

        {(isItRestaurant(place) || isBar(place) || isPartySpot(place)) && place.budget && (
            <>
            <span className="separator">·</span>
            <span>{place.budget}</span>
            </>
        )}
    </div>
  );
};

export default IndividualPlace;
