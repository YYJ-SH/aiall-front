import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// API route for file upload analysis
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const uploadedFiles = files.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Create form data for backend request
    const formData = new FormData();
    
    const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    
    for (const file of fileArray) {
      const fileStream = fs.createReadStream(file.filepath);
      formData.append('files', fileStream, {
        filename: file.originalFilename,
        contentType: file.mimetype,
      });
    }

    const response = await fetch('http://127.0.0.1:8000/api/v1/mcp-analysis/mcp-analysis/files', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Backend error: ${response.status}`);
    }

    // Clean up temporary files
    for (const file of fileArray) {
      try {
        fs.unlinkSync(file.filepath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', file.filepath);
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('File analysis failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to analyze files' 
    });
  }
}
