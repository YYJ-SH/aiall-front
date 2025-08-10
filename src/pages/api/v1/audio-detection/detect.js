import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// API route for audio deepfake detection
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB limit for audio files
    });

    const [fields, files] = await form.parse(req);
    const audioFile = files.audio;

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Create form data for backend request
    const formData = new FormData();
    const fileStream = fs.createReadStream(audioFile.filepath);
    formData.append('audio', fileStream, {
      filename: audioFile.originalFilename,
      contentType: audioFile.mimetype,
    });

    const response = await fetch('http://127.0.0.1:8000/api/v1/audio-detection/detect', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Backend error: ${response.status}`);
    }

    // Clean up temporary file
    try {
      fs.unlinkSync(audioFile.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', audioFile.filepath);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Audio detection failed:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to detect audio deepfake' 
    });
  }
}
