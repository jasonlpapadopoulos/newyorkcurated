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
  cocktail: boolean;
  dive: boolean;
  jazz: boolean;
  wine: boolean;
  rooftop: boolean;
  speakeasy: boolean;
  beer: boolean;
  pub: boolean;
  address: string;
}