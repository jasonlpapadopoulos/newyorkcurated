import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add cache headers for API responses
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  
  // Handle 404 for undefined API routes
  res.status(404).json({ error: 'Not Found' });
}