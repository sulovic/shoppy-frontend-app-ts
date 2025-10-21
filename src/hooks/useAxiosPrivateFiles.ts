import { useEffect } from "react";
import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosError, AxiosHeaders } from "axios";
import { useAuth } from "../hooks/useAuth";

const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

const useAxiosPrivateFiles = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    // Request interceptor to add Authorization header

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const headers = config.headers ?? {};

        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error?.config as InternalAxiosRequestConfig & { sent?: boolean };
        if (error?.response?.status === 403 && prevRequest && !prevRequest.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refreshAccessToken();

            const headers: AxiosHeaders = prevRequest.headers;
            if (!headers.has("Authorization")) {
              headers.set("Authorization", `Bearer ${newAccessToken}`);
            }
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refreshAccessToken, accessToken]);

  return axiosPrivate;
};

export default useAxiosPrivateFiles;
