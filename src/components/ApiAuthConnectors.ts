import type { GoogleCredentialResponse } from "@react-oauth/google";
import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
});

// Response interceptor for centralized error handling

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message ?? "Unexpected error occurred";

    if (status === 401) {
      toast.warning("UPS!!! Izgleda da niste autorizovani da posetite ovu lokaciju!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Redirect after toast
      setTimeout(() => {
        window.location.href = "/";
      }, 3500);
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    }

    return Promise.reject(error);
  }
);

const ApiLoginConnector = async (googleRepsonse: GoogleCredentialResponse) => {
  const response = await apiClient.post("/login", googleRepsonse);
  return response.data;
};

const ApiLogoutConnector = async () => {
  const response = await apiClient.post("/logout");
  return response.data;
};

const ApiRefreshConnector = async () => {
  const response = await apiClient.post("/refresh");
  return response.data;
};

export { ApiLoginConnector, ApiRefreshConnector, ApiLogoutConnector };
