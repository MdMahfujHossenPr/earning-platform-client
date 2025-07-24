import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, submitTask } from "../../../services/task.service";
import { useAuth } from "../../../context/AuthContext"; // To access the user info

const TaskDetails = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user information from the context
  const [task, setTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle errors

  // Fetch task details when the component mounts
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const data = await getTaskById(id); // Fetch task by ID from API
        setTask(data); // Set the task data if successful
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("Failed to load task details. Please try again later."); // Set error message if fetching fails
      }
    };

    fetchTaskDetails();
  }, [id]);

  // Handle task submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionDetails) {
      return alert("Please enter submission details");
    }

    // Log the worker name to check if it's coming from Firebase correctly
    console.log("Worker Name (From Firebase):", user.name);

    // If worker_name is undefined, fallback to 'Unknown Worker'
    const worker_name = user && user.name ? user.name : 'Unknown Worker';
    console.log('Final Worker Name:', worker_name); // Check the final value of worker_name

    setLoading(true);

    try {
      // Prepare data to be sent for submission
      const data = {
        task_id: id,
        submission_details: submissionDetails,
        worker_email: user.email,
         
        buyer_name: task.buyer_name,
        buyer_email: task.buyer_email,
        status: "pending",  // Default to 'pending' if not provided
      };

      // Submit the task with the data
      await submitTask(data);

      alert("Submission successful!");
      navigate("/dashboard/worker/my-submissions"); // Redirect after successful submission
    } catch (err) {
      alert("Error submitting task: " + err.message); // Show error message if submission fails
    } finally {
      setLoading(false);
    }
  };

  console.log("Task ID:", id); // যাচাই করুন task_id সঠিক MongoDB ObjectId ফরম্যাটে আছে কিনা
  console.log('User Display Name:', user.name); // চেক করুন, ফায়ারবেস থেকে সঠিক নাম আসছে কি না



  // Display error if fetching task details fails
  if (error) return <p>{error}</p>;

  // Display loading message until task data is fetched
  if (!task) return <p>Loading task...</p>;

  return (
    <div>
      <h2>Task Details</h2>
      <h3>{task.task_title}</h3>
      <p>{task.task_detail}</p>
      <p>Payable Amount: {task.payable_amount} Coins</p>
      <p>Submission Info: {task.submission_info}</p>
      

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your submission details"
          value={submissionDetails}
          onChange={(e) => setSubmissionDetails(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskDetails;
