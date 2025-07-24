// src/services/worker.service.js

import axios from "./axios";

// ওয়ার্কারের পরিসংখ্যান আনো (যেমন: টাস্ক সংখ্যা, আর্নিংস ইত্যাদি)
export const getWorkerStats = async (email) => {
  const res = await axios.get(`/api/worker/stats?email=${email}`);
  return res.data;
};
