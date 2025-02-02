import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Restaurant } from '../../types/restaurant';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { neighborhoods } = req.query;
    
    if (!neighborhoods) {
      return res.status(400).json({ error: 'Missing neighborhoods parameter' });
    }

    const neighborhoodList = typeof neighborhoods === 'string' 
      ? neighborhoods.split(',').map(n => decodeURIComponent(n))
      : [];

    if (neighborhoodList.length === 0) {
      return res.status(400).json({ error: 'Invalid neighborhoods parameter' });
    }

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
      WHERE neighborhood_clean IN (?)
    `;

    const results = await query(restaurantQuery, [neighborhoodList]);
    
    const restaurants: Restaurant[] = (results as any[]).map(row => ({
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
    }));

    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
}