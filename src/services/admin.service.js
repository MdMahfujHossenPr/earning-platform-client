import axios from "./axios"; // Your axios base URL here
import { getAuth } from "firebase/auth";

const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {};  // If the user is not authenticated, return an empty object
  const token = await auth.currentUser.getIdToken();  // Get the current user's token
  return {
    headers: {
      Authorization: `Bearer ${token}`,  // Set Authorization header
    },
  };
};

// Function to get admin stats (total workers, buyers, coins, payments)
export const getAdminStats = async () => {
  try {
    const res = await axios.get("/api/admin/stats", await getAuthHeader()); // Adding the auth header
    return res.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error("Error fetching admin stats");
  }
};

// Function to get pending withdrawal requests
export const getPendingWithdrawals = async () => {
  try {
    const res = await axios.get("/api/withdrawals", await getAuthHeader()); // Adding the auth header
    return res.data.filter((withdrawal) => withdrawal.status === "pending");
  } catch (error) {
    console.error("Error fetching pending withdrawals:", error);
    throw new Error("Error fetching pending withdrawals");
  }
};

// Function to approve a withdrawal payment
export const approvePayment = async (withdrawalId, workerEmail, amount) => {
  try {
    // Approve the payment by updating the withdrawal status and decreasing the worker's coin
    const res = await axios.post(`/api/withdrawals/${withdrawalId}/approve`, 
      { workerEmail, amount }, await getAuthHeader());
    return res.data;
  } catch (error) {
    console.error("Error approving payment:", error);
    throw new Error("Error approving payment");
  }
};
