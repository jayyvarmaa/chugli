import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || "https://chugli-backend-d3f9.onrender.com"}/api`,
  withCredentials: true,
});
