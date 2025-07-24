import axios from "./axios";

export const getWithdrawRequests = async () => {
  const res = await axios.get("/api/withdraw/requests");
  return res.data;
};

export const approveWithdrawRequest = async (id) => {
  const res = await axios.patch(`/api/withdraw/approve/${id}`);
  return res.data;
};
