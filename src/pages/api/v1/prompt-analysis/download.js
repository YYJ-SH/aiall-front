// API route for downloading prompt analysis files
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch('http://127.0.0.1:8000/api/v1/prompt-analysis/analyze/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    // Forward the file response
    const buffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="security_analysis_files.zip"');
    
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('File download failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to download files' 
    });
  }
}
