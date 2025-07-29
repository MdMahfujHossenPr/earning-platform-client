import axios from 'axios';  
import { getAuth } from 'firebase/auth';
import { showToast } from "../utils/showToast"; 

// Helper function to get Authorization Header
const getAuthHeader = async () => {
  const auth = getAuth();
  if (!auth.currentUser) return {};  // If no user is logged in, return empty headers
  try {
    const token = await auth.currentUser.getIdToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw new Error('Failed to get authentication token');
  }
};

// Create Payment Intent on Backend (Stripe)
export const createPaymentIntent = async (amount, coin) => {
  try {
    console.log('Creating payment intent with amount:', amount, coin);

    // Convert to cents as Stripe expects the amount in cents
    const amountInCents = amount * 100;

    const authHeader = await getAuthHeader();

    console.log("Sending to backend:", { amountInCents, coin });
    const response = await axios.post(
      'http://localhost:5000/api/payment/create',
      { amount: amountInCents, coin },
      authHeader
    );

    console.log('Payment Intent Response:', response.data);
    return response.data;  // Ensure this returns the PaymentIntent ID
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent. Please try again.');
  }
};

// Complete Payment and Update Coins on Backend
export const completePayment = async (paymentMethodId, paymentIntentId, userId, coins) => {
  try {
    const authHeader = await getAuthHeader();

    console.log("Completing payment with:", {
      paymentMethodId,
      paymentIntentId,
      userId,
      coins
    });

    const response = await axios.post(
      "http://localhost:5000/api/payments/complete-payment",
      {
        paymentMethodId,
        paymentIntentId,  // Send PaymentIntent ID here
        userId,            // Ensure you're passing the correct Firebase UID
        coins,
      },
      authHeader
    );

    return response.data;  // Return response if successful
  } catch (error) {
    console.error("Error completing payment:", error);
    throw error;  // Rethrow the error for further handling
  }
};










// Fetch payment history of a user
export const getPaymentHistory = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch payment history.");
  }

  try {
    // Convert the userId to ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);  // Ensure userId is ObjectId

    const response = await axios.get(
      `http://localhost:5000/api/payments?userId=${userObjectId}`,
      await getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw new Error("Failed to fetch payment history");
  }
};

