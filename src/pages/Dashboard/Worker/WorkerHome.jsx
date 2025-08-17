// pages/Worker/WorkerHome.jsx
import React, { useEffect, useState } from "react";
import { getPendingSubmissions } from "../../../services/submission.service";
import { useAuth } from "../../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const WorkerHome = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchWorkerData = async () => {
      try {
        const pendingData = await getPendingSubmissions(user.uid);
        setSubmissions(pendingData);

        setTotalSubmissions(pendingData.length);

        const pendingCount = pendingData.filter(sub => sub.status === "pending").length;
        const approvedCount = pendingData.filter(sub => sub.status === "approved").length;
        const rejectedCount = pendingData.filter(sub => sub.status === "rejected").length;

        setTotalPending(pendingCount);
        setTotalApproved(approvedCount);
        setTotalRejected(rejectedCount);

        const earnings = pendingData.reduce(
          (acc, sub) => (sub.status === "approved" ? acc + sub.payable_amount : acc),
          0
        );
        setTotalEarnings(earnings);
      } catch (err) {
        setError("Failed to load submissions.");
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="h-12 w-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4 text-center font-semibold">
        {error}
      </div>
    );
  }

  const barData = [
    { name: "Submissions", Pending: totalPending, Approved: totalApproved, Rejected: totalRejected },
  ];

  const pieData = [
    { name: "Pending", value: totalPending, color: "#FACC15" },
    { name: "Approved", value: totalApproved, color: "#22C55E" },
    { name: "Rejected", value: totalRejected, color: "#EF4444" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
      <h2 className="text-4xl font-bold text-center text-white mb-6">🎯 Worker Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:-translate-y-1 text-center">
          <h4 className="font-semibold text-lg">Total Submissions</h4>
          <p className="text-3xl font-bold mt-2">{totalSubmissions}</p>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:-translate-y-1 text-center">
          <h4 className="font-semibold text-lg">Pending Submissions</h4>
          <p className="text-3xl font-bold mt-2">{totalPending}</p>
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:-translate-y-1 text-center">
          <h4 className="font-semibold text-lg">Total Earnings</h4>
          <p className="text-3xl font-bold mt-2">${totalEarnings}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">📊 Submission Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="Pending" fill="#FACC15" />
              <Bar dataKey="Approved" fill="#22C55E" />
              <Bar dataKey="Rejected" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">🥧 Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Submissions Table */}
      <h3 className="text-2xl font-semibold text-white mb-4">📋 Submission Details</h3>
      {submissions.length === 0 ? (
        <p className="text-center text-white text-lg py-6 bg-gray-700 rounded-xl">No pending submissions found.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 shadow-xl rounded-xl border border-gray-700">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-900 text-gray-200 text-sm uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Task Title</th>
                <th className="px-6 py-3 text-left">Payable Amount</th>
                <th className="px-6 py-3 text-left">Buyer Email</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="border-b border-gray-700 text-gray-100 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4">{sub.task_title}</td>
                  <td className="px-6 py-4 font-medium">${sub.payable_amount}</td>
                  <td className="px-6 py-4">{sub.buyer_email}</td>
                  <td className="px-6 py-4">
                    {sub.status === "pending" && (
                      <span className="text-yellow-500 bg-yellow-100 px-3 py-1 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                    {sub.status === "approved" && (
                      <span className="text-green-500 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                        Approved
                      </span>
                    )}
                    {sub.status === "rejected" && (
                      <span className="text-red-500 bg-red-100 px-3 py-1 rounded-full text-sm font-semibold">
                        Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkerHome;
