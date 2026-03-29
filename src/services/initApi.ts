import { logOut } from "@/layout/lib/auth-event-emitter";
import axios from "axios";
import Cookies from "js-cookie";

const ERROR_DEBOUNCE_MS = 3000;
let lastErrorMessage = "";
let lastErrorTimestamp = 0;

const initApi = (url?: string, headers = {}) => {
  const languageKey = localStorage.getItem("language");
  if (url == null) throw new Error("URL is required");
  const api = axios.create({
    baseURL: url,
    timeout: 100000,
    headers: {
      "x-lang": languageKey,
      "Content-Type": "application/json",
      accept: "*/*",
      ...headers,
    },
  });

  api.interceptors.request.use(async (config) => {
    try {
      const token = Cookies.get("token") || null;

      const tokenId = localStorage.getItem("tokenId");
      config.headers.tokenId = tokenId || "";

      if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
    } catch (error) {
      console.log("AsyncStorage error:", error);
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response?.data,
    (error) => {
      let message = "";
      const statusCode =
        error?.response?.status || error?.response?.data?.statusCode;

      switch (statusCode) {
        case 401: {
          message = "Your login session has expired, please log in again!";
          Cookies.remove("user");
          Cookies.remove("token");
          logOut();
          break;
        }
        case 500: {
          message =
            error?.response?.data?.message ||
            "We are currently undergoing maintenance to upgrade our system. Please try again in a few minutes!";
          break;
        }
        default: {
          const errors = error?.response?.data?.errors;
          if (
            error.code === "ECONNABORTED" ||
            error.code === "ERR_NETWORK" ||
            (error.name === "HttpErrorResponse" &&
              error.statusText === "Unknown Error") ||
            !error.response
          ) {
            message =
              languageKey == "en"
                ? "Server is updating or disconnected, please try again later!"
                : "Server đang update hoặc mất kết nối, vui lòng thử lại sau!";
          } else if (errors && typeof errors === "object" && errors.message) {
            message = errors.message;
          } else {
            message = error?.response?.data?.message || "An error occurred";
          }
        }
      }

      const config: any = error?.config || {};
      const shouldShowToast =
        statusCode === 401 ? Boolean(config?.showToastOnError) : true;

      if (shouldShowToast && message) {
        const now = Date.now();
        const shouldRenderToast =
          message !== lastErrorMessage ||
          now - lastErrorTimestamp > ERROR_DEBOUNCE_MS;

        if (shouldRenderToast) {
          console.log("Show toast message:", message);
          lastErrorMessage = message;
          lastErrorTimestamp = now;
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};

export default initApi;
