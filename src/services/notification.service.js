import axios from "./axios"; // Your base URL here
import { getAuth } from "firebase/auth";

const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {};  // If no user, don't add header
  const token = await auth.currentUser.getIdToken(); // Get the current user's token
  return {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token in the request
    },
  };
};

// Get notifications for the user
export const getNotifications = async (email) => {
  try {
    const authHeader = await getAuthHeader(); // Get auth headers
    const response = await axios.get("/api/notifications", {
      params: { email: email }, // Send the email as a query parameter
      ...authHeader, // Include authorization header
    });
    return response.data; // Return notifications data
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Send a new notification
export const sendNotification = async (notificationData) => {
  try {
    const authHeader = await getAuthHeader(); // Get auth headers
    const response = await axios.post("/api/notifications", notificationData, authHeader);
    return response.data; // Return success message
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
