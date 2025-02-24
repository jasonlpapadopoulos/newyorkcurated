import { NextApiRequest, NextApiResponse } from 'next';
import mysql from '../../lib/db';

interface User {
  id: number;
  firebase_uid: string;
}

interface Bookmark {
  user_id: number;
  place_id: string;
  place_type: string;
  saved: number;
  place_name: string;
  cuisine: string | null;
  budget: string;
  image_url: string;
  place_name_clean: string;
  neighborhood_clean: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { firebase_uid } = req.query;

    if (!firebase_uid) {
      return res.status(400).json({ error: 'Missing firebase_uid parameter' });
    }

    try {
      const results = await mysql.query<Bookmark[]>(`
      SELECT
          b.*,
          coalesce(f.place_name_clean, d.place_name_clean, c.place_name_clean, p.place_name_clean) as place_name_clean,
          coalesce(f.neighborhood_clean, d.neighborhood_clean, c.neighborhood_clean, d.neighborhood_clean) as neighborhood_clean,
          coalesce(f.place_name, d.place_name, c.place_name, p.place_name) as place_name,
          f.cuisine,
          coalesce(f.budget, d.budget, p.budget) as budget,
          coalesce(f.image_url, d.image_url, c.image_url, p.image_url) as image_url,
          coalesce(f.place_type, d.place_type, c.place_type, p.place_type) as place_type
      FROM
          bookmarks b
      LEFT JOIN
          food_staging2 f
              ON b.place_id = f.id
      LEFT JOIN
          drinks_staging2 d
              ON b.place_id = d.id
      LEFT JOIN
          coffee_staging2 c
              ON b.place_id = c.id
      LEFT JOIN
          party_staging2 p
              ON b.place_id = p.id
      WHERE
          b.user_id = (SELECT id FROM users WHERE firebase_uid = ?)
              AND b.saved = 1
      `, [firebase_uid]);

      await mysql.end();
      return res.status(200).json(results);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'POST') {
    const { firebase_uid, place_id } = req.body;

    if (!firebase_uid || !place_id) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      // First, get the user_id from firebase_uid
      const users = await mysql.query<User[]>(
        'SELECT id FROM users WHERE firebase_uid = ?',
        [firebase_uid]
      );
      
      if (!users?.length) {
        await mysql.end();
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user_id = users[0].id;

      // Check if bookmark exists
      const existing = await mysql.query<Bookmark[]>(
        'SELECT * FROM bookmarks WHERE user_id = ? AND place_id = ?',
        [user_id, place_id]
      );

      if (existing?.length) {
        // Toggle existing bookmark
        await mysql.query(
          'UPDATE bookmarks SET saved = NOT saved WHERE user_id = ? AND place_id = ?',
          [user_id, place_id]
        );
      } else {
        // Create new bookmark
        await mysql.query(
          'INSERT INTO bookmarks (user_id, place_id, saved) VALUES (?, ?, 1)',
          [user_id, place_id]
        );
      }

      await mysql.end();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}