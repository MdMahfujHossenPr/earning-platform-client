import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { showToast } from "../../../utils/showToast";
import { createPaymentIntent, completePayment } from "../../../services/payment.service"; 
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PurchaseCoin = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  useEffect(() => {
    if (!user) {
      showToast("User not authenticated", "error");
    }
  }, [user]);

  const handlePayment = async (coinOption) => {
    setSelectedCoin(coinOption);
    setLoading(true);
    setError(null);
    try {
      const response = await createPaymentIntent(coinOption.price, coinOption.coins);
      setClientSecret(response.clientSecret);
    } catch {
      showToast("Payment creation failed. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !user) {
      setError("Stripe not loaded or user not authenticated.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    try {
      const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (createError) {
        setError(createError.message);
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
        await completePayment(paymentMethod.id, paymentIntent.id, user.uid, selectedCoin.coins);
        showToast("Payment successful!", "success");
        navigate("/dashboard/buyer/payment-history");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch {
      setError("Payment failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-gray-700 rounded-2xl shadow-xl p-8 sm:p-12">
        <h2 className="text-3xl font-extrabold text-center text-white mb-10">
          Purchase Coins
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {coinOptions.map(({ coins, price }) => (
            <div
              key={coins}
              onClick={() => !loading && handlePayment({ coins, price })}
              className={`cursor-pointer rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300
                ${
                  selectedCoin?.coins === coins
                    ? "border-4 border-white bg-gray-600"
                    : "border border-gray-500 bg-gray-700"
                }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{coins} Coins</h3>
              <p className="text-gray-300 text-lg">${price}</p>
            </div>
          ))}
        </div>

        {clientSecret && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-gray-500 rounded-lg shadow-inner bg-gray-600">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#ffffff",
                      letterSpacing: "0.025em",
                      "::placeholder": {
                        color: "#d1d5db",
                      },
                    },
                    invalid: {
                      color: "#f87171",
                    },
                  },
                }}
              />
            </div>

            {error && (
              <div className="text-center text-red-400 font-semibold">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-xl font-semibold
                bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-400 transition duration-300
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center animate-spin">
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  <span className="ml-2">Processing...</span>
                </span>
              ) : (
                "Complete Payment"
              )}
            </button>
          </form>
        )}

        {loading && !clientSecret && (
          <p className="text-center text-gray-300 mt-4 font-medium">Processing...</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseCoin;
