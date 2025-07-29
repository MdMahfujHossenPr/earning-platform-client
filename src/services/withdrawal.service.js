import axios from "./axios";  // Importing the axios instance
import { getAuth } from "firebase/auth";  // For handling Firebase authentication

const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {};  // If the user is not authenticated, return an empty object
  const token = await auth.currentUser.getIdToken();  // Get the current user's token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Function to submit a withdrawal request
export const addWithdrawalRequest = async (withdrawalData) => {
  const config = await getAuthHeader();  // Get authorization header with the user's token
  try {
    // Send a POST request to save the withdrawal request in the database
    const res = await axios.post("/api/withdrawals", withdrawalData, config);
    return res.data;  // Return the response data from the API
  } catch (error) {
    console.error("Error submitting withdrawal request:", error);
    throw new Error("Error submitting withdrawal request: " + error.message);
  }
};

// Function to get a worker's withdrawal history
export const getWorkerWithdrawals = async (workerEmail) => {
  const config = await getAuthHeader();  // Get authorization header with the user's token
  try {
    // Send a GET request to fetch the worker's withdrawal history
    const res = await axios.get(`/api/withdrawals?worker_email=${workerEmail}`, config);
    return res.data;  // Return the response data from the API
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    throw new Error("Error fetching withdrawal history: " + error.message);
  }
};

// Function to get all withdrawals for the admin
export const getAllWithdrawals = async () => {
  const config = await getAuthHeader();  // Get authorization header with the user's token
  try {
    // Send a GET request to fetch all withdrawals for the admin
    const res = await axios.get("/api/admin/withdrawals", config);
    return res.data;  // Return the response data from the API
  } catch (error) {
    console.error("Error fetching all withdrawals:", error);
    throw new Error("Error fetching all withdrawals: " + error.message);
  }
};
