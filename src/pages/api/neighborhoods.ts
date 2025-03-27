import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Neighborhood } from '../../types/neighborhood';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await query('select neighborhood_name, neighborhood_name_clean, description, borough, broader_area from neighborhoods where neighborhood_name_clean in (select distinct neighborhood_clean from food_2025_03_27) and neighborhood_name_clean in (select distinct neighborhood_clean from drinks_2025_03_27)');

    const neighborhoods: Neighborhood[] = (result as any[]).map(neighborhood => ({
      name: neighborhood.neighborhood_name,
      value: neighborhood.neighborhood_name_clean,
      description: neighborhood.description,
      image: `https://source.unsplash.com/1600x900/?nyc,${neighborhood.neighborhood_name_cleaned}`,
      borough: neighborhood.borough,
      broader_area: neighborhood.broader_area
    }));

    res.status(200).json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}