import React, { useEffect, useState } from 'react';
import { getBuyerTasks, deleteTask } from '../../../services/task.service';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getBuyerTasks();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(task => task._id !== taskId));
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  return (
    <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Manage Tasks
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : tasks.length > 0 ? (
        <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase">
              <tr>
                <th className="py-4 px-6">Task Title</th>
                <th className="py-4 px-6">Buyer</th>
                <th className="py-4 px-6">Payable</th>
                <th className="py-4 px-6">Workers</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-blue-300">
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="py-3 px-6">{task.task_title}</td>
                  <td className="py-3 px-6">{task.buyer_name}</td>
                  <td className="py-3 px-6">${task.payable_amount}</td>
                  <td className="py-3 px-6">{task.required_workers}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-lg shadow transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-16">
          <p className="text-black text-lg font-medium">No tasks found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
