import axios from "axios";
import { getAuth } from "firebase/auth";

// Firebase authentication setup
const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) {
    throw new Error("No user is logged in.");
  }
  
  const token = await auth.currentUser.getIdToken();  // Get the Firebase ID token
  return {
    headers: {
      Authorization: `Bearer ${token}`,  // Attach the Firebase token as Bearer
    },
  };
};

// Function to fetch Worker Submissions
export const getWorkerSubmissions = async (email) => {
  try {
    const authHeader = await getAuthHeader(); // Get the auth header dynamically

    // Make the GET request to fetch submissions for the worker
    const response = await axios.get('http://localhost:5000/api/submissions', {
      params: { email },  // Pass the email as query params
      headers: authHeader.headers, // Use the authorization header from Firebase
    });

    return response.data; // Return the response data (submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error);  // Log errors
    throw error; // Rethrow the error to be handled in the component
  }
};
