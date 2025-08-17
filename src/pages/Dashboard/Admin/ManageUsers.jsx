import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUserRole } from '../../../services/user.service';
import { toast } from 'react-hot-toast';

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
        toast.success("✅ User removed successfully");
        await fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
        toast.error("❌ Could not delete user. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      await updateUserRole(userId, newRole);
      toast.success(`✅ Role updated to ${newRole}`);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update user role:", err);
      toast.error("❌ Could not update role. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-600 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Users</h2>

      {loading ? (
        <div className="text-center py-10 text-xl font-medium animate-pulse">
          Loading...
        </div>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-500 bg-gray-700/50 backdrop-blur-md">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-800/90 text-white text-sm uppercase">
                <th className="px-6 py-3">Display Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Coins</th>
                <th className="px-6 py-3">Photo</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-t ${
                      index % 2 === 0 ? 'bg-gray-700/30' : 'bg-gray-700/20'
                    } hover:bg-gray-600/40 transition-colors`}
                  >
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4 text-gray-200">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-gray-600 text-white p-2 rounded"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Buyer">Buyer</option>
                        <option value="Worker">Worker</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-yellow-300 font-semibold">{user.coin}</td>
                    <td className="px-6 py-4">
                      <img
                        src={user.photo_url || '/default-avatar.png'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-400"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
