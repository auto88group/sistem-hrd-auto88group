// src/api/axios.ts
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // contoh: http://localhost:8000/api
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor (inject token)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ✅ Response Interceptor (handle global error)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // 🔒 Unauthorized → logout
    if (status === 401) {
      localStorage.removeItem("token");

      // optional redirect
      window.location.href = "/login";
    }

    // 🔥 NORMALIZE ERROR (INI KUNCINYA)
    const normalizedError = {
      status,
      message: data?.message || "Terjadi kesalahan",
      errors: data?.errors || null,
    };
    // bisa tambah handling lain:
    // 403 → forbidden
    // 500 → server error

    return Promise.reject(normalizedError);
  },
);

export default api;
