import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUserRole } from '../../../services/user.service';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setLoading(true);
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Could not delete user. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update user role:", err);
      alert("Could not update role. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Display Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Coins</th>
              <th className="px-4 py-2 border-b">Photo</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-gray-200 text-gray-700 p-2 rounded"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Worker">Worker</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border-b">{user.coin}</td>
                  <td className="px-4 py-2 border-b">
                    <img
                      src={user.photo_url || "/default-avatar.png"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
