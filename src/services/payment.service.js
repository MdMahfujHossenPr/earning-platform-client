import axios from "./axios";
import { getAuth } from "firebase/auth";
 
const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {}; // No user logged in, return empty object
  const token = await auth.currentUser.getIdToken(); // Get Firebase ID token
  return {
    headers: {
      Authorization: `Bearer ${token}`,  // Attach the token as Bearer token
    },
  };
};

export const createPaymentIntent = async (amount) => {
  const res = await axios.post("/api/payments/create-intent", { amount });
  return res.data;
};

export const savePayment = async (paymentData) => {
  const res = await axios.post("/api/payments/save", paymentData);
  return res.data;
};

// Function to fetch payment history
export const getPaymentHistory = async (userId) => {
  const config = await getAuthHeader(); // Get the authorization header

  try {
    const response = await axios.get(`/api/payments?userId=${userId}`, config); // Fetch payment history
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error; // Throw the error to be handled in the component
  }
};