// lib/axios.ts
"use client";

import axios from "axios";
import { 
  handle401Unauthorized, 
  handle403Forbidden, 
  logError 
} from "./errorHandlers";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Inject token sebelum request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    logError(error, "Request Interceptor");
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error untuk debugging
    logError(error, "Response Interceptor");

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - token invalid atau expired
          // Redirect ke login page
          handle401Unauthorized();
          break;

        case 403:
          // Forbidden - user tidak punya akses
          // Redirect ke halaman 403
          handle403Forbidden();
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - log dan tampilkan pesan
          console.error("Server Error:", error.response.data);
          break;

        default:
          // Error lainnya - biarkan component yang handle
          break;
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error("Network Error: Tidak dapat terhubung ke server");
    } else {
      // Error lain saat setup request
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);
