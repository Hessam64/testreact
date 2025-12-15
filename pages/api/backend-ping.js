import { getBackendPingUrl } from '../../lib/backend';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const backendUrl = getBackendPingUrl();

  try {
    const response = await fetch(backendUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Backend responded with status ${response.status}`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error calling backend:', error);
    return res.status(502).json({ error: 'Failed to reach backend API' });
  }
}
