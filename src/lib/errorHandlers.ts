/**
 * HTTP Error Handler Helpers
 * 
 * Helper functions untuk menangani error HTTP responses
 * dan melakukan navigasi yang sesuai
 */

import { logoutUser } from "./auth";

/**
 * Handle 401 Unauthorized Error
 * User tidak terautentikasi atau token expired
 * Redirect ke halaman login
 */
export const handle401Unauthorized = () => {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;

  // Jangan logout jika sudah di halaman login
  if (currentPath === "/" || currentPath === "/login") {
    return;
  }

  // Logout user dan hapus token
  logoutUser();

  // Simpan halaman yang ingin diakses untuk redirect setelah login
  const intendedPath = currentPath !== "/" ? currentPath : "/dashboard";
  sessionStorage.setItem("intendedPath", intendedPath);

  // Redirect ke halaman login
  window.location.href = "/";
};

/**
 * Handle 403 Forbidden Error
 * User terautentikasi tapi tidak punya akses
 * Redirect ke halaman 403
 */
export const handle403Forbidden = () => {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;

  // Jangan redirect jika sudah di halaman 403
  if (currentPath === "/403") {
    return;
  }

  // Redirect ke halaman 403
  window.location.href = "/403";
};

/**
 * Handle 500 Internal Server Error
 * Server error - tampilkan pesan error
 */
export const handle500ServerError = (error: any) => {
  console.error("Server Error:", error);
  
  // Bisa ditambahkan toast notification atau error boundary
  return {
    message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    status: 500,
  };
};

/**
 * Handle 404 Not Found Error
 * Resource tidak ditemukan
 */
export const handle404NotFound = (error: any) => {
  console.error("Resource Not Found:", error);
  
  return {
    message: "Data yang Anda cari tidak ditemukan.",
    status: 404,
  };
};

/**
 * Get user-friendly error message
 * Konversi error response ke pesan yang user-friendly
 */
export const getErrorMessage = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || "Permintaan tidak valid. Periksa kembali data yang Anda masukkan.";
      case 401:
        return "Sesi Anda telah berakhir. Silakan login kembali.";
      case 403:
        return "Anda tidak memiliki izin untuk mengakses fitur ini.";
      case 404:
        return data?.message || "Data tidak ditemukan.";
      case 422:
        return data?.message || "Validasi gagal. Periksa kembali data yang Anda masukkan.";
      case 500:
        return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
      case 503:
        return "Layanan sedang tidak tersedia. Silakan coba lagi nanti.";
      default:
        return data?.message || `Terjadi kesalahan (${status}). Silakan coba lagi.`;
    }
  } else if (error.request) {
    // Request made but no response
    return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  } else {
    // Something else happened
    return error.message || "Terjadi kesalahan. Silakan coba lagi.";
  }
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

/**
 * Check if error is server error (5xx)
 */
export const isServerError = (error: any): boolean => {
  return error.response && error.response.status >= 500;
};

/**
 * Check if error is client error (4xx)
 */
export const isClientError = (error: any): boolean => {
  return error.response && error.response.status >= 400 && error.response.status < 500;
};

/**
 * Log error for debugging
 */
export const logError = (error: any, context?: string) => {
  if (import.meta.env.DEV) {
    console.group(`🔴 Error${context ? ` in ${context}` : ""}`);
    console.error("Error:", error);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
    console.groupEnd();
  }
};
