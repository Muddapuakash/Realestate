// File: /pages/api/indian-real-estate-data.js

import axios from 'axios';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { city, propertyType } = req.query;

    // Fetch data from all sources
    const housingData = await fetchHousingData(city, propertyType);
    const acresData = await fetch99AcresData(city, propertyType);
    const magicBricksData = await fetchMagicBricksData(city, propertyType);

    // Combine and normalize data
    const combinedData = mergeAndNormalizeData(housingData, acresData, magicBricksData);

    return res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching Indian real estate data:', error);
    return res.status(500).json({ message: 'Failed to fetch real estate data', error: error.message });
  }
}

// Fetch from Housing.com (using mock data for now)
async function fetchHousingData(city, propertyType) {
  try {
    // Uncomment and use the API call when you have a real API key
    /*
    const API_KEY = 'YOUR_PUBLIC_HOUSING_API_KEY'; // Replace with real key if available

    const response = await axios.get('https://zillow-com1.p.rapidapi.com/offMarket', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      },
      params: { zip: '10019', city, property_type: propertyType }
    });

    console.log('Housing API Response:', response.data); // Log or process response data

    return response.data.results || getMockHousingData(city); // Use real data or fallback mock
    */
    
    // For now, just return mock data
    return getMockHousingData(city);
  } catch (error) {
    console.error('Error fetching Housing.com data:', error);
    return getMockHousingData(city);
  }
}

// Fetch from 99acres (using mock data for now)
async function fetch99AcresData(city, propertyType) {
  try {
    // Uncomment and use the API call when you have a real API key
    /*
    const API_KEY = 'YOUR_PUBLIC_99ACRES_API_KEY'; // Replace with real key if available

    const response = await axios.get('https://example-99acres-api.com/data', {
      headers: { 'api-key': API_KEY },
      params: { city, type: propertyType }
    });

    console.log('99acres API Response:', response.data);

    return response.data.results || getMock99AcresData(city);
    */
    
    // For now, just return mock data
    return getMock99AcresData(city);
  } catch (error) {
    console.error('Error fetching 99acres data:', error);
    return getMock99AcresData(city);
  }
}

// Fetch from MagicBricks (using mock data for now)
async function fetchMagicBricksData(city, propertyType) {
  try {
    // Uncomment and use the API call when you have a real API key
    /*
    const API_KEY = 'YOUR_PUBLIC_MAGICBRICKS_API_KEY'; // Replace with real key if available

    const response = await axios.get('https://example-magicbricks-api.com/trends', {
      headers: { 'X-API-KEY': API_KEY },
      params: { city, property_type: propertyType }
    });

    console.log('MagicBricks API Response:', response.data);

    return response.data.results || getMockMagicBricksData(city);
    */
    
    // For now, just return mock data
    return getMockMagicBricksData(city);
  } catch (error) {
    console.error('Error fetching MagicBricks data:', error);
    return getMockMagicBricksData(city);
  }
}

// Merge and normalize data
function mergeAndNormalizeData(housingData, acresData, magicBricksData) {
  const mergedDataMap = new Map();

  [housingData, acresData, magicBricksData].forEach(source => {
    source.forEach(item => {
      if (!mergedDataMap.has(item.region)) {
        mergedDataMap.set(item.region, { ...item, sources: 1 });
      } else {
        const existing = mergedDataMap.get(item.region);
        const existingChange = parseFloat(existing.priceChange);
        const newChange = parseFloat(item.priceChange);

        existing.sources += 1;
        existing.priceChange = ((existingChange * (existing.sources - 1) + newChange) / existing.sources).toFixed(1) + '%';
        existing.avgPrice = item.avgPrice;
        existing.pricePerSqFt = item.pricePerSqFt;
        existing.trend = determineTrend(existing.priceChange);
        existing.totalUsers += item.totalUsers || 0;
      }
    });
  });

  return Array.from(mergedDataMap.values());
}

// Determine trend
function determineTrend(priceChange) {
  const change = parseFloat(priceChange);
  if (change >= 3) return 'rising';
  if (change <= -1) return 'falling';
  return 'stable';
}

// Mock Data Generators
function getMockHousingData(city) {
  const data = [
    { region: "Mumbai, Maharashtra", priceChange: "+5.2%", avgPrice: "₹1.92 Cr", pricePerSqFt: "₹19,200", trend: "rising", totalUsers: 15680 },
    { region: "Bangalore, Karnataka", priceChange: "+7.5%", avgPrice: "₹98 L", pricePerSqFt: "₹8,100", trend: "rising", totalUsers: 14250 }
  ];
  return city ? data.filter(item => item.region.toLowerCase().includes(city.toLowerCase())) : data;
}

function getMock99AcresData(city) {
  const data = [
    { region: "Mumbai, Maharashtra", priceChange: "+4.5%", avgPrice: "₹1.78 Cr", pricePerSqFt: "₹17,800", trend: "rising", totalUsers: 12450 },
    { region: "Delhi-NCR", priceChange: "+2.7%", avgPrice: "₹1.2 Cr", pricePerSqFt: "₹9,300", trend: "stable", totalUsers: 11380 }
  ];
  return city ? data.filter(item => item.region.toLowerCase().includes(city.toLowerCase())) : data;
}

function getMockMagicBricksData(city) {
  const data = [
    { region: "Pune, Maharashtra", priceChange: "+5.4%", avgPrice: "₹85 L", pricePerSqFt: "₹7,200", trend: "rising", totalUsers: 9870 },
    { region: "Hyderabad, Telangana", priceChange: "+8.5%", avgPrice: "₹88 L", pricePerSqFt: "₹6,900", trend: "rising", totalUsers: 10240 }
  ];
  return city ? data.filter(item => item.region.toLowerCase().includes(city.toLowerCase())) : data;
}