import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || "https://chugli-backend-d3f9.onrender.com"}/api`,
  withCredentials: true,
});

// Add Authorization header interceptor for Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
