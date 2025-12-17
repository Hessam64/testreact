import { buildBackendUrl } from '../../lib/backend';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendUrl = buildBackendUrl('/api/businesses');

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Missing Authorization header' });
    }

  try {
    const headers = {};

    headers.Authorization = req.headers.authorization;

    const response = await fetch(backendUrl, { headers });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching businesses from backend:', error);
    return res.status(502).json({ error: 'Failed to reach backend API' });
  }
}
