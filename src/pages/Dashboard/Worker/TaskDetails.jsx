import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, submitTask } from "../../../services/task.service";
import { useAuth } from "../../../context/AuthContext";
import { getPendingSubmissions, approveSubmission, rejectSubmission } from "../../../services/submission.service";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Fetch task details when the component mounts
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const data = await getTaskById(id); 
        setTask(data); 
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("Failed to load task details. Please try again later.");
      }
    };

    fetchTaskDetails();
  }, [id]);

  // Fetch worker submissions when the user is logged in
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        if (user) {
          const data = await getPendingSubmissions(user.uid); // Fetch pending submissions for the user
          setSubmissions(data); 
        }
      } catch (err) {
        console.error("Error fetching worker submissions:", err);
        setError("Failed to load submissions.");
      }
    };

    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  // Handle task submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionDetails) {
      return alert("Please enter submission details");
    }

    if (!task) {
      return alert("Task details are missing");
    }

    const worker_name = user?.name || "Unknown Worker"; 

    setLoading(true);

    try {
      const data = {
        task_id: id,
        submission_details: submissionDetails,
        worker_email: user.email,
        worker_name: worker_name,
        buyer_name: task.buyer_name,
        buyer_email: task.buyer_email,
        status: "pending",
      };
      console.log("Submitting task with data:", data);
      await submitTask(data);

      alert("Submission successful!");
      navigate("/dashboard/worker/my-submissions");
    } catch (err) {
      alert("Error submitting task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve submission
  const handleApprove = async (submissionId, workerEmail, payableAmount) => {
    try {
      const response = await approveSubmission(submissionId, workerEmail, payableAmount);
      if (response.success) {
        alert("Submission approved successfully");
        await fetchSubmissions(); // Refresh the submissions after approval
      }
    } catch (error) {
      alert("Failed to approve submission");
    }
  };

  // Handle reject submission
  const handleReject = async (submissionId, taskId) => {
    try {
      const response = await rejectSubmission(submissionId, taskId);
      if (response.success) {
        alert("Submission rejected successfully");
        await fetchSubmissions(); // Refresh the submissions after rejection
      }
    } catch (error) {
      alert("Failed to reject submission");
    }
  };

  if (error) return <p>{error}</p>;
  if (!task) return <p>Loading task...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Task Details</h2>
      
      {/* Task Information Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
            <img src={task.task_image_url} alt="Task" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{task.task_title}</p>
            <p className="text-sm text-gray-500">Task Description</p>
          </div>
        </div>

        <p className="text-gray-700">{task.task_detail}</p>
        <p className="mt-4 text-gray-800">
          <strong>Payable Amount:</strong> {task.payable_amount} Coins
        </p>
        <p className="text-gray-800">
          <strong>Submission Info:</strong> {task.submission_info}
        </p>
      </div>

      {/* Previous Submissions */}
      <h4 className="text-2xl font-semibold mb-4 text-gray-800">Previous Submissions</h4>
      {submissions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-300">
              <p className="text-gray-800">
                <strong>Task:</strong> {task.task_title}
              </p>
              <p className="text-gray-800">
                <strong>Status:</strong> {submission.status}
              </p>
              <p className="text-gray-800">
                <strong>Submitted by:</strong> {submission.worker_name}
              </p>
              <p className="text-gray-500">
                <strong>Created At:</strong> {new Date(submission.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleApprove(submission._id, submission.worker_email, submission.payable_amount)}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(submission._id, task._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No previous submissions found</p>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your submission details"
          value={submissionDetails}
          onChange={(e) => setSubmissionDetails(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          {loading ? "Submitting..." : "Submit Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskDetails;
