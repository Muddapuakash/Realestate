import { loginUser } from '../../../services/authService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await loginUser(email, password);

      // In a real app, generate a JWT token here
      res.status(200).json({ 
        message: 'Login successful', 
        user: { 
          id: user._id, 
          email: user.email 
        } 
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}