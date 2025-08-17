// pages/Worker/TaskDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, submitTask } from "../../../services/task.service";
import { useAuth } from "../../../context/AuthContext";
import {
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../../services/submission.service";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const data = await getTaskById(id);
        setTask(data);
      } catch (err) {
        setError("❌ Failed to load task details.");
      }
    };
    fetchTaskDetails();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      if (user) {
        const data = await getPendingSubmissions(user.uid);
        setSubmissions(data);
      }
    } catch (err) {
      setError("❌ Failed to load submissions.");
    }
  };

  useEffect(() => {
    if (user) fetchSubmissions();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionDetails) return alert("Please enter submission details");
    if (!task) return alert("Task details are missing");

    setLoading(true);
    try {
      const data = {
        task_id: id,
        submission_details: submissionDetails,
        worker_email: user.email,
        worker_name: user?.name || "Unknown Worker",
        buyer_name: task.buyer_name,
        buyer_email: task.buyer_email,
        status: "pending",
      };
      await submitTask(data);
      alert("✅ Submission successful!");
      navigate("/dashboard/worker/my-submissions");
    } catch (err) {
      alert("❌ Error submitting task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    try {
      const res = await approveSubmission(submissionId, workerEmail, payableAmount);
      if (res.success) {
        alert("✅ Submission approved!");
        await fetchSubmissions();
      }
    } catch {
      alert("❌ Failed to approve.");
    }
  };

  const handleReject = async (submissionId, taskId) => {
    try {
      const res = await rejectSubmission(submissionId, taskId);
      if (res.success) {
        alert("❌ Submission rejected!");
        await fetchSubmissions();
      }
    } catch {
      alert("❌ Failed to reject.");
    }
  };

  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;
  if (!task) return <p className="text-center py-6 text-lg text-white">Loading task...</p>;

  return (
    <div className="min-h-screen p-6 sm:p-8 md:p-12">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          📋 Task Details
        </h2>

        {/* Task Info */}
        <div className="bg-gray-700 rounded-xl shadow-md p-6 md:flex items-center gap-6 mb-10 hover:shadow-xl transition-all">
          <img
            src={task.task_image_url}
            alt="Task"
            className="w-32 h-32 object-cover rounded-xl border-2 border-gray-500"
          />
          <div>
            <h3 className="text-2xl font-bold text-white">{task.task_title}</h3>
            <p className="text-gray-300 mt-2">{task.task_detail}</p>
            <div className="mt-4 text-gray-200 space-y-1">
              <p><strong>💰 Payable:</strong> {task.payable_amount} Coins</p>
              <p><strong>📝 Submission Info:</strong> {task.submission_info}</p>
            </div>
          </div>
        </div>

        {/* Previous Submissions */}
        <h3 className="text-2xl font-semibold text-white mb-4">📂 Previous Submissions</h3>
        {submissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((sub) => (
              <div
                key={sub._id}
                className="bg-gray-700 rounded-lg shadow-lg p-5 border border-gray-600 hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-lg font-semibold text-white">{task.task_title}</p>
                <p className="text-sm text-yellow-400 mb-2">Status: {sub.status}</p>
                <p className="text-sm text-gray-300">👤 {sub.worker_name}</p>
                <p className="text-xs text-gray-400">🕒 {new Date(sub.createdAt).toLocaleString()}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(sub._id, sub.worker_email, sub.payable_amount)}
                    className="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(sub._id, task._id)}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No previous submissions found.</p>
        )}

        {/* Submit Task */}
        <form onSubmit={handleSubmit} className="mt-10">
          <label className="block mb-2 text-lg font-semibold text-white">✍️ Submit Your Work</label>
          <textarea
            className="w-full p-4 text-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Write your submission details here..."
            rows={5}
            value={submissionDetails}
            onChange={(e) => setSubmissionDetails(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Submitting..." : "📤 Submit Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetails;
