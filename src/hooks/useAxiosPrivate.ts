// src/api/useAxiosPrivate.ts
import { useEffect } from "react";
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../services/errorHandler";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

const useAxiosPrivate = () => {
  const { accessToken, refreshAccessToken, handleLogoutOK } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (!config.headers) return config;

      if (accessToken && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;

        if (!originalRequest) return Promise.reject(error);

        const status = error.response?.status;

        if (status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (!refreshPromise) {
              refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null;
              });
            }

            const newToken = await refreshPromise;

            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            }

            return axiosPrivate(originalRequest);
          } catch (refreshError) {
            refreshPromise = null;

            handleLogoutOK();

            // avoid react-router dependency → hard redirect
            window.location.href = "/login";

            return Promise.reject(refreshError);
          }
        }

        handleApiError(error);
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshAccessToken, handleLogoutOK]);

  return axiosPrivate;
};

export default useAxiosPrivate;
