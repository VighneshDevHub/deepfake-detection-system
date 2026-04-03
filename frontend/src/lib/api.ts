import axios from "axios";
import { DetectionResult, VideoDetectionResult } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const API_PREFIX = "/api/v1";


const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 60000, // 60 seconds timeout for large files
});

// Add a response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log more descriptive error information
    const errorDetails = {
      message: error.message || "Unknown error",
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };

    console.error("API Error Details:", errorDetails);
     console.error("Raw Error Object:", error);
     
     // Provide a more user-friendly error message if it's a network error
     if (error.message === "Network Error") {
       console.warn("Hint: Check if the backend is running at " + API_BASE_URL);
     }

    return Promise.reject(error);
  }
);

export const detectImage = async (file: File, threshold: number = 0.5): Promise<DetectionResult> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post<DetectionResult>(`/detect/image?threshold=${threshold}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export const detectVideo = async (file: File, threshold: number = 0.5): Promise<VideoDetectionResult> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await api.post<VideoDetectionResult>(`/detect/video?threshold=${threshold}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export default api;
