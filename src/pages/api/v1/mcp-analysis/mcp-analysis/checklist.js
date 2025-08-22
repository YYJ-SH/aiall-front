// API route for MCP analysis checklist
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://210.125.93.56:8000/api/v1/mcp-analysis/mcp-analysis/checklist');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Checklist fetch failed:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch security checklist' 
    });
  }
}
