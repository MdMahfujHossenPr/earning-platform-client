import axios from "axios";

const instance = axios.create({
  baseURL: "https://earning-platform-server-seven.vercel.app",
});

export default instance;
