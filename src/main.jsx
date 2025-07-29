import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe to initialize Stripe
import router from "./routes/AppRoutes"; // Ensure correct import
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Load your Stripe public key (ensure it's in your .env file or hardcoded)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} /> {/* Ensure router is passed correctly */}
      </Elements>
    </AuthProvider>
  </React.StrictMode>
);
