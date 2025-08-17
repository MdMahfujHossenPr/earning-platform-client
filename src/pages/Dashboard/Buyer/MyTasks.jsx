import React, { useEffect, useState } from "react";
import { getBuyerTasks, updateTask, deleteTask } from "../../../services/task.service";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getBuyerTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleUpdate = async (taskId, updates) => {
    try {
      await updateTask(taskId, updates);
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async (task) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task._id);
        fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  return (
    <div className="min-h-screen  p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
          📋 My Tasks
        </h2>

        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                {["Title", "Details", "Submission Info", "Actions"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-3 sm:px-6 py-2 sm:py-3 text-left text-white text-sm sm:text-base md:text-lg font-semibold tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <tr
                    key={task._id}
                    className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                  >
                    <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-normal text-white font-medium max-w-xs break-words text-sm sm:text-base md:text-lg">
                      {task.task_title}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-normal text-gray-300 max-w-sm break-words text-sm sm:text-base md:text-lg">
                      {task.task_detail}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-normal text-gray-300 max-w-sm break-words text-sm sm:text-base md:text-lg">
                      {task.submission_info}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap space-x-2 sm:space-x-3">
                      <button
                        onClick={() => {
                          const title = prompt("New Title", task.task_title);
                          const detail = prompt("New Detail", task.task_detail);
                          const submission = prompt(
                            "New Submission Info",
                            task.submission_info
                          );
                          if (title && detail && submission) {
                            handleUpdate(task._id, {
                              task_title: title,
                              task_detail: detail,
                              submission_info: submission,
                            });
                          }
                        }}
                        className="inline-flex items-center px-3 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm md:text-base"
                        title="Update Task"
                      >
                        ✏️ Update
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="inline-flex items-center px-3 sm:px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 text-xs sm:text-sm md:text-base"
                        title="Delete Task"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-16 text-gray-400 text-base sm:text-lg md:text-xl italic font-semibold"
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
