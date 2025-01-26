interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  neighborhood: string;
  price: '$' | '$$' | '$$$' | '$$$$';
  meals: {
    breakfast: boolean;
    brunch: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  imageUrl: string;
  address: string;
}

export const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Joe's Pizza",
    description: "Classic New York pizza joint serving huge slices since 1975",
    cuisine: "Italian",
    neighborhood: "west-village",
    price: '$$',
    meals: {
      breakfast: false,
      brunch: false,
      lunch: true,
      dinner: true
    },
    coordinates: {
      lat: 40.7305,
      lng: -74.0023
    },
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    address: "7 Carmine St, New York, NY 10014"
  },
  {
    id: '2',
    name: "Blue Ribbon Sushi",
    description: "Upscale sushi restaurant known for fresh fish and intimate atmosphere",
    cuisine: "Japanese",
    neighborhood: "soho",
    price: '$$$$',
    meals: {
      breakfast: false,
      brunch: false,
      lunch: true,
      dinner: true
    },
    coordinates: {
      lat: 40.7223,
      lng: -73.9987
    },
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    address: "119 Sullivan St, New York, NY 10012"
  },
  {
    id: '3',
    name: "Clinton Street Baking Company",
    description: "Famous for pancakes and brunch, this Lower East Side institution always has a line",
    cuisine: "American",
    neighborhood: "lower-east-side",
    price: '$$',
    meals: {
      breakfast: true,
      brunch: true,
      lunch: true,
      dinner: false
    },
    coordinates: {
      lat: 40.7204,
      lng: -73.9847
    },
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
    address: "4 Clinton St, New York, NY 10002"
  }
];

export const cuisines = [
  "American",
  "Italian",
  "Japanese",
  "Chinese",
  "Mexican",
  "Thai",
  "Indian",
  "French",
  "Mediterranean",
  "Korean"
];