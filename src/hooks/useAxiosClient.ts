import { useEffect, useMemo } from "react";
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../services/errorHandler";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

type Config = {
  baseURL: string;
};

const useAxiosClient = ({ baseURL }: Config) => {
  const { accessToken, refreshAccessToken, handleLogoutOK } = useAuth();

  const instance = useMemo(() => {
    return axios.create({
      baseURL,
      withCredentials: true,
    });
  }, [baseURL]);

  useEffect(() => {
    const req = instance.interceptors.request.use((config) => {
      if (accessToken && config.headers && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    });

    const res = instance.interceptors.response.use(
      (r) => r,
      async (error: AxiosError) => {
        const original = error.config as RetryableRequest;
        if (!original) return Promise.reject(error);

        if (error.response?.status === 403 && !original._retry) {
          original._retry = true;

          try {
            if (!refreshPromise) {
              refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null;
              });
            }

            const token = await refreshPromise;

            if (original.headers) {
              original.headers["Authorization"] = `Bearer ${token}`;
            }

            return instance(original);
          } catch (e) {
            refreshPromise = null;
            handleLogoutOK();
            window.location.href = "/login";
            return Promise.reject(e);
          }
        }

        handleApiError(error);
        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.request.eject(req);
      instance.interceptors.response.eject(res);
    };
  }, [instance, accessToken, refreshAccessToken, handleLogoutOK]);

  return instance;
};

export default useAxiosClient;
