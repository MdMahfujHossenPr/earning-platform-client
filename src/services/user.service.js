import axios from "./axios";

// Get all users or filter by role
export const getUsers = async (role = "") => {
  const url = role ? `http://localhost:5000/api/users?role=${role}` : `http://localhost:5000/api/users`;
  const res = await axios.get(url);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await axios.patch(`http://localhost:5000/api/users/${id}`, { role });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`http://localhost:5000/api/users/${id}`);
  return res.data;
};

export const getTopWorkers = async (limit = 6) => {
  const res = await axios.get(`http://localhost:5000/api/users?role=Worker&sort=coin&limit=${limit}`);
  return res.data;
};
