import React, { useEffect, useState } from "react";
import {
  getBuyerStats,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../../services/submission.service";
import { showToast } from "../../../utils/showToast";
import { useAuth } from "../../../context/AuthContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BuyerHome = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalPayments: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalSubmission, setModalSubmission] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, submissionsData] = await Promise.all([
          getBuyerStats(userId).catch(() => ({
            totalTasks: 0,
            pendingTasks: 0,
            totalPayments: 0,
          })),
          getPendingSubmissions(userId),
        ]);

        setStats({
          totalTasks: statsData.totalTasks ?? 0,
          pendingTasks: statsData.pendingTasks ?? 0,
          totalPayments: statsData.totalPayments ?? 0,
        });

        setSubmissions(
          Array.isArray(submissionsData)
            ? submissionsData.filter((s) => s.status === "pending")
            : []
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    setActionLoading(true);
    try {
      await approveSubmission(submissionId, workerEmail, payableAmount);
      showToast("Submission approved successfully.", "success");

      const updatedSubs = await getPendingSubmissions(userId);
      setSubmissions(updatedSubs.filter((s) => s.status === "pending"));
      const updatedStats = await getBuyerStats(userId);
      setStats({
        totalTasks: updatedStats.totalTasks ?? 0,
        pendingTasks: updatedStats.pendingTasks ?? 0,
        totalPayments: updatedStats.totalPayments ?? 0,
      });
      setModalSubmission(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to approve submission.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (submissionId, taskId) => {
    setActionLoading(true);
    try {
      await rejectSubmission(submissionId, taskId);
      showToast("Submission rejected successfully.", "error");

      const updatedSubs = await getPendingSubmissions(userId);
      setSubmissions(updatedSubs.filter((s) => s.status === "pending"));
      const updatedStats = await getBuyerStats(userId);
      setStats({
        totalTasks: updatedStats.totalTasks ?? 0,
        pendingTasks: updatedStats.pendingTasks ?? 0,
        totalPayments: updatedStats.totalPayments ?? 0,
      });
      setModalSubmission(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to reject submission.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Chart Data
  const barData = submissions.map((s, idx) => ({
    name: s.task_title,
    amount: s.payable_amount,
  }));

  const pieData = [
    { name: "Approved", value: stats.totalTasks - stats.pendingTasks },
    { name: "Pending", value: stats.pendingTasks },
  ];

  const COLORS = ["#4ade80", "#facc15"];

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600 font-semibold">
        User not authenticated. Please log in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-600 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide drop-shadow-md">
        Buyer Dashboard
      </h1>

      {loading ? (
        <div className="text-center text-white font-semibold animate-pulse text-lg">
          Loading...
        </div>
      ) : error ? (
        <div className="max-w-lg mx-auto p-4 bg-red-100 text-red-700 rounded-md text-center font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <StatCard title="Total Tasks" value={stats.totalTasks} />
            <StatCard title="Pending Tasks" value={stats.pendingTasks} />
            <StatCard title="Total Payments" value={`$${stats.totalPayments}`} />
          </div>

          {/* Charts Section */}
          <div className="max-w-7xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-700 p-6 rounded-xl shadow-lg">
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-white font-bold mb-2 text-lg text-center">
                Task Payments
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#f9fafb" />
                  <YAxis stroke="#f9fafb" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <h3 className="text-white font-bold mb-2 text-lg text-center">
                Task Status
              </h3>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submissions Table */}
          <section className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-wide">
              Tasks To Review
            </h2>
            {submissions.length === 0 ? (
              <p className="text-center text-gray-200 font-medium">
                No pending submissions to review.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-500 bg-gray-700">
                <table className="min-w-full divide-y divide-gray-500 text-white">
                  <thead className="bg-gray-800 select-none">
                    <tr>
                      {["Worker Name", "Task Title", "Payable Amount", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="py-3 px-6 text-left text-lg font-semibold"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, idx) => (
                      <tr
                        key={submission._id}
                        className={`${
                          idx % 2 === 0 ? "bg-gray-600" : "bg-gray-500"
                        } hover:bg-gray-400 transition-colors`}
                      >
                        <td className="px-6 py-4 font-medium break-words">{submission.worker_name}</td>
                        <td className="px-6 py-4 break-words">{submission.task_title}</td>
                        <td className="px-6 py-4 font-semibold">${submission.payable_amount}</td>
                        <td className="px-6 py-4 space-x-2">
                          <ActionButton
                            label="Approve"
                            color="green"
                            onClick={() =>
                              handleApprove(
                                submission._id,
                                submission.worker_email,
                                submission.payable_amount
                              )
                            }
                            disabled={actionLoading}
                          />
                          <ActionButton
                            label="Reject"
                            color="red"
                            onClick={() =>
                              handleReject(submission._id, submission.task_id)
                            }
                            disabled={actionLoading}
                          />
                          <ActionButton
                            label="View"
                            color="indigo"
                            onClick={() => setModalSubmission(submission)}
                            disabled={actionLoading}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {modalSubmission && (
        <SubmissionModal
          submission={modalSubmission}
          onClose={() => setModalSubmission(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-gray-700 shadow-md rounded-lg p-6 text-center border border-gray-600 hover:shadow-lg transition">
    <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
    <p className="text-3xl font-extrabold text-white">{value}</p>
  </div>
);

const ActionButton = ({ label, color, onClick, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`disabled:opacity-50 disabled:cursor-not-allowed bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded shadow transition focus:outline-none focus:ring-2 focus:ring-${color}-400`}
  >
    {label}
  </button>
);

const SubmissionModal = ({ submission, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative text-white"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-2xl font-bold mb-4">{submission.task_title}</h3>
      <p className="mb-2">
        <strong>Worker:</strong> {submission.worker_name}
      </p>
      <p className="mb-2 whitespace-pre-wrap">
        <strong>Submission Details:</strong> {submission.submission_details}
      </p>
      <p className="mb-4">
        <strong>Payable Amount:</strong>{" "}
        <span className="text-green-400 font-semibold">
          ${submission.payable_amount}
        </span>
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default BuyerHome;
