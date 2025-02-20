import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import type { Restaurant } from '../../types/restaurant';
import type { Bar } from '../../types/bar';
import type { Cafe } from '../../types/cafe';
import type { PartySpot } from '../../types/partySpot';

const tables = [
  { name: "food_staging", type: "food" },
  { name: "drinks_staging", type: "drinks" },
  { name: "coffee_staging", type: "coffee" },
  { name: "party_staging", type: "party" }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { neighborhood, name } = req.query;

    if (!neighborhood || !name) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const cleanNeighborhood = String(neighborhood).trim().toLowerCase();
    const cleanName = String(name).trim().toLowerCase();

    for (const { name: table, type } of tables) {
      const sqlQuery = `
        SELECT * FROM ${table}
        WHERE neighborhood_clean = ? AND place_name_clean = ?
        LIMIT 1
      `;

      try {
        const results = await query(sqlQuery, [cleanNeighborhood, cleanName]);

        if (Array.isArray(results) && results.length > 0) {
          const row = results[0] as any;
          const response = formatResponse(row, type);
          return res.status(200).json(response);
        }
      } catch (dbError) {
        console.error(`Query error on ${table}:`, dbError);
      }
    }

    return res.status(404).json({ error: "Place not found" });
  } catch (error) {
    console.error("Error fetching place:", error);
    return res.status(500).json({ error: "Error fetching place data" });
  }
}

function formatResponse(row: any, type: string) {
  switch (type) {
    case "food":
      return {
        id: row.id,
        place_name: row.place_name,
        description: row.short_description,
        cuisine: row.cuisine,
        neighborhood: row.neighborhood,
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
      } as Restaurant;
    case "drinks":
      return {
        id: row.id,
        place_name: row.place_name,
        description: row.short_description,
        neighborhood: row.neighborhood,
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
      } as Bar;
    case "coffee":
      return {
        id: row.id,
        place_name: row.place_name,
        description: row.short_description,
        neighborhood: row.neighborhood,
        lat: row.lat,
        lon: row.lon,
        image_url: row.image_url,
        address: row.address || ''
      } as Cafe;
    case "party":
      return {
        id: row.id,
        place_name: row.place_name,
        description: row.short_description,
        neighborhood: row.neighborhood,
        budget: row.budget,
        lat: row.lat,
        lon: row.lon,
        image_url: row.image_url,
        address: row.address || ''
      } as PartySpot;
    default:
      return {};
  }
}
