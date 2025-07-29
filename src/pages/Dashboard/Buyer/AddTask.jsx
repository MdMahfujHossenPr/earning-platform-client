import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { addTask } from "../../../services/task.service";
import uploadImageToImgBB from "../../../utils/imgbbUpload";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    task_title: "",
    task_detail: "",
    required_workers: "",
    payable_amount: "",
    completion_date: "",
    submission_info: "",
    task_image_url: "",
    buyer_name: user?.name || "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "required_workers" || name === "payable_amount") && value !== "") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const url = await uploadImageToImgBB(file);
      setFormData((prev) => ({ ...prev, task_image_url: url }));
    } catch {
      setErrorMsg("Image upload failed. Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
    } = formData;

    if (
      !task_title?.trim() ||
      !task_detail?.trim() ||
      !required_workers ||
      !payable_amount ||
      !completion_date ||
      !submission_info?.trim()
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    const reqWorkersNum = parseInt(required_workers, 10);
    const payableAmountNum = parseInt(payable_amount, 10);

    if (
      isNaN(reqWorkersNum) ||
      isNaN(payableAmountNum) ||
      reqWorkersNum <= 0 ||
      payableAmountNum <= 0
    ) {
      setErrorMsg("Required workers and payable amount must be positive numbers.");
      return;
    }

    if (isNaN(Date.parse(completion_date))) {
      setErrorMsg("Please select a valid completion date.");
      return;
    }

    const totalPayable = reqWorkersNum * payableAmountNum;

    if (user.coin < totalPayable) {
      alert("❌ Not enough coins. Please purchase coins.");
      navigate("/dashboard/buyer/purchasecoin");
      return;
    }

    const taskPayload = {
      task_title: task_title.trim(),
      task_detail: task_detail.trim(),
      required_workers: reqWorkersNum,
      payable_amount: payableAmountNum,
      completion_date,
      submission_info: submission_info.trim(),
      task_image_url,
      uid: user.uid,
      buyer_name: user.name,
    };

    console.log("Sending task payload:", taskPayload);

    setLoading(true);
    setErrorMsg("");

    try {
      await addTask(taskPayload);
      alert("✅ Task added successfully!");
      navigate("/dashboard/my-tasks");
    } catch (error) {
      console.error("Add Task Error:", error);

      if (error.response?.status === 400) {
        alert(error.response.data.message || "Bad request or not enough coins.");
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
        navigate("/login");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-xl shadow-lg
                    border-white border-2 md:border-4">
      <h2 className="text-3xl font-semibold text-center mb-6 text-sky-700">
        Add New Task
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div>
          <label className="block text-sky-700 font-semibold">Task Title</label>
          <input
            type="text"
            name="task_title"
            placeholder="Task Title (e.g. Watch my YouTube video and comment)"
            value={formData.task_title}
            onChange={handleChange}
            required
            className="input input-bordered w-full text-sky-700 p-3 mt-2 rounded-lg border-white border-2 md:border-4 
                       bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Task Detail */}
        <div>
          <label className="block text-sky-700 font-semibold">Task Detail</label>
          <textarea
            name="task_detail"
            placeholder="Task Detail"
            value={formData.task_detail}
            onChange={handleChange}
            required
            rows={4}
            className="textarea textarea-bordered w-full text-sky-700 p-3 mt-2 rounded-lg border-white border-2 md:border-4
                       bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Required Workers and Payable Amount */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <label className="block text-sky-700 font-semibold">Required Workers</label>
            <input
              type="number"
              name="required_workers"
              placeholder="e.g., 100"
              value={formData.required_workers}
              onChange={handleChange}
              required
              min={1}
              className="input input-bordered w-full text-sky-700 p-3 mt-2 rounded-lg border-white border-2 md:border-4
                         bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sky-700 font-semibold">Payable Amount</label>
            <input
              type="number"
              name="payable_amount"
              placeholder="e.g., 10"
              value={formData.payable_amount}
              onChange={handleChange}
              required
              min={1}
              className="input input-bordered w-full text-sky-700 p-3 mt-2 rounded-lg border-white border-2 md:border-4
                         bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Completion Date */}
        <div>
          <label className="block text-sky-700 font-semibold">Completion Date</label>
          <input
            type="date"
            name="completion_date"
            value={formData.completion_date}
            onChange={handleChange}
            required
            className="input input-bordered w-full text-sky-700 p-3 mt-2 rounded-lg border-white border-2 md:border-4
                       bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Submission Info */}
        <div>
          <label className="block text-sky-700 font-semibold">Submission Info</label>
          <textarea
            name="submission_info"
            placeholder="Submission Info (e.g. Screenshot or proof)"
            value={formData.submission_info}
            onChange={handleChange}
            required
            rows={3}
            className="textarea textarea-bordered w-full text-sky-700 p-3 mt-2 rounded-lg border-white border-2 md:border-4
                       bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Task Image */}
        <div>
          <label className="block text-sky-700 font-semibold">Task Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full mt-2 border-white border-2 md:border-4"
          />
          {loading && <p className="mt-2 text-sky-700 font-semibold">Uploading image...</p>}
          {formData.task_image_url && !loading && (
            <img
              src={formData.task_image_url}
              alt="Uploaded Task"
              className="mt-3 max-h-48 rounded-lg border border-white"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full ${loading ? "opacity-70" : ""} py-3 text-lg font-semibold`}
        >
          {loading ? "Please wait..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
