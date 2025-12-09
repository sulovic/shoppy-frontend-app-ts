import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import type { CodeResponse } from "@react-oauth/google";
import { handleApiError } from "./errorHandler";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
});

// Response interceptor for centralized error handling

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    handleApiError(error);

    return Promise.reject(error);
  }
);

const ApiGoogleLoginConnector = async (googleCode: CodeResponse) => {
  const response: { data: { accessToken: string } } = await apiClient.post(`/auth/google`, { code: googleCode.code, redirect_uri: import.meta.env.VITE_APP_BASE_URL });
  return response.data.accessToken;
};

const ApiPasswordLoginConnector = async (email: string, password: string) => {
  const response: { data: { accessToken: string } } = await apiClient.post("/auth/login", { email, password });
  return response.data.accessToken;
};

const ApiLogoutConnector = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

const ApiRefreshConnector = async () => {
  const response: { data: { accessToken: string } } = await apiClient.post("/auth/refresh");
  return response.data.accessToken;
};

export { ApiPasswordLoginConnector, ApiRefreshConnector, ApiLogoutConnector, ApiGoogleLoginConnector };
