// API route for prompt analysis
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('http://127.0.0.1:8000/api/v1/prompt-analysis/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Backend error: ${response.status}`);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Prompt analysis failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to analyze prompt' 
    });
  }
}
