import React, { useEffect, useState } from 'react';
import { getBuyerTasks, deleteTask } from '../../../services/task.service';
import { toast } from 'react-hot-toast';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getBuyerTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("❌ Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(task => task._id !== taskId));
        toast.success("✅ Task deleted successfully");
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error("❌ Could not delete task. Try again.");
      }
    }
  };

  return (
    <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Manage Tasks
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : tasks.length > 0 ? (
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/40 backdrop-blur-md">
          <table className="table w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase">
              <tr>
                <th className="py-4 px-6">Task Title</th>
                <th className="py-4 px-6">Buyer</th>
                <th className="py-4 px-6">Payable</th>
                <th className="py-4 px-6">Workers</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={`transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-gray-50/70 dark:bg-gray-700/30'
                  }`}
                >
                  <td className="py-3 px-6 font-medium">{task.task_title}</td>
                  <td className="py-3 px-6">{task.buyer_name}</td>
                  <td className="py-3 px-6 text-green-500 font-semibold">${task.payable_amount}</td>
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
          <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">No tasks found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
