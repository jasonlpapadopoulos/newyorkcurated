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
        category as bar_category,
        lat,
        lon,
        image_url,
        speakeasy,
        jazz,
        live_music,
        large_groups,
        date_spot,
        happy_hour,
        tasty_bites,
        address,
        place_type
      FROM drinks_staging3
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
      bar_category: row.bar_category,
      lat: row.lat,
      lon: row.lon,
      image_url: row.image_url,
      speakeasy: Boolean(row.speakeasy),
      jazz: Boolean(row.jazz),
      live_music: Boolean(row.live_music),
      large_groups: Boolean(row.large_groups),
      date_spot: Boolean(row.date_spot),
      happy_hour: Boolean(row.happy_hour),
      tasty_bites: Boolean(row.tasty_bites),
      address: row.address,
      place_type: row.place_type
    }));

    res.status(200).json(bars);
  } catch (error) {
    console.error('Error fetching bars:', error);
    res.status(500).json({ error: 'Error fetching bars' });
  }
}