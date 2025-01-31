export interface Restaurant {
  id: string;
  place_name: string;
  description: string;
  cuisine: string;
  cuisine_clean: string;
  neighborhood: string;
  neighborhood_clean: string;
  budget: '$' | '$$' | '$$$' | '$$$$';
  meals: {
    brunch: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  lat: number;
  lon: number;
  rating: number;
  image_url: string;
}