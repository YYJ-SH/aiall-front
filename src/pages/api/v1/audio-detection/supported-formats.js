// API route for getting supported audio formats
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/audio-detection/supported-formats');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to get supported formats:', error);
    return res.status(500).json({ 
      error: 'Failed to get supported formats' 
    });
  }
}
