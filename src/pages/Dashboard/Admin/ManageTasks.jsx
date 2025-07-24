import React, { useEffect, useState } from 'react';
import { getBuyerTasks, deleteTask } from '../../../services/task.service';  // Use getBuyerTasks instead of getTasks

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getBuyerTasks();  // Fetch tasks using getBuyerTasks
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);  // Handle errors
    }
  };

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
      <h2>Manage Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Buyer</th>
            <th>Payable Amount</th>
            <th>Required Workers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task_title}</td>
                <td>{task.buyer_name}</td>
                <td>{task.payable_amount}</td>
                <td>{task.required_workers}</td>
                <td>
                  <button onClick={() => handleDelete(task._id)}>Delete Task</button>
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
    </div>
  );
};

export default ManageTasks;
