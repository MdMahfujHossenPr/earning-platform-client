import React, { useEffect, useState } from 'react';
import {
  getUsers,
  updateUserRole,
  deleteUser
} from "../../../services/user.service"; // ✅ ঠিক path


const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    fetchUsers();
  };

  const handleRemove = async (userId) => {
    if(window.confirm("Are you sure to remove this user?")) {
      await deleteUser(userId);
      fetchUsers();
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Email</th>
            <th>Photo</th>
            <th>Role</th>
            <th>Coins</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.display_name}</td>
              <td>{user.email}</td>
              <td><img src={user.photo_url} alt={user.display_name} width="50" /></td>
              <td>
                <select value={user.role} onChange={e => handleRoleChange(user._id, e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="buyer">Buyer</option>
                  <option value="worker">Worker</option>
                </select>
              </td>
              <td>{user.coin}</td>
              <td>
                <button onClick={() => handleRemove(user._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
