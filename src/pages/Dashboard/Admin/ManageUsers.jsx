import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUserRole } from '../../../services/user.service'; // Make sure these functions are defined in your services

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();  // Fetch all users
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await deleteUser(userId);  // Call deleteUser function
        fetchUsers();  // Re-fetch users after deletion
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);  // Update the user's role
      fetchUsers();  // Re-fetch users after updating
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Display Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Coins</th>
              <th className="px-4 py-2">Photo</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
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
                  <td className="px-4 py-2">{user.coin}</td>
                  <td className="px-4 py-2">
                    <img
                      src={user.photo_url || "/default-avatar.png"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">
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
                <td colSpan="6" className="text-center py-4 text-gray-500">
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
