import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { PartySpot } from '../../types/partySpot';

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

    const partySpotQuery = `
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
            budget,
            difficulty_gettting_in,
            entrance
        FROM party_staging
        WHERE neighborhood_clean IN (?)
    `;
    const results = await query(partySpotQuery, [neighborhoodList]);
    
    const partySpots: PartySpot[] = (results as any[]).map(row => ({
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
      budget: row.budget,
      difficulty_gettting_in: row.difficulty_gettting_in,
      entrance: row.entrance
    }));

    res.status(200).json(partySpots);
  } catch (error) {
    console.error('Error fetching partySpots:', error);
    res.status(500).json({ error: 'Error fetching partySpots' });
  }
}