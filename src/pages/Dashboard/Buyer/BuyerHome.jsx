import React, { useEffect, useState } from "react";
import { getBuyerStats } from "../../../services/buyer.service";
import { getPendingSubmissions, approveSubmission, rejectSubmission } from "../../../services/submission.service";
import { showToast } from "../../../utils/showToast";  // Assume you have a toast utility

const BuyerHome = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalPayments: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalSubmission, setModalSubmission] = useState(null); // To manage the submission modal

  const userId = "LYwD1OB4JvTds167X40a2qgEP403"; // Assume you get this from your auth context or props

  // Fetch stats and pending submissions for the buyer
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats for the buyer
        const statsData = await getBuyerStats(userId);
        setStats(statsData);

        // Fetch pending submissions
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

  // Approve a submission
  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    try {
      await approveSubmission(submissionId, workerEmail, payableAmount);
      showToast("Submission Approved", "success");

      // Refresh submissions after approval
      const updatedSubmissions = await getPendingSubmissions(userId);
      setSubmissions(updatedSubmissions);
    } catch (err) {
      showToast("Error approving submission", "error");
      console.error("Approval Error:", err);
    }
  };

  // Reject a submission
  const handleReject = async (submissionId, taskId) => {
    try {
      await rejectSubmission(submissionId, taskId);
      showToast("Submission Rejected", "error");

      // Refresh submissions after rejection
      const updatedSubmissions = await getPendingSubmissions(userId);
      setSubmissions(updatedSubmissions);
    } catch (err) {
      showToast("Error rejecting submission", "error");
      console.error("Rejection Error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl">Stats</h2>
            <p>Total Tasks: {stats.totalTasks}</p>
            <p>Pending Tasks: {stats.pendingTasks}</p>
            <p>Total Payments: ${stats.totalPayments}</p>
          </div>

          <div>
            <h2 className="text-xl mb-2">Task To Review</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Worker Name</th>
                  <th className="py-2 px-4 border-b text-left">Task Title</th>
                  <th className="py-2 px-4 border-b text-left">Payable Amount</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  submission.status === "pending" && (
                    <tr key={submission._id}>
                      <td className="py-2 px-4 border-b">{submission.worker_name}</td>
                      <td className="py-2 px-4 border-b">{submission.task_title}</td>
                      <td className="py-2 px-4 border-b">${submission.payable_amount}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                          onClick={() => handleApprove(submission._id, submission.worker_email, submission.payable_amount)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                          onClick={() => handleReject(submission._id, submission.task_id)}
                        >
                          Reject
                        </button>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                          onClick={() => setModalSubmission(submission)}
                        >
                          View Submission
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {modalSubmission && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">{modalSubmission.task_title}</h3>
            <p><strong>Worker:</strong> {modalSubmission.worker_name}</p>
            <p><strong>Details:</strong> {modalSubmission.submission_details}</p>
            <p><strong>Payable Amount:</strong> ${modalSubmission.payable_amount}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setModalSubmission(null)}
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