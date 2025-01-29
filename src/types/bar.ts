export interface Bar {
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