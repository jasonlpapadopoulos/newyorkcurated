import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Neighborhood } from '../../types/neighborhood';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { category } = req.query;
    let sqlQuery: string;
    
    // Validate and determine which category to filter by
    if (category === 'food') {
      sqlQuery = `
        SELECT neighborhood_name, neighborhood_name_clean, description, borough, broader_area 
        FROM neighborhoods 
        WHERE neighborhood_name_clean IN (SELECT DISTINCT neighborhood_clean FROM food_staging2)
      `;
    } else if (category === 'drinks') {
      sqlQuery = `
        SELECT neighborhood_name, neighborhood_name_clean, description, borough, broader_area 
        FROM neighborhoods 
        WHERE neighborhood_name_clean IN (SELECT DISTINCT neighborhood_clean FROM drinks_staging3)
      `;
    } else if (category === 'coffee') {
      sqlQuery = `
        SELECT neighborhood_name, neighborhood_name_clean, description, borough, broader_area 
        FROM neighborhoods 
        WHERE neighborhood_name_clean IN (SELECT DISTINCT neighborhood_clean FROM coffee_plus)
      `;
    } else if (category === 'party') {
      sqlQuery = `
        SELECT neighborhood_name, neighborhood_name_clean, description, borough, broader_area 
        FROM neighborhoods 
        WHERE neighborhood_name_clean IN (SELECT DISTINCT neighborhood_clean FROM party_staging2)
      `;
    } else if (!category) {
      // If no category specified, return neighborhoods present in both food and drinks
      sqlQuery = `
        SELECT neighborhood_name, neighborhood_name_clean, description, borough, broader_area 
        FROM neighborhoods 
        WHERE neighborhood_name_clean IN (SELECT DISTINCT neighborhood_clean FROM food_staging2)
        AND neighborhood_name_clean IN (SELECT DISTINCT neighborhood_clean FROM drinks_staging3)
      `;
    } else {
      return res.status(400).json({ message: 'Invalid category parameter' });
    }

    const result = await query(sqlQuery);

    const neighborhoods: Neighborhood[] = (result as any[]).map(neighborhood => ({
      name: neighborhood.neighborhood_name,
      value: neighborhood.neighborhood_name_clean,
      description: neighborhood.description,
      image: `https://source.unsplash.com/1600x900/?nyc,${neighborhood.neighborhood_name_clean}`,
      borough: neighborhood.borough,
      broader_area: neighborhood.broader_area || null,
    }));

    res.status(200).json(neighborhoods);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}