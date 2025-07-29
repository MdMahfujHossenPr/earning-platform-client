import axios from "./axios";  // Your base URL here
import { getAuth } from "firebase/auth";

const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {};  // Return an empty object if no user is authenticated
  const token = await auth.currentUser.getIdToken();  // Get the Firebase ID Token
  return {
    headers: {
      Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
    },
  };
};

// Function to fetch buyer stats from backend
export const getBuyerStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is missing.");
    }
    console.log("Fetching stats for User ID:", userId);

    const response = await axios.get(`http://localhost:5000/api/buyer/stats/${userId}`, await getAuthHeader());

    if (response.status !== 200 || !response.data) {
      throw new Error('Failed to fetch stats: Invalid response');
    }

    console.log("Received stats:", response.data);
    return response.data;
  
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error('Error fetching stats: ' + (error.message || 'Unknown error'));
  }
};


 