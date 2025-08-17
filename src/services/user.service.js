import axios from "./axios";

// Get all users or filter by role
export const getUsers = async (role = "") => {
  const url = role
    ? `https://earning-platform-server-seven.vercel.app/api/users?role=${role}`
    : `https://earning-platform-server-seven.vercel.app/api/users`;
  const res = await axios.get(url);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await axios.patch(
    `https://earning-platform-server-seven.vercel.app/api/users/${id}`,
    { role }
  );
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(
    `https://earning-platform-server-seven.vercel.app/api/users/${id}`
  );
  return res.data;
};

export const getTopWorkers = async (limit = 6) => {
  const res = await axios.get(
    `https://earning-platform-server-seven.vercel.app/api/users?role=Worker&sort=coin&limit=${limit}`
  );
  return res.data;
};
