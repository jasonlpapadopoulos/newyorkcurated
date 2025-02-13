import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db'; // Your SQL DB connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firebase_uid, email, first_name } = req.body;

    try {
      const query = 'INSERT INTO users (firebase_uid, email, first_name) VALUES (?, ?, ?)';
      await db.query(query, [firebase_uid, email, first_name]);
      await db.end();

      res.status(200).json({ message: 'User saved successfully!' });
    } catch (error) {
      console.error('Database insertion error:', error);
      res.status(500).json({ error: 'Error saving user to database.' });
    }
  } else if (req.method === 'GET') {
    const { firebase_uid } = req.query;

    try {
        const rows: any = await db.query('SELECT first_name FROM users WHERE firebase_uid = ?', [firebase_uid]);
        await db.end();
        
        if (rows.length > 0) {
          res.status(200).json(rows[0]);
        } else {
          res.status(404).json({ error: 'User not found.' });
        }
      } catch (error) {
        console.error('Database retrieval error:', error);
        res.status(500).json({ error: 'Error fetching user data.' });
      }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}