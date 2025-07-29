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
    } catch (error) {
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
        <p className="text-blue-500 text-xl font-semibold animate-pulse">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
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
                className="bg-gradient-to-tr from-white via-blue-50 to-indigo-100 border border-indigo-200 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
              >
                <h3 className="text-2xl font-extrabold text-indigo-800 mb-2">
                  {task.task_title}
                </h3>
                <p className="text-gray-600 text-base font-medium">
                  👤 Buyer: <span className="font-semibold text-gray-800">{task.buyer_name}</span>
                </p>
                <p className="text-gray-600">
                  📅 Completion Date:{" "}
                  <span className="font-semibold">
                    {new Date(task.completion_date).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-600">
                  💰 Payable Amount: <span className="font-semibold text-green-700">${task.payable_amount}</span>
                </p>
                <p className="text-gray-600">
                  🧑‍🤝‍🧑 Required Workers:{" "}
                  <span className="font-semibold text-blue-600">{task.required_workers}</span>
                </p>
                <button
                  onClick={() => handleViewDetails(task._id)}
                  className="mt-5 w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  🔍 View Details
                </button>
              </div>
            ) : null
          )
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg mt-10">
            🚫 No tasks available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
