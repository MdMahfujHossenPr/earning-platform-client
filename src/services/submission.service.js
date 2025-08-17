import axios from "axios";
import { getAuth } from "firebase/auth";

// Firebase authentication setup
const auth = getAuth();

// Helper function to get Authorization Header dynamically
const getAuthHeader = async () => {
  if (!auth.currentUser) {
    throw new Error("No user is logged in.");
  }

  const token = await auth.currentUser.getIdToken(); // Get the Firebase ID token
  return {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Firebase token as Bearer
    },
  };
};

/**
 * Function to approve a submission.
 * @param {string} submissionId - The ID of the submission to approve.
 * @param {string} workerEmail - The email of the worker for notification.
 * @param {number} payableAmount - The amount to be paid to the worker for completing the task.
 * @returns {object} - Response data from the backend API after the submission is approved.
 */
export const approveSubmission = async (
  submissionId,
  workerEmail,
  payableAmount
) => {
  try {
    const authHeader = await getAuthHeader(); // Get the auth header dynamically

    // Send a request to the backend to approve the submission
    const response = await axios.post(
      `https://earning-platform-server-seven.vercel.app/api/submissions/${submissionId}/approve`, // Correct URL with submissionId in the path
      { workerEmail, payableAmount }, // Send necessary data in the body
      authHeader // Include the Authorization header
    );

    return response.data; // Return the response data after approval
  } catch (error) {
    console.error("Error approving submission:", error);
    throw error; // Rethrow the error to be handled in the component
  }
};

/**
 * Function to reject a submission.
 * @param {string} submissionId - The ID of the submission to reject.
 * @param {string} taskId - The ID of the task that the submission belongs to.
 * @returns {object} - Response data from the backend API after the submission is rejected.
 */
export const rejectSubmission = async (submissionId, taskId) => {
  try {
    const authHeader = await getAuthHeader(); // Get the auth header dynamically

    // Send a request to the backend to reject the submission
    const response = await axios.post(
      `https://earning-platform-server-seven.vercel.app/api/submissions/${submissionId}/reject`, // Correct URL with submissionId
      { submissionId, taskId }, // Send necessary data in the body
      authHeader // Include the Authorization header
    );

    return response.data; // Return the response data after rejection
  } catch (error) {
    console.error("Error rejecting submission:", error);
    throw error; // Rethrow the error to be handled in the component
  }
};

/**
 * Function to get pending submissions for a specific user.
 * @param {string} userId - The ID of the user for fetching their pending submissions.
 * @returns {object} - List of pending submissions for the user.
 */
export const getPendingSubmissions = async (userId) => {
  try {
    const authHeader = await getAuthHeader(); // Get the auth header dynamically

    // Fetch pending submissions from the backend
    const response = await axios.get(
      "https://earning-platform-server-seven.vercel.app/api/submissions", // Backend endpoint for fetching submissions
      {
        params: { userId }, // Pass the userId as a query parameter
        headers: authHeader.headers, // Include Authorization header for validation
      }
    );

    return response.data; // Return the response data (pending submissions)
  } catch (error) {
    console.error("Error fetching pending submissions:", error);
    throw error; // Rethrow the error to be handled in the component
  }
};

export const getBuyerStats = async (userId) => {
  try {
    const authHeader = await getAuthHeader();
    const response = await axios.get(
      `https://earning-platform-server-seven.vercel.app/api/buyer/${userId}/stats`,
      authHeader
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer stats:", error);
    throw error;
  }
};


export default {
  approveSubmission,
  rejectSubmission,
  getPendingSubmissions,
};
