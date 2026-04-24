import axios from "axios";
import { DetectionResult, VideoDetectionResult } from "@/types";
import { supabase } from "./supabase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_PREFIX = "/api/v1";

const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 60000,
});

// Add a request interceptor to include the Supabase token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Add a response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      message: error.message || "Unknown error",
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    };
    console.error("API Error:", errorDetails);
    return Promise.reject(error);
  }
);

export interface StatsData {
  total_detections: number;
  fake_detected: number;
  real_detected: number;
  fake_percentage: number;
  image_detections: number;
  video_detections: number;
}

export interface HistoryItem {
  id: number;
  filename: string;
  media_type: string;
  label: string;
  confidence: number;
  is_fake: boolean;
  created_at: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export const getStats = async (): Promise<StatsData> => {
  const response = await api.get<StatsData>("/history/stats");
  return response.data;
};

export const getHistory = async (page: number = 1, perPage: number = 10): Promise<HistoryResponse> => {
  const response = await api.get<HistoryResponse>(`/history?page=${page}&per_page=${perPage}`);
  return response.data;
};

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
