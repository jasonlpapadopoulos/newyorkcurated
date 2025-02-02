import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { neighborhood, name } = req.query;
    
    if (!neighborhood || !name) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Clean and normalize the parameters
    const cleanNeighborhood = String(neighborhood).trim().toLowerCase();
    const cleanName = String(name).trim().toLowerCase();

    // Try restaurants first
    const restaurantQuery = `
      SELECT 
        id,
        place_name,
        description,
        cuisine,
        cuisine_clean,
        neighborhood,
        neighborhood_clean,
        budget,
        brunch,
        lunch,
        dinner,
        lat,
        lon,
        image_url
      FROM food
      WHERE neighborhood_clean = ? 
      AND LOWER(REPLACE(REPLACE(place_name, ' ', '-'), '''', '')) = ?
      LIMIT 1
    `;
    
    let results = await query(restaurantQuery, [cleanNeighborhood, cleanName]);
    
    if (Array.isArray(results) && results.length > 0) {
      const row = results[0] as any;
      const restaurant: Restaurant = {
        id: row.id,
        place_name: row.place_name,
        description: row.description,
        cuisine: row.cuisine,
        cuisine_clean: row.cuisine_clean,
        neighborhood: row.neighborhood,
        neighborhood_clean: row.neighborhood_clean,
        budget: row.budget,
        meals: {
          brunch: Boolean(row.brunch),
          lunch: Boolean(row.lunch),
          dinner: Boolean(row.dinner)
        },
        lat: row.lat,
        lon: row.lon,
        image_url: row.image_url
      };
      return res.status(200).json(restaurant);
    }

    // If not found in restaurants, try bars
    const barQuery = `
      SELECT 
        id,
        place_name,
        description,
        neighborhood,
        neighborhood_clean,
        budget,
        lat,
        lon,
        image_url,
        cocktail,
        dive,
        jazz,
        wine,
        rooftop,
        speakeasy,
        beer,
        pub
      FROM drinks
      WHERE neighborhood_clean = ?
      AND LOWER(REPLACE(REPLACE(place_name, ' ', '-'), '''', '')) = ?
      LIMIT 1
    `;
    
    results = await query(barQuery, [cleanNeighborhood, cleanName]);
    
    if (Array.isArray(results) && results.length > 0) {
      const row = results[0] as any;
      const bar: Bar = {
        id: row.id,
        place_name: row.place_name,
        description: row.description,
        neighborhood: row.neighborhood,
        neighborhood_clean: row.neighborhood_clean,
        budget: row.budget,
        lat: row.lat,
        lon: row.lon,
        image_url: row.image_url,
        cocktail: Boolean(row.cocktail),
        dive: Boolean(row.dive),
        jazz: Boolean(row.jazz),
        wine: Boolean(row.wine),
        rooftop: Boolean(row.rooftop),
        speakeasy: Boolean(row.speakeasy),
        beer: Boolean(row.beer),
        pub: Boolean(row.pub)
      };
      return res.status(200).json(bar);
    }

    return res.status(404).json({ 
      error: 'Place not found',
      params: { neighborhood: cleanNeighborhood, name: cleanName }
    });
  } catch (error) {
    console.error('Error fetching place:', error);
    return res.status(500).json({ 
      error: 'Error fetching place data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}