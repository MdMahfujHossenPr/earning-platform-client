import axios from './axios'; // Assuming your base URL is here
import { getAuth } from "firebase/auth";

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  const auth = getAuth();
  if (!auth.currentUser) return {}; // If user is not logged in, return an empty header
  const token = await auth.currentUser.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get Withdrawals function
export const getWithdrawals = async (email) => {
  const config = await getAuthHeader(); // Get auth header with token
  try {
    const res = await axios.get(`/api/withdrawals?email=${email}`, config); // Send request with header
    return res.data; // Return data if successful
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error; // Throw the error to handle in the component
  }
};


export const requestWithdrawal = async (data) => {
  const res = await axios.post("/api/withdrawals", data);
  return res.data;
};
