import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaUserAlt,
  FaCoins,
  FaSignOutAlt,
  FaCog,
  FaClipboardCheck,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import useRole from "../../hooks/useRole";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { role, loading } = useRole();

  if (!user || loading) {
    return <div>Loading...</div>; // Show while user or role is loading
  }

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      <ul>
        {/* Home Link */}
        <li>
          <Link
            to={
              role === "Buyer"
                ? "/dashboard/buyer-home"
                : role === "Worker"
                ? "/dashboard/worker-home"
                : "/dashboard/admin-home"
            }
            className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
          >
            <FaHome /> <span className="text-xl">Home</span>
          </Link>
        </li>

        {/* Conditional Links Based on Role */}
        {role === "Worker" && (
          <>
            <li>
              <Link
                to="/dashboard/task-list"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaTasks /> <span className="text-xl">Task List</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/worker/my-submissions"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaTasks /> <span className="text-xl">My Submissions</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/withdrawals"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaCoins /> <span className="text-xl">Withdrawals</span>
              </Link>
            </li>
          </>
        )}

        {role === "Buyer" && (
          <>
            <li>
              <Link
                to="/dashboard/add-task"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaTasks /> <span className="text-xl">Add New Task</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/my-tasks"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaTasks /> <span className="text-xl">My Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/purchase-coin"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaCoins /> <span className="text-xl">Purchase Coins</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/buyer/payment-history"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaCoins /> <span className="text-xl">Payment History</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/review-submissions"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaClipboardCheck />{" "}
                <span className="text-xl">Review Submissions</span>
              </Link>
            </li>
          </>
        )}

        {role === "Admin" && (
          <>
            <li>
              <Link
                to="/dashboard/manage-users"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaUserAlt /> <span className="text-xl">Manage Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/manage-tasks"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaTasks /> <span className="text-xl">Manage Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/withdraw-requests"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaCoins /> <span className="text-xl">Withdraw Requests</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 text-lg"
              >
                <FaCog /> <span className="text-xl">Settings</span>
              </Link>
            </li>
          </>
        )}

        {/* Logout Button */}
        <li>
          <button
            onClick={logout}
            className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-md transition-all duration-300 w-full text-lg"
          >
            <FaSignOutAlt /> <span className="text-xl">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
