// scripts/seed-properties.js
const { MongoClient } = require('mongodb');

async function seedDatabase() {
  let client;
  
  try {
    client = await MongoClient.connect('mongodb://localhost:27017/realestatedb');
    const db = client.db();
    
    // Check if collection exists and drop it to start fresh
    const collections = await db.listCollections({ name: 'properties' }).toArray();
    if (collections.length > 0) {
      await db.collection('properties').drop();
    }
    
    // Create properties collection
    const propertiesCollection = db.collection('properties');
    
    // Insert sample properties
    await propertiesCollection.insertMany([
      { 
        name: "Luxury Villa", 
        price: "$500,000", 
        location: "Los Angeles", 
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2500,
        description: "Beautiful luxury villa with panoramic views"
      },
      { 
        name: "Modern Apartment", 
        price: "$300,000", 
        location: "New York",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        description: "Sleek modern apartment in the heart of the city"
      },
      { 
        name: "Beachfront Condo", 
        price: "$450,000", 
        location: "Miami",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        description: "Stunning beachfront property with direct ocean access"
      },
      { 
        name: "Mountain Retreat", 
        price: "$275,000", 
        location: "Denver",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1700,
        description: "Cozy mountain home with breathtaking views"
      }
    ]);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (client) await client.close();
  }
}

seedDatabase();