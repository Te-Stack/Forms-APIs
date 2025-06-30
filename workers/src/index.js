// Cloudflare Workers Contact Form API
// This runs at the edge globally

export default {
    async fetch(request, env, ctx) {
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
  
      // Only handle POST requests to /contact
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
  
      try {
        // Parse the request body
        const data = await request.json();
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
          return new Response(JSON.stringify({ 
            error: 'Missing required fields: name, email, message' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
  
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return new Response(JSON.stringify({ 
            error: 'Invalid email format' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
  
        // Get edge location info for demonstration
        const cf = request.cf || {};
        const edgeLocation = cf.colo || 'Unknown';
        const country = cf.country || 'Unknown';
  
        // Simulate processing (in real app, you'd save to database, send email, etc.)
        const response = {
          success: true,
          message: 'Contact form submitted successfully!',
          data: {
            name: data.name,
            email: data.email,
            messageLength: data.message.length,
            timestamp: new Date().toISOString(),
            processedAt: `${edgeLocation}, ${country}`,
            edgeInfo: {
              datacenter: edgeLocation,
              country: country,
              timezone: cf.timezone || 'Unknown'
            }
          }
        };
  
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
  
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Invalid JSON data' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    },
  };