import axios from "./axios"; // Your base URL here
import { getAuth } from "firebase/auth";

const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {};
  const token = await auth.currentUser.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// buyer.service.js
export const getBuyerStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is missing.");
    }

    const response = await axios.get(`http://localhost:5000/api/buyer/stats/${userId}`, await getAuthHeader());
    if (!response.data) {
      throw new Error('Failed to fetch stats');
    }
    return response.data; // Ensure response is parsed as JSON
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error('Error fetching stats: ' + error.message);
  }
};
