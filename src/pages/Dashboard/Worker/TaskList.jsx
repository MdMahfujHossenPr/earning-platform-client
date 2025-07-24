import React, { useEffect, useState } from "react";
import { getAvailableTasks } from "../../../services/task.service";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state
  const [error, setError] = useState(null);      // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const data = await getAvailableTasks();
      setTasks(data);
    } catch (error) {
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);  // Set loading to false once data is fetched
    }
  };

  const handleViewDetails = (taskId) => {
    navigate(`/dashboard/task-details/${taskId}`);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading tasks...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📋 Available Tasks</h2>
      {error && <p className="text-red-500 text-center">{error}</p>} {/* Error message */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) =>
            task.required_workers > 0 && (
              <div
                key={task._id}
                className="bg-white shadow-md rounded-lg p-4 transition duration-300 transform hover:scale-105 hover:bg-gray-100"
              >
                <h3 className="text-xl font-bold">{task.task_title}</h3>
                <p className="text-gray-500">Buyer: {task.buyer_name}</p>
                <p className="text-gray-500">Completion Date: {new Date(task.completion_date).toLocaleDateString()}</p>
                <p className="text-gray-500">Payable Amount: ${task.payable_amount}</p>
                <p className="text-gray-500">Required Workers: {task.required_workers}</p>
                <button
                  onClick={() => handleViewDetails(task._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            )
          )
        ) : (
          <p className="text-center text-gray-500 col-span-3">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
