// /pages/api/properties.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // MongoDB connection should only happen on the server side (in API routes)
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const propertiesCollection = db.collection('properties');
    
    const properties = await propertiesCollection.find().toArray();
    
    await client.close();
    
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database', error: error.message });
  }
}