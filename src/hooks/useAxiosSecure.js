import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

const useAxiosSecure = () => {
  const { logout } = useAuth();

  const axiosSecure = axios.create({
    baseURL: "https://earning-platform-server-seven.vercel.app", // ✅ Server URL
    withCredentials: true, // ✅ Necessary for cookie-based auth
  });

  useEffect(() => {
    // 👉 Attach token before request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = Cookies.get("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 👉 Handle 401 / 403 errors globally
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (err) => {
        if ([401, 403].includes(err?.response?.status)) {
          logout?.();
        }
        return Promise.reject(err);
      }
    );

    // Cleanup
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, axiosSecure]);

  return axiosSecure;
};

export default useAxiosSecure;
