import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase.config";
import { FaGoogle } from "react-icons/fa";
import { MdLockOutline, MdEmail } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Manual Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("❌ Email and password are required!");
      return;
    }
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          profilePicture:
            user.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        })
      );
      localStorage.setItem("isLoggedIn", "true");

      toast.success("✅ Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(`❌ Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Google Login (as before)
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            method: "google",
          }),
        }
      );

      const res = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            method: "google",
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        toast.success("✅ Google login successful!");
        navigate("/");
      } else {
        toast.error(data?.message || "❌ Google login failed");
      }
    } catch (error) {
      toast.error("❌ Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <title>Login</title>
      <div className="bg-gray-800 p-10 rounded-lg shadow-2xl w-full max-w-lg border-8 border-white">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-white">
          <div>
            <label className="block font-semibold mb-2" htmlFor="email">
              <MdEmail className="inline-block mr-2 text-white" /> Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border-4 border-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-400 text-white placeholder-gray-200 transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2" htmlFor="password">
              <MdLockOutline className="inline-block mr-2 text-white" />{" "}
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border-4 border-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-400 text-white placeholder-gray-200 transition-all"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between">
            <Link
              to="/forget-password"
              className="text-gray-200 hover:text-gray-400 text-sm underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition duration-300 flex justify-center items-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-10 w-10 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center text-white text-sm font-semibold">
          <hr className="w-1/3 border-white" />
          <span className="mx-3">OR</span>
          <hr className="w-1/3 border-white" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition duration-300"
        >
          <FaGoogle className="mr-2" /> <span>Continue with Google</span>
        </button>

        <p className="text-center text-sm mt-6 text-gray-200">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gray-300 hover:text-gray-500 underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Login;
