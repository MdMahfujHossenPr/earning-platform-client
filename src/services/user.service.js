import axios from "./axios";

export const getUsers = async () => {
  const res = await axios.get("http://localhost:5000/api/users");
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
  const res = await axios.get(
    `http://localhost:5000/api/users?role=Worker&sort=coin&limit=${limit}`
  );
  return res.data;
};
