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

// Function to get withdrawal requests
export const getWithdrawRequests = async () => {
  const authHeader = await getAuthHeader(); // Get the authorization header
  const res = await axios.get("/api/withdraw/requests", authHeader); // Include authHeader with request
  return res.data;
};

// Function to approve a withdrawal request
export const approveWithdrawRequest = async (id) => {
  const authHeader = await getAuthHeader(); // Get the authorization header
  const res = await axios.patch(`/api/withdraw/approve/${id}`, {}, authHeader); // Include authHeader with request
  return res.data;
};
