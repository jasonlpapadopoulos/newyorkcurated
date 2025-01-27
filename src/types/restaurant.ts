export interface Restaurant {
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
}