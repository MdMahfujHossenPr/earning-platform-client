// Import necessary Firebase functions and modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider, // Correct import
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1SA5CSjwp1lYxAY6hupJcCiNmROhUsrA",
  authDomain: "microtask-and-earning-platform.firebaseapp.com",
  projectId: "microtask-and-earning-platform",
  storageBucket: "microtask-and-earning-platform.firebasestorage.app",
  messagingSenderId: "336589839182",
  appId: "1:336589839182:web:d17dd8723286664acfdc1f",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export Firebase app instance
export default app;

// Create Google Auth provider instance
const googleProvider = new GoogleAuthProvider(); // Corrected this line

/**
 * Sign in the user using Google popup authentication
 */
const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User signed in: ", user);
  } catch (error) {
    console.error("Error signing in with Google: ", error.message);
    alert("Google sign-in failed, please try again.");
  }
};

/**
 * Update the current user's profile
 * @param {Object} profile - Object containing the updated profile information (e.g., { displayName, photoURL })
 */
const updateUserProfile = async (profile) => {
  if (auth.currentUser) {
    try {
      await firebaseUpdateProfile(auth.currentUser, profile);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  } else {
    console.error("No user is logged in");
  }
};

// Export authentication utilities
export { auth, googleProvider, googleSignIn, updateUserProfile };
