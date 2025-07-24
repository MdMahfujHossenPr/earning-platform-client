import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    photoURL: null, // Store the image file here
    email: "",
    password: "",
    role: "Worker", // Default role as "Worker"
  });
  const [errors, setErrors] = useState({ password: "", form: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  // Password validation function
  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd)) return "Must include at least one uppercase letter";
    return "";
  };

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email)) return "Invalid email format";
    return "";
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file change for photoURL (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photoURL: file, // Store the file object in state
      }));
    }
  };

  // Upload image to ImgBB using the API key from .env
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_API_KEY}`, // Use import.meta.env for Vite
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return data.data.url; // Return the URL of the uploaded image
    } else {
      throw new Error("Image upload failed");
    }
  };

  // Send user data to backend and store coins
  const sendUserToBackend = async (user, method, password = "") => {
    try {
      const coinValue = formData.role === "Buyer" ? 50 : 10; // Assign 50 coins for Buyer, 10 for Worker

      const userData = {
        name: user.displayName || formData.name,
        email: user.email,
        photoURL:
          user.photoURL ||
          formData.photoURL ||
          "https://i.ibb.co/2kRZ1Z5/default-avatar.png",
        password: method === "manual" ? password : undefined,
        role: formData.role,
        coin: coinValue,
        googleId: user.googleId || null,
        method: method, // Adding method here
      };

      if (!userData.email || !userData.name || !userData.photoURL) {
        throw new Error("Missing required fields");
      }

      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "User already exists") {
          console.warn("ℹ️ User already exists. Proceeding...");
          return;
        }
        throw new Error(data.message || "Backend error");
      }
    } catch (err) {
      console.error("Backend error:", err);
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ password: "", form: "" });

    // Email and password validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, form: emailError }));
      return;
    }

    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setErrors((prev) => ({ ...prev, password: pwdError }));
      return;
    }

    setLoading(true);

    try {
      let uploadedPhotoURL = formData.photoURL;
      if (formData.photoURL && formData.photoURL instanceof File) {
        // If the user uploaded a file, upload it to ImgBB
        uploadedPhotoURL = await uploadImageToImgBB(formData.photoURL);
      }

      const userCredential = await signup(
        formData.email,
        formData.password,
        formData.name,
        uploadedPhotoURL // Use the uploaded photo URL
      );
      const user = userCredential.user || {};

      // Send user info to backend
      await sendUserToBackend(user, "manual", formData.password);

      Swal.fire({
        icon: "success",
        title: "Account Created Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/"); // Redirect after registration
      document.getElementById("photoURL").value = ""; // Clear file input after submit (optional)
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      const user = result.user || {};

      await sendUserToBackend(user, "google");

      Swal.fire({
        icon: "success",
        title: "Google Signup Successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/"); // Redirect after Google signup
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      Swal.fire({
        icon: "error",
        title: "Google Signup Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 px-4">
      <div className="bg-gray-800 p-12 my-16 rounded-lg shadow-xl w-full max-w-3xl border-8 border-white transform transition-all duration-300 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-semibold text-white mb-8 text-center">
          Register
        </h2>

        {errors.form && (
          <div className="text-gray-100 text-sm mb-4 bg-gray-700 p-3 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-white">
          <div>
            <label
              htmlFor="name"
              className="block font-semibold mb-2 text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-gray-700 border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 py-3 px-6 transition-transform duration-300 ease-in-out hover:scale-105"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="photoURL"
              className="block font-semibold mb-2 text-gray-300"
            >
              Photo (Optional)
            </label>
            <input
              id="photoURL"
              name="photoURL"
              type="file" // Change input type to 'file'
              onChange={handleFileChange} // Handle file change
              className="input input-bordered w-full bg-gray-400 border-4 border-white text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
            {formData.photoURL && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Preview:</p>
                <img
                  src={URL.createObjectURL(formData.photoURL)} // Display file preview
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-full border-4 border-white" // Updated to make it fully rounded
                />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-semibold mb-2 text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-gray-700 border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 py-3 px-6 transition-transform duration-300 ease-in-out hover:scale-105"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-semibold mb-2 text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`input input-bordered w-full bg-gray-700 border-2 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 ${
                errors.password ? "border-gray-600" : "border-white"
              } py-3 px-6 transition-transform duration-300 ease-in-out hover:scale-105`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-gray-200 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block font-semibold mb-2 text-gray-300"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-700 border-2 border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <option value="Worker">Worker</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary bg-gray-700 border-2 border-white w-full px-12 py-3 ${
              loading ? "loading" : ""
            } transition-transform duration-300 ease-in-out hover:scale-105`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-3 text-white">
          <hr className="w-1/3 border-white" />
          <span className="font-semibold">OR</span>
          <hr className="w-1/3 border-white" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 flex items-center justify-center space-x-2 w-full border border-white text-white py-3 rounded-md hover:bg-gray-600 hover:border-gray-600 transition"
        >
          <FaGoogle />
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
