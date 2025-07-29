import React, { useEffect, useState } from "react";
import {
  getBuyerStats,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../../services/submission.service";
import { showToast } from "../../../utils/showToast";

const BuyerHome = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalPayments: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalSubmission, setModalSubmission] = useState(null);

  const userId = "LYwD1OB4JvTds167X40a2qgEP403"; // Replace with your auth userId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getBuyerStats(userId);
        setStats(statsData);

        const pendingData = await getPendingSubmissions(userId);
        setSubmissions(pendingData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data, please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    try {
      await approveSubmission(submissionId, workerEmail, payableAmount);
      showToast("Submission Approved", "success");
      const updatedSubmissions = await getPendingSubmissions(userId);
      setSubmissions(updatedSubmissions);
    } catch (err) {
      showToast("Error approving submission", "error");
      console.error("Approval Error:", err);
    }
  };

  const handleReject = async (submissionId, taskId) => {
    try {
      await rejectSubmission(submissionId, taskId);
      showToast("Submission Rejected", "error");
      const updatedSubmissions = await getPendingSubmissions(userId);
      setSubmissions(updatedSubmissions);
    } catch (err) {
      showToast("Error rejecting submission", "error");
      console.error("Rejection Error:", err);
    }
  };

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
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Stats Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 text-center border border-indigo-200 hover:shadow-lg transition">
              <h3 className="text-indigo-700 font-bold text-xl mb-2">Total Tasks</h3>
              <p className="text-3xl font-extrabold text-indigo-900">{stats.totalTasks}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center border border-indigo-200 hover:shadow-lg transition">
              <h3 className="text-indigo-700 font-bold text-xl mb-2">Pending Tasks</h3>
              <p className="text-3xl font-extrabold text-indigo-900">{stats.pendingTasks}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center border border-indigo-200 hover:shadow-lg transition">
              <h3 className="text-indigo-700 font-bold text-xl mb-2">Total Payments</h3>
              <p className="text-3xl font-extrabold text-indigo-900">${stats.totalPayments}</p>
            </div>
          </div>

          {/* Submissions Table */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800 tracking-wide">
              Tasks To Review
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-lg border border-indigo-200">
              <table className="min-w-full bg-white divide-y divide-indigo-200">
                <thead className="bg-indigo-700 text-white select-none">
                  <tr>
                    {[
                      "Worker Name",
                      "Task Title",
                      "Payable Amount",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-6 text-left text-lg font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, idx) =>
                    submission.status === "pending" ? (
                      <tr
                        key={submission._id}
                        className={`${
                          idx % 2 === 0 ? "bg-indigo-50" : "bg-white"
                        } hover:bg-indigo-100 transition-colors cursor-pointer`}
                      >
                        <td className="px-6 py-4 whitespace-normal max-w-xs break-words text-indigo-900 font-medium">
                          {submission.worker_name}
                        </td>
                        <td className="px-6 py-4 whitespace-normal max-w-sm break-words text-indigo-800">
                          {submission.task_title}
                        </td>
                        <td className="px-6 py-4 text-indigo-700 font-semibold">
                          ${submission.payable_amount}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() =>
                              handleApprove(
                                submission._id,
                                submission.worker_email,
                                submission.payable_amount
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition focus:outline-none focus:ring-2 focus:ring-green-400"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReject(submission._id, submission.task_id)
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition focus:outline-none focus:ring-2 focus:ring-red-400"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setModalSubmission(submission)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          >
                            View Submission
                          </button>
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Submission Detail Modal */}
      {modalSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          onClick={() => setModalSubmission(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-indigo-900">
              {modalSubmission.task_title}
            </h3>
            <p className="mb-2">
              <strong>Worker:</strong>{" "}
              <span className="text-indigo-700">{modalSubmission.worker_name}</span>
            </p>
            <p className="mb-2 whitespace-pre-wrap">
              <strong>Details:</strong>{" "}
              <span className="text-indigo-600">{modalSubmission.submission_details}</span>
            </p>
            <p className="mb-4">
              <strong>Payable Amount:</strong>{" "}
              <span className="text-green-600 font-semibold">
                ${modalSubmission.payable_amount}
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalSubmission(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
