import { loadStripe } from "@stripe/stripe-js";

// Replace this with your actual Stripe publishable key
const stripePromise = loadStripe("import.meta.env.STRIPE_PUBLISHABLE_KEY"); 

export { stripePromise };