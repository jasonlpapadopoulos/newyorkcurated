import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Bar } from '../../types/bar';

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

    const barQuery = `
      SELECT 
        id,
        place_name,
        place_name_clean,
        short_description as description,
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
        pub,
        address,
        place_type
      FROM drinks_staging2
      WHERE neighborhood_clean IN (?)
      order by rand()
    `;

    const results = await query(barQuery, [neighborhoodList]);
    
    const bars: Bar[] = (results as any[]).map(row => ({
      id: row.id,
      place_name: row.place_name,
      place_name_clean: row.place_name_clean,
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
      address: row.address
    }));

    res.status(200).json(bars);
  } catch (error) {
    console.error('Error fetching bars:', error);
    res.status(500).json({ error: 'Error fetching bars' });
  }
}