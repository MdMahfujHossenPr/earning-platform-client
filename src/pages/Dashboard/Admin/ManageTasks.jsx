import React, { useEffect, useState } from 'react';
import { getBuyerTasks, deleteTask } from '../../../services/task.service';  // Use getBuyerTasks instead of getTasks

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);  // State to store tasks
  const [loading, setLoading] = useState(true);  // State for loading

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const data = await getBuyerTasks();  // Fetch tasks using getBuyerTasks
      setTasks(data);
      setLoading(false);  // Set loading to false after data is fetched
    } catch (error) {
      console.error("Failed to fetch tasks:", error);  // Handle errors
      setLoading(false);  // Stop loading if error occurs
    }
  };

  // Function to handle deleting a task
  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);  // Call deleteTask function
        fetchTasks();  // Re-fetch tasks after deletion
      } catch (error) {
        console.error("Failed to delete task:", error);  // Handle errors
      }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Manage Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>  // Display loading message while fetching tasks
      ) : (
        <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-6 py-3">Task Title</th>
              <th className="px-6 py-3">Buyer</th>
              <th className="px-6 py-3">Payable Amount</th>
              <th className="px-6 py-3">Required Workers</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="border-b border-gray-200">
                  <td className="px-6 py-4">{task.task_title}</td>
                  <td className="px-6 py-4">{task.buyer_name}</td>
                  <td className="px-6 py-4">{task.payable_amount}</td>
                  <td className="px-6 py-4">{task.required_workers}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(task._id)}  // Call handleDelete on click
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete Task
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageTasks;
