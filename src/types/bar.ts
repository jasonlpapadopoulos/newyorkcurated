export interface Bar {
  id: string;
  place_name: string;
  place_name_clean: string;
  description: string;
  neighborhood: string;
  neighborhood_clean: string;
  budget: '$' | '$$' | '$$$' | '$$$$';
  lat: number;
  lon: number;
  image_url: string;
  bar_category: string;
  speakeasy: boolean;
  jazz: boolean;
  live_music: boolean;
  large_groups: boolean;
  date_spot: boolean;
  happy_hour: boolean;
  tasty_bites: boolean;
  address: string;
  place_type: string;
}