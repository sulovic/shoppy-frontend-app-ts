import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import type { CodeResponse } from "@react-oauth/google";

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

const ApiGoogleLoginConnector = async (googleCode: CodeResponse) => {
  const response: { data: { accessToken: string } } = await apiClient.post("/login/google", googleCode);
  return response.data.accessToken;
};

const ApiLoginConnector = async (email: string, password: string) => {
  const response: { data: { accessToken: string } } = await apiClient.post("/login", { email, password });
  return response.data.accessToken;
};

const ApiLogoutConnector = async () => {
  const response = await apiClient.post("/logout");
  return response.data;
};

const ApiRefreshConnector = async () => {
  const response: { data: { accessToken: string } } = await apiClient.post("/refresh");
  return response.data.accessToken;
};

export { ApiLoginConnector, ApiRefreshConnector, ApiLogoutConnector, ApiGoogleLoginConnector };
