interface Bar {
  id: string;
  name: string;
  description: string;
  neighborhood: string;
  price: '$' | '$$' | '$$$' | '$$$$';
  setting: 'Speakeasy' | 'Dive Bar' | 'Live Jazz' | 'Cocktail Bar' | 'Wine Bar';
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  imageUrl: string;
}

export const sampleBars: Bar[] = [
  {
    id: '1',
    name: "Death & Co",
    description: "Intimate speakeasy-style cocktail bar known for innovative drinks and expert mixology",
    neighborhood: "east-village",
    price: '$$$',
    setting: 'Speakeasy',
    coordinates: {
      lat: 40.7246,
      lng: -73.9847
    },
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2969&auto=format&fit=crop"
  },
  {
    id: '2',
    name: "Blue Note Jazz Club",
    description: "Historic venue featuring world-class jazz performances and fine dining",
    neighborhood: "west-village",
    price: '$$$',
    setting: 'Live Jazz',
    coordinates: {
      lat: 40.7307,
      lng: -74.0007
    },
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2970&auto=format&fit=crop"
  },
  {
    id: '3',
    name: "169 Bar",
    description: "Eclectic dive bar with a vintage vibe, pool table, and cheap drinks",
    neighborhood: "lower-east-side",
    price: '$',
    setting: 'Dive Bar',
    coordinates: {
      lat: 40.7145,
      lng: -73.9915
    },
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2974&auto=format&fit=crop"
  }
];

export const settings = [
  'Speakeasy',
  'Dive Bar',
  'Live Jazz',
  'Cocktail Bar',
  'Wine Bar'
];