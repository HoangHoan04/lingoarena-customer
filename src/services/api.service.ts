import axios from "axios";
import { resolveApiBaseUrl } from "@/lib/auth";
import { resolveClientLang } from "@/lib/locale-text";

export const getDeviceId = () => {
  if (typeof window === "undefined") return "server-client";
  let deviceId = localStorage.getItem("device_token_id");
  if (!deviceId) {
    deviceId = "dev_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("device_token_id", deviceId);
  }
  return deviceId;
};

const apiService = axios.create({
  baseURL: resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.headers) {
        config.headers["tokenid"] = getDeviceId();
        config.headers["x-lang"] = resolveClientLang();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Có lỗi xảy ra, vui lòng thử lại";
    return Promise.reject(new Error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg));
  },
);

export default apiService;
