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

// Function to approve a submission
export const approveSubmission = async (submissionId, workerEmail, payableAmount) => {
  try {
    const authHeader = await getAuthHeader();  // Get the auth header dynamically

    // Correct URL with submissionId in the URL path
    const response = await axios.post(
      `http://localhost:5000/api/submissions/${submissionId}/approve`, // Use the correct URL structure
      { workerEmail, payableAmount }, // Send the necessary data in the body
      authHeader // Include the Authorization header
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error approving submission:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};


// Function to reject a submission
export const rejectSubmission = async (submissionId, taskId) => {
  try {
    const authHeader = await getAuthHeader();  // Get the auth header dynamically

    // Use the correct URL with the submissionId in the path
    const response = await axios.post(
      `http://localhost:5000/api/submissions/${submissionId}/reject`, // Correct URL with submissionId
      { submissionId, taskId },
      authHeader // Add the Authorization header
    );

    // Returning the response data
    return response.data;
  } catch (error) {
    console.error("Error rejecting submission:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};


// Function to get Pending Submissions
export const getPendingSubmissions = async (userId) => {
  try {
    const authHeader = await getAuthHeader();  // Get the auth header dynamically

    // Sending a request to the backend to get pending submissions for the buyer
    const response = await axios.get(
      "http://localhost:5000/api/submissions", // Your backend endpoint for fetching pending submissions
      {
        params: { userId }, // Pass the userId as a query parameter
        headers: authHeader.headers, // Add the Authorization header
      }
    );

    // Returning the response data (pending submissions)
    return response.data;
  } catch (error) {
    console.error("Error fetching pending submissions:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

// Exporting the function so it can be used in other files
export default {
  getPendingSubmissions,
};
