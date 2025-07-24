import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ ঠিক path

const useAxiosSecure = () => {
  const { user, logout } = useAuth(); // ✅ এখন আর undefined হবে না

  const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Request interceptor to attach token
  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle auth errors
  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        logout?.(); // ✅ logout আছে তো? optional chaining safe
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
