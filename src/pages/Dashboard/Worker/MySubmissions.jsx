import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPendingSubmissions, approveSubmission, rejectSubmission } from "../../../services/submission.service";  // Import the service functions
import { showToast } from "../../../utils/showToast";  // Custom toast function

const MySubmissions = () => {
  const { user } = useAuth();  // Get the current user
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending submissions for the logged-in user
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        // Get pending submissions filtered by the logged-in user's ID
        const data = await getPendingSubmissions(user.uid); 
        console.log("Fetched Submissions:", data);  // Debugging the response
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setError("There was an error fetching your submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
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

  // If user is not logged in, show a message to log in
  if (!user) {
    return (
      <div className="p-6 text-center bg-yellow-100 text-yellow-700 rounded-lg">
        Please log in to see your submissions.
      </div>
    );
  }

  // Handle approve submission
  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    try {
      const response = await approveSubmission(submissionId, workerEmail, payableAmount);
      if (response.success) {
        showToast("Submission approved successfully", "success");
        // Refetch pending submissions after approval
        await fetchSubmissions();
      }
    } catch (error) {
      showToast("Failed to approve submission", "error");
    }
  };

  // Handle reject submission
  const handleReject = async (submissionId, taskId) => {
    try {
      const response = await rejectSubmission(submissionId, taskId);
      if (response.success) {
        showToast("Submission rejected successfully", "success");
        // Refetch pending submissions after rejection
        await fetchSubmissions();
      }
    } catch (error) {
      showToast("Failed to reject submission", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Submissions</h2>
      {submissions.length === 0 ? (
        <div className="p-4 text-center bg-blue-100 text-blue-700 rounded-lg">
          No submissions found. Start completing tasks to earn coins!
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Task Title</th>
                <th className="px-4 py-2 text-left">Payable Amount</th>
                <th className="px-4 py-2 text-left">Buyer Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Submission Date</th>
                <th className="px-4 py-2 text-left">Worker Name</th>
                <th className="px-4 py-2 text-left">Submission Details</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions
                .filter((submission) => submission.worker_email === user.email) // Filter submissions by worker email
                .map((sub) => {
                  console.log("Submission:", sub); // Debugging the individual submission
                  return (
                    <tr
                      key={sub._id}
                      className={`${
                        sub.status === "approved"
                          ? "bg-green-100"
                          : sub.status === "rejected"
                          ? "bg-red-100"
                          : "bg-white"
                      } border-b hover:bg-gray-50`}
                    >
                      <td className="px-4 py-2">{sub.task_title}</td>
                      <td className="px-4 py-2">{sub.payable_amount}</td>
                      <td className="px-4 py-2">{sub.buyer_name || "No buyer"}</td>
                      <td className="px-4 py-2">{sub.status}</td>
                      <td className="px-4 py-2">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No date available"}
                      </td>
                      <td className="px-4 py-2">{sub.worker_name || "No worker name"}</td>
                      <td className="px-4 py-2">{sub.submission_details || "No details available"}</td>
                      <td className="px-4 py-2">
                        {sub.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(sub._id, sub.worker_email, sub.payable_amount)}
                              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(sub._id, sub.task_id)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
