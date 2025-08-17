import React, { useEffect, useState } from "react";
import {
  getBuyerStats,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../../services/submission.service";
import { showToast } from "../../../utils/showToast";
import { useAuth } from "../../../context/AuthContext";

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
  const [actionLoading, setActionLoading] = useState(false); // Disable buttons while action runs

  // Fetch buyer stats and pending submissions in parallel
useEffect(() => {
  if (!userId) return;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, submissionsData] = await Promise.all([
        getBuyerStats(userId).catch(err => {
          console.warn("Buyer stats fetch failed:", err);
          return { totalTasks: 0, pendingTasks: 0, totalPayments: 0 };
        }),
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
      console.error("Error fetching buyer data:", err);
      setError("Failed to load submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [userId]);


  // Approve submission handler
  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    setActionLoading(true);
    try {
      await approveSubmission(submissionId, workerEmail, payableAmount);
      showToast("Submission approved successfully.", "success");

      // Refresh submissions & stats after approval
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
      console.error("Error approving submission:", err);
      showToast("Failed to approve submission.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject submission handler
  const handleReject = async (submissionId, taskId) => {
    setActionLoading(true);
    try {
      await rejectSubmission(submissionId, taskId);
      showToast("Submission rejected successfully.", "error");

      // Refresh submissions & stats after rejection
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
      console.error("Error rejecting submission:", err);
      showToast("Failed to reject submission.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600 font-semibold">
        User not authenticated. Please log in.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center tracking-wide drop-shadow-md">
        Buyer Dashboard
      </h1>

      {loading ? (
        <div className="text-center text-indigo-600 font-semibold animate-pulse text-lg">
          Loading...
        </div>
      ) : error ? (
        <div className="max-w-lg mx-auto p-4 bg-red-100 text-red-700 rounded-md text-center font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <StatCard title="Total Tasks" value={stats.totalTasks} />
            <StatCard title="Pending Tasks" value={stats.pendingTasks} />
            <StatCard title="Total Payments" value={`$${stats.totalPayments}`} />
          </div>

          {/* Submissions Table */}
          <section className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800 tracking-wide">
              Tasks To Review
            </h2>
            {submissions.length === 0 ? (
              <p className="text-center text-indigo-700 font-medium">
                No pending submissions to review.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-lg border border-indigo-200">
                <table className="min-w-full bg-white divide-y divide-indigo-200">
                  <thead className="bg-indigo-700 text-white select-none">
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
                          idx % 2 === 0 ? "bg-indigo-50" : "bg-white"
                        } hover:bg-indigo-100 transition-colors`}
                      >
                        <td className="px-6 py-4 text-indigo-900 font-medium break-words">
                          {submission.worker_name}
                        </td>
                        <td className="px-6 py-4 text-indigo-800 break-words">
                          {submission.task_title}
                        </td>
                        <td className="px-6 py-4 text-indigo-700 font-semibold">
                          ${submission.payable_amount}
                        </td>
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
                            label="View Submission"
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

      {/* Submission Detail Modal */}
      {modalSubmission && (
        <SubmissionModal
          submission={modalSubmission}
          onClose={() => setModalSubmission(null)}
        />
      )}
    </div>
  );
};

// ——— Reusable components ———

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center border border-indigo-200 hover:shadow-lg transition">
    <h3 className="text-indigo-700 font-bold text-xl mb-2">{title}</h3>
    <p className="text-3xl font-extrabold text-indigo-900">{value}</p>
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
      className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-2xl font-bold mb-4 text-indigo-900">{submission.task_title}</h3>
      <p className="mb-2">
        <strong>Worker:</strong>{" "}
        <span className="text-indigo-700">{submission.worker_name}</span>
      </p>
      <p className="mb-2 whitespace-pre-wrap">
        <strong>Submission Details:</strong>{" "}
        <span className="text-indigo-600">{submission.submission_details}</span>
      </p>
      <p className="mb-4">
        <strong>Payable Amount:</strong>{" "}
        <span className="text-green-600 font-semibold">
          ${submission.payable_amount}
        </span>
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default BuyerHome;
