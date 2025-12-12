// lib/axios.ts
"use client";

import axios from "axios";
import { logoutUser } from "./auth"; 

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Inject token sebelum request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      // ⛔ Abaikan auto-logout jika sedang di halaman auth/login
      if (currentPath !== "/auth/login") {
        if (error.response?.status === 401) {
          logoutUser();
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);
