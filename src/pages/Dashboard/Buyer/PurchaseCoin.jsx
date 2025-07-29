import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { showToast } from "../../../utils/showToast";
import { createPaymentIntent, completePayment } from "../../../services/payment.service"; 
import { useAuth } from "../../../context/AuthContext";  // Importing the useAuth hook
import { useNavigate } from "react-router-dom";

const PurchaseCoin = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const { user } = useAuth();  // Using the useAuth hook to get the current user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const coinOptions = [
    { coins: 10, price: 1 },
    { coins: 150, price: 10 },
    { coins: 500, price: 20 },
    { coins: 1000, price: 35 },
  ];

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user) {
      setUserId(user.uid);  // Firebase UID from useAuth context
      console.log("Firebase UID:", user.uid);
    } else {
      console.error("User is not authenticated");
    }
  }, [user]);

  const handlePayment = async (coinOption) => {
    setSelectedCoin(coinOption);
    setLoading(true);
    try {
      const response = await createPaymentIntent(coinOption.price, coinOption.coins);
      setClientSecret(response.clientSecret);
      setLoading(false);
    } catch (error) {
      showToast("Payment creation failed. Please try again.", "error");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !userId) {
      setError("Stripe has not loaded correctly or User ID is missing.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Pass the necessary data to the backend
        await completePayment(paymentMethod.id, paymentIntent.id, userId, selectedCoin.coins);
        navigate("/dashboard/worker-home");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="purchase-coin container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select a Coin Package</h2>
      <div className="coin-cards grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {coinOptions.map((coinOption, index) => (
          <div
            key={index}
            className={`coin-card cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition duration-200 ease-in-out ${selectedCoin && selectedCoin.coins === coinOption.coins ? "border-2 border-blue-500" : ""}`}
            onClick={() => handlePayment(coinOption)}
          >
            <h3 className="text-lg font-bold text-gray-800">{coinOption.coins} Coins</h3>
            <p className="text-sm text-gray-500">${coinOption.price}</p>
          </div>
        ))}
      </div>

      {clientSecret && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', letterSpacing: '0.025em' }}}}/>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? <span className="animate-spin">🌀</span> : "Complete Payment"}
          </button>
        </form>
      )}

      {loading && <div className="loading text-center text-gray-600 mt-4">Processing...</div>}
    </div>
  );
};

export default PurchaseCoin;
