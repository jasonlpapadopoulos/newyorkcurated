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
    
    console.log('API Request params:', { neighborhood, name });

    if (!neighborhood || !name) {
      console.log('Missing parameters');
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cleanNeighborhood = String(neighborhood).trim().toLowerCase();
    const cleanName = String(name).trim().toLowerCase();

    console.log('Cleaned parameters:', { cleanNeighborhood, cleanName });

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
        
        reservation_url,
        address
      FROM food
      WHERE neighborhood_clean = ? 
      AND LOWER(REPLACE(REPLACE(place_name, ' ', '-'), '''', '')) = ?
      LIMIT 1
    `;

    console.log('Restaurant query:', restaurantQuery);
    console.log('Query parameters:', [cleanNeighborhood, cleanName]);
    
    let results;
    try {
      results = await query(restaurantQuery, [cleanNeighborhood, cleanName]);
      console.log('Raw restaurant query results:', results);
    } catch (dbError) {
      console.error('Restaurant query error:', dbError);
      throw dbError;
    }
    
    if (Array.isArray(results) && results.length > 0) {
      const row = results[0] as any;
      console.log('Processing restaurant row:', row);
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
        image_url: row.image_url,
        reservation_url: row.reservation_url || '',
        address: row.address || ''
      };
      console.log('Returning restaurant:', restaurant);
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
        
        cocktail,
        dive,
        jazz,
        wine,
        rooftop,
        speakeasy,
        beer,
        pub,
        address
      FROM drinks
      WHERE neighborhood_clean = ?
      AND LOWER(REPLACE(REPLACE(place_name, ' ', '-'), '''', '')) = ?
      LIMIT 1
    `;

    console.log('Bar query:', barQuery);
    console.log('Query parameters:', [cleanNeighborhood, cleanName]);
    
    try {
      results = await query(barQuery, [cleanNeighborhood, cleanName]);
      console.log('Raw bar query results:', results);
    } catch (dbError) {
      console.error('Bar query error:', dbError);
      throw dbError;
    }
    
    if (Array.isArray(results) && results.length > 0) {
      const row = results[0] as any;
      console.log('Processing bar row:', row);
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
        pub: Boolean(row.pub),
        address: row.address || ''
      };
      console.log('Returning bar:', bar);
      return res.status(200).json(bar);
    }

    console.log('No results found for either restaurants or bars');
    return res.status(404).json({ 
      error: 'Place not found',
      params: { neighborhood: cleanNeighborhood, name: cleanName }
    });
  } catch (error) {
    console.error('Error fetching place:', error);
    return res.status(500).json({ 
      error: 'Error fetching place data', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}