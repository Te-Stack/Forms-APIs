// api/contact.js - Vercel API Route
// This must be part of a frontend project, runs regionally

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { name, email, message } = req.body;
  
      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, email, message' 
        });
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Invalid email format' 
        });
      }
  
      // Get server info for comparison with Workers
      const serverRegion = process.env.VERCEL_REGION || 'unknown';
      const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || 'local';
  
      // Simulate processing
      const response = {
        success: true,
        message: 'Contact form submitted successfully!',
        data: {
          name,
          email,
          messageLength: message.length,
          timestamp: new Date().toISOString(),
          processedAt: `Vercel ${serverRegion}`,
          serverInfo: {
            region: serverRegion,
            deploymentId: deploymentId.substring(0, 8) + '...',
            runtime: 'Node.js'
          }
        }
      };
  
      res.status(200).json(response);
  
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }