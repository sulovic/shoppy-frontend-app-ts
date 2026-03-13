import { useEffect } from "react";
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../services/errorHandler";

const axiosPrivate = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

const useAxiosPrivate = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const headers: AxiosHeaders = config.headers;

      if (accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return config;
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error?.config as InternalAxiosRequestConfig & { sent?: boolean };

        if (error?.response?.status === 403 && prevRequest && !prevRequest.sent) {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const newAccessToken = await refreshAccessToken();

              isRefreshing = false;

              onRefreshed(newAccessToken);

              prevRequest.sent = true;
              prevRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

              return axiosPrivate(prevRequest);
            } catch (err) {
              isRefreshing = false;
              return Promise.reject(err);
            }
          }

          // drugi requestovi čekaju refresh
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              prevRequest.sent = true;
              prevRequest.headers.set("Authorization", `Bearer ${token}`);
              resolve(axiosPrivate(prevRequest));
            });
          });
        }

        handleApiError(error);
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshAccessToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
