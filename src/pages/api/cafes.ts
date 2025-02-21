import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Cafe } from '../../types/cafe';

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

    const cafeQuery = `
      SELECT 
        id,
        place_name,
        place_name_clean,
        short_description as description,
        neighborhood,
        neighborhood_clean,
        lat,
        lon,
        image_url,
        address,
        place_type
      FROM coffee_staging2
      WHERE neighborhood_clean IN (?)
      order by rand()
    `;
    const results = await query(cafeQuery, [neighborhoodList]);
    
    const cafes: Cafe[] = (results as any[]).map(row => ({
      id: row.id,
      place_name: row.place_name,
      place_name_clean: row.place_name_clean,
      description: row.description,
      neighborhood: row.neighborhood,
      neighborhood_clean: row.neighborhood_clean,
      lat: row.lat,
      lon: row.lon,
      image_url: row.image_url,
      address: row.address,
      place_type: row.place_type,
    }));

    res.status(200).json(cafes);
  } catch (error) {
    console.error('Error fetching cafes:', error);
    res.status(500).json({ error: 'Error fetching cafes' });
  }
}