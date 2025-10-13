import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const useAxiosPrivateFiles = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    // Request interceptor to add Authorization header
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        config.headers = config.headers ?? {};
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        const prevRequest = error?.config as any | undefined;
        if (error?.response?.status === 403 && prevRequest && !prevRequest.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refreshAccessToken();
            prevRequest.headers = prevRequest.headers ?? {};
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
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
