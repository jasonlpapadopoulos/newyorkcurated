import { NextApiRequest, NextApiResponse } from 'next';
import mysql from '../../lib/db';

interface User {
  id: number;
  firebase_uid: string;
}

interface Bookmark {
  user_id: number;
  place_id: string;
  place_type: 'food' | 'drink';
  saved: number;
  place_name: string;
  cuisine: string | null;
  budget: string;
  image_url: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { firebase_uid } = req.query;

    if (!firebase_uid) {
      return res.status(400).json({ error: 'Missing firebase_uid parameter' });
    }

    try {
      const results = await mysql.query<Bookmark[]>(`
        SELECT b.*, 
               CASE 
                 WHEN b.place_type = 'food' THEN f.place_name 
                 ELSE d.place_name 
               END as place_name,
               CASE 
                 WHEN b.place_type = 'food' THEN f.cuisine 
                 ELSE NULL 
               END as cuisine,
               CASE 
                 WHEN b.place_type = 'food' THEN f.budget 
                 ELSE d.budget 
               END as budget,
               CASE 
                 WHEN b.place_type = 'food' THEN f.image_url 
                 ELSE d.image_url 
               END as image_url
        FROM bookmarks b
        LEFT JOIN food f ON b.place_id = f.id AND b.place_type = 'food'
        LEFT JOIN drinks d ON b.place_id = d.id AND b.place_type = 'drink'
        WHERE b.user_id = (SELECT id FROM users WHERE firebase_uid = ?)
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
    const { firebase_uid, place_id, place_type } = req.body;

    if (!firebase_uid || !place_id || !place_type) {
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
        'SELECT * FROM bookmarks WHERE user_id = ? AND place_id = ? AND place_type = ?',
        [user_id, place_id, place_type]
      );

      if (existing?.length) {
        // Toggle existing bookmark
        await mysql.query(
          'UPDATE bookmarks SET saved = NOT saved WHERE user_id = ? AND place_id = ? AND place_type = ?',
          [user_id, place_id, place_type]
        );
      } else {
        // Create new bookmark
        await mysql.query(
          'INSERT INTO bookmarks (user_id, place_id, place_type, saved) VALUES (?, ?, ?, 1)',
          [user_id, place_id, place_type]
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