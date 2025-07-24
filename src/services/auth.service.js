// src/services/auth.service.js

import axios from "./axios";  // তুমি যেটা axios সেটআপ করেছো সেটা ইম্পোর্ট করবে

const API_URL = "/auth";  // তোমার API রুট যেটা অথেনটিকেশন রিলেটেড

// লগইন ফাংশন
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    // যদি তোমার API JWT বা টোকেন দেয়, লোকাল স্টোরেজে সেট করো
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// রেজিস্ট্রেশন ফাংশন
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// লগআউট ফাংশন
const logout = () => {
  localStorage.removeItem("user");  // ইউজার ডাটা ক্লিয়ার করো
};

// ইউজারের তথ্য পাওয়ার ফাংশন (লোকাল স্টোরেজ থেকে)
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
};
