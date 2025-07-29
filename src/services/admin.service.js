import axios from "./axios"; // axios instance with baseURL
import { getAuth } from "firebase/auth";

const auth = getAuth();

const getAuthHeader = async () => {
  if (!auth.currentUser) return {};
  const token = await auth.currentUser.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get Admin Stats
export const getAdminStats = async () => {
  const res = await axios.get("/api/admin/stats", await getAuthHeader());
  return res.data;
};

// Get pending withdrawals
export const getPendingWithdrawals = async () => {
  const res = await axios.get("/api/withdrawals", await getAuthHeader());
  return res.data.filter((w) => w.status === "pending");
};

// Approve withdrawal request & add coin to buyer
export const approveWithdrawalRequest = async (withdrawalId) => {
  const res = await axios.post(`/api/withdrawals/${withdrawalId}/approve`, {}, await getAuthHeader());
  return res.data;
};

// Approve payment and add coins to buyer
export const approvePayment = async (paymentId) => {
  const res = await axios.post(
    "/api/payments/approve",
    { paymentId },
    await getAuthHeader()
  );
  return res.data;
};


// Get pending payments
export const getPendingPayments = async () => {
  const res = await axios.get("/api/payments/pending", await getAuthHeader());
  return res.data;
};
