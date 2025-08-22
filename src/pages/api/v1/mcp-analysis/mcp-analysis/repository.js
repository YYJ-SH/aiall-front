// API route for GitHub repository analysis
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { repository_url, branch = 'main' } = req.body;

    if (!repository_url) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    const response = await fetch('http://210.125.93.56:8000/api/v1/mcp-analysis/mcp-analysis/repository', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repository_url,
        branch
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Backend error: ${response.status}`);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Repository analysis failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to analyze repository' 
    });
  }
}
