import React, { useEffect, useState } from "react";
import {
  getBuyerTasks,
  updateTask,
  deleteTask,
  refundCoinsForUncompletedTasks,
} from "../../../services/task.service";

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
    console.log("Deleting task with ID:", task._id);  // Log task ID for debugging
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task._id);  // Delete the task by its ID
        fetchTasks();  // Reload tasks after deletion
      } catch (error) {
        console.error("Failed to delete task:", error);  // Log any delete errors
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📋 My Tasks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Details</th>
              <th className="py-2 px-4 border-b">Submission Info</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td className="py-2 px-4 border-b">{task.task_title}</td>
                  <td className="py-2 px-4 border-b">{task.task_detail}</td>
                  <td className="py-2 px-4 border-b">{task.submission_info}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        const title = prompt("New Title", task.task_title);
                        const detail = prompt("New Detail", task.task_detail);
                        const submission = prompt("New Submission Info", task.submission_info);
                        if (title && detail && submission) {
                          handleUpdate(task._id, {
                            task_title: title,
                            task_detail: detail,
                            submission_info: submission,
                          });
                        }
                      }}
                    >
                      ✏️ Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(task)}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTasks;
