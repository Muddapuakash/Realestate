import { registerUser } from '../../../services/authService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const userId = await registerUser(email, password);

      res.status(201).json({ 
        message: 'Registration successful', 
        userId 
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        res.status(409).json({ message: 'User already exists' });
      } else {
        res.status(500).json({ message: 'Registration failed' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}