import axios from 'axios'; // ✅ এটা নিশ্চিতভাবে থাকা লাগবে

const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const imgbbApiKey = import.meta.env.VITE_IMG_API_KEY; // 🔁 তোমার নিজস্ব imgbb API key বসাও
  const url = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

  const response = await axios.post(url, formData);
  return response.data.data.url;
};

export default uploadImageToImgBB;
