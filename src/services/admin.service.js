import axios from 'axios';

// API URL for your server (adjust as necessary)
const API_URL = 'http://localhost:5000/api/admin'; 

// Get user count by role (worker or buyer)
export const getUsersCount = async (role) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/count/${role}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users count:', error);
    return 0;
  }
};

// Get total coins
export const getTotalCoins = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/admin/total-coins`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total coins:', error);
    return 0;
  }
};

// Get total payments
export const getTotalPayments = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/admin/total-payments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total payments:', error);
    return 0;
  }
};
