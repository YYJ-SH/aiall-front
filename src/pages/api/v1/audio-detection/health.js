// API route for audio detection health check
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://210.125.93.56:8000/api/v1/audio-detection/health');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({ 
      status: 'unhealthy', 
      error: 'Failed to connect to backend service' 
    });
  }
}
