// Simple in-memory storage
let jobs = [];
let nextId = 1;

// Helper function to handle errors
const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    details: error.stack
  });
};

// Main handler function
const handler = async (req, res) => {
  // Log incoming request
  console.log(`${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Handle OPTIONS (preflight) request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

      // Handle POST request (Create new job)
      if (req.method === 'POST') {
        let body = req.body;
        // Vercel does not parse JSON automatically, so parse if needed
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body);
          } catch (err) {
            return res.status(400).json({ error: 'Invalid JSON in request body' });
          }
        }
        // Ensure we have a body
        if (!body) {
          return res.status(400).json({ error: 'Request body is required' });
        }

        const { company_name, job_role, notes, job_salary, date_applied, app_status } = body;

        // Validate required fields
        if (!company_name || !job_role) {
          return res.status(400).json({ 
            error: 'Missing required fields',
            details: 'company_name and job_role are required'
          });
        }

        // Create new job
        const newJob = {
          id: nextId++,
          company_name,
          job_role,
          notes: notes || '',
          job_salary: job_salary || '',
          date_applied: date_applied || new Date().toISOString().split('T')[0],
          app_status: app_status || 'Applied',
          created_at: new Date().toISOString()
        };

        // Add to our list
        jobs.push(newJob);

        // Log success
        console.log('Successfully created new job:', newJob);

        // Return the created job
        return res.status(201).json(newJob);
      }

    // Handle GET request (List all jobs)
    if (req.method === 'GET') {
      return res.status(200).json(jobs);
    }

    // If we get here, method not supported
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: `The ${req.method} method is not supported`
    });

  } catch (error) {
    handleError(res, error);
  }
};

// Export the handler
module.exports = handler;
