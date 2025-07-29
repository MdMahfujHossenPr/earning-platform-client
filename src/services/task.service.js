// task.service.js

import axios from "./axios"; // Ensure axios base URL is correct
import { getAuth } from "firebase/auth";

const auth = getAuth();

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  if (!auth.currentUser) return {};
  const token = await auth.currentUser.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// Add task
export const addTask = async (data) => {
  const config = await getAuthHeader();
  const res = await axios.post("/api/tasks", data, config);
  return res.data;
};

// Get task by ID
export const getTaskById = async (id) => {
  const config = await getAuthHeader();
  try {
    const res = await axios.get(`/api/tasks/available/${id}`, config);
    if (!res.data) {
      throw new Error("Task not found.");
    }
    return res.data; // Return task data if found
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    if (error.response) {
      // Check for 404 error and return specific message
      if (error.response.status === 404) {
        throw new Error("Task not found.");
      }
      throw new Error(error.response.data.message || "Failed to fetch task details.");
    }
    throw new Error("Failed to fetch task details.");
  }
};


// task.service.js
export const submitTask = async (data) => {
  const config = await getAuthHeader();
  try {
    console.log("Submitting task with data:", data); // Log the data being submitted
    
    const res = await axios.post("/api/submissions", data, config);
    console.log("Response from submission:", res); // Log the response from backend
    return res.data;
  } catch (error) {
    console.error("Error submitting task:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Error submitting task");
  }
};


// Update task
export const updateTask = async (taskId, data) => {
  try {
    const config = await getAuthHeader();
    const response = await axios.put(`/api/tasks/${taskId}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;  // Rethrow the error to handle it in the component
  }
};

// DELETE task function
export const deleteTask = async (id) => {
  const config = await getAuthHeader();  // Get the authorization header
  console.log('Deleting task with ID:', id);  // Log task ID for debugging
  try {
    const res = await axios.delete(`/api/tasks/${id}`, config);  // Send DELETE request
    return res.data;  // Return response data
  } catch (error) {
    console.error("Error deleting task:", error);  // Log any errors
    throw error;  // Throw the error for the calling function to handle
  }
};


// Fetch tasks for a buyer
export const getBuyerTasks = async () => {
  const config = await getAuthHeader();
  const res = await axios.get("/api/tasks", config);
  return res.data;
};

// Get available tasks for workers (if you have this route)
export const getAvailableTasks = async () => {
  const config = await getAuthHeader();
  try {
    const res = await axios.get("/api/tasks/available", config);
    return res.data;  // Return the available tasks
  } catch (error) {
    console.error("Error fetching available tasks:", error);
    if (error.response) {
      // Handle server error
      throw new Error(`Error fetching available tasks: ${error.response.data.message}`);
    }
    // Handle network or unknown error
    throw new Error("An unknown error occurred while fetching tasks.");
  }
};

// Refund coins for uncompleted tasks
export const refundCoinsForUncompletedTasks = async () => {
  const config = await getAuthHeader();
  const res = await axios.patch("/api/tasks/refund", null, config);
  return res.data;
};
