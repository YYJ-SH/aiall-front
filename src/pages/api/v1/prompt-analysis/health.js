// API route for prompt analysis health check
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/prompt-analysis/health');
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
