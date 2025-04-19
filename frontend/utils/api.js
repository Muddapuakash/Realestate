const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // Backend API URL

// Fetch all properties
export async function fetchProperties() {
  try {
    const response = await fetch(`${BASE_URL}/properties`);
    if (!response.ok) throw new Error("Failed to fetch properties");
    return await response.json();
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// Fetch single property details by ID
export async function fetchPropertyById(id) {
  try {
    const response = await fetch(`${BASE_URL}/properties/${id}`);
    if (!response.ok) throw new Error("Property not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// Fetch transactions
export async function fetchTransactions() {
  try {
    const response = await fetch(`${BASE_URL}/transactions`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
