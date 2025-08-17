// pages/Worker/TaskList.jsx
import React, { useEffect, useState } from "react";
import { getAvailableTasks } from "../../../services/task.service";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getAvailableTasks();
      setTasks(data);
    } catch (err) {
      setError("⚠️ Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (taskId) => {
    navigate(`/dashboard/task-details/${taskId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-400 text-xl font-semibold animate-pulse">
          Loading tasks...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      <h2 className="text-4xl font-bold text-center text-white mb-10">
        📋 Explore Available Tasks
      </h2>

      {error && (
        <p className="text-red-500 text-center bg-red-100 rounded-lg py-3 px-5 mb-6 font-medium shadow">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.length > 0 ? (
          tasks.map((task) =>
            task.required_workers > 0 ? (
              <div
                key={task._id}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transform transition duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {task.task_title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    👤 Buyer:{" "}
                    <span className="font-semibold text-white">
                      {task.buyer_name}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    📅 Completion Date:{" "}
                    <span className="font-semibold text-white">
                      {new Date(task.completion_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    💰 Payable Amount:{" "}
                    <span className="font-semibold text-green-400">
                      ${task.payable_amount}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm mb-1">
                    🧑‍🤝‍🧑 Required Workers:{" "}
                    <span className="font-semibold text-blue-400">
                      {task.required_workers}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetails(task._id)}
                  className="mt-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  🔍 View Details
                </button>
              </div>
            ) : null
          )
        ) : (
          <p className="col-span-full text-center text-gray-400 text-lg mt-10">
            🚫 No tasks available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
