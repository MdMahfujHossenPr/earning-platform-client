import React, { useEffect, useState } from "react";
import { getPendingSubmissions, approveSubmission, rejectSubmission } from "../../../services/submission.service";  // Import functions from submission.service
import { useAuth } from "../../../context/AuthContext";  // To access the logged-in user info

const WorkerHome = () => {
  const { user } = useAuth();  // Access logged-in user's information
  const [submissions, setSubmissions] = useState([]); // State to store submissions
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store any error

  // Fetch worker submissions data when the component is mounted
  useEffect(() => {
    if (!user) return; // If user is not logged in, stop further execution

    const fetchWorkerData = async () => {
      try {
        const data = await getPendingSubmissions(user.uid);  // Fetch the pending submissions for the logged-in worker
        setSubmissions(data);  // Set the fetched submissions in state
      } catch (err) {
        setError("Failed to load submissions.");
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [user]);

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  // Handle approve submission
  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    try {
      const response = await approveSubmission(submissionId, workerEmail, payableAmount);
      if (response.success) {
        // Update state and show success toast
        setSubmissions(prevState => prevState.filter(sub => sub._id !== submissionId));
        alert("Submission approved successfully");
      }
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("Failed to approve submission");
    }
  };

  // Handle reject submission
  const handleReject = async (submissionId, taskId) => {
    try {
      const response = await rejectSubmission(submissionId, taskId);
      if (response.success) {
        // Update state and show success toast
        setSubmissions(prevState => prevState.filter(sub => sub._id !== submissionId));
        alert("Submission rejected successfully");
      }
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert("Failed to reject submission");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Worker Dashboard</h2>

      {/* Pending Submissions Table */}
      <h3 className="text-xl font-semibold mb-4">Pending Submissions</h3>
      {submissions.length === 0 ? (
        <p>No pending submissions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Task Title</th>
                <th className="px-4 py-2 text-left">Payable Amount</th>
                <th className="px-4 py-2 text-left">Buyer Name</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{submission.task_title}</td>
                  <td className="px-4 py-2">{submission.payable_amount}</td>
                  <td className="px-4 py-2">{submission.buyer_name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleApprove(submission._id, submission.worker_email, submission.payable_amount)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(submission._id, submission.task_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
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
