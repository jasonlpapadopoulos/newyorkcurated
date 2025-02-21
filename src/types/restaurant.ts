export interface Restaurant {
  id: string;
  place_name: string;
  place_name_clean : string;
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
  image_url: string;
  reservation_url?: string;
  address?: string;
  place_type: string;
}