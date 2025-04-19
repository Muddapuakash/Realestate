import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/realestatedb';
let client;
let database;

export async function connectToDatabase() {
  if (!client) {
    try {
      client = new MongoClient(uri);
      await client.connect();
      database = client.db('realestatedb');
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }
  return database;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}