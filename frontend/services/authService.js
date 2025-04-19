import { connectToDatabase } from './mongoUtil';
import bcrypt from 'bcryptjs';

export async function registerUser(email, password) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    return result.insertedId;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}