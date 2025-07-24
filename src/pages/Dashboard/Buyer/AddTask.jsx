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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-6">Add New Task</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="task_title"
          placeholder="Task Title (ex: Watch my YouTube video and comment)"
          value={formData.task_title}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />

        <textarea
          name="task_detail"
          placeholder="Task Detail"
          value={formData.task_detail}
          onChange={handleChange}
          required
          className="textarea textarea-bordered w-full"
          rows={4}
        />

        <input
          type="number"
          name="required_workers"
          placeholder="Required Workers (ex: 100)"
          value={formData.required_workers}
          onChange={handleChange}
          required
          min={1}
          className="input input-bordered w-full"
        />

        <input
          type="number"
          name="payable_amount"
          placeholder="Payable Amount per Worker (ex: 10)"
          value={formData.payable_amount}
          onChange={handleChange}
          required
          min={1}
          className="input input-bordered w-full"
        />

        <input
          type="date"
          name="completion_date"
          value={formData.completion_date}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />

        <textarea
          name="submission_info"
          placeholder="Submission Info (e.g. Screenshot or proof)"
          value={formData.submission_info}
          onChange={handleChange}
          required
          className="textarea textarea-bordered w-full"
          rows={3}
        />

        <div>
          <label className="block mb-1 font-medium">Task Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {loading && <p className="mt-2 text-blue-600 font-semibold">Uploading image...</p>}
          {formData.task_image_url && !loading && (
            <img
              src={formData.task_image_url}
              alt="Uploaded Task"
              className="mt-3 max-h-48 rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full ${loading ? "opacity-70" : ""}`}
        >
          {loading ? "Please wait..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
