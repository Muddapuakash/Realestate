// This file serves as a proxy to the Flask backend
// Useful if you want to deploy both frontend and backend together

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the Flask backend
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Get the response from the Flask backend
    const data = await response.json();

    // Return the response from the Flask backend
    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Error connecting to Flask backend:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Failed to connect to prediction service' 
    });
  }
}