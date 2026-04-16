import useAxiosClient from "./useAxiosClient";

const useMainApi = () => {
  return useAxiosClient({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  });
};

export default useMainApi;
