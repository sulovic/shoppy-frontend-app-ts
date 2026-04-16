import useAxiosClient from "./useAxiosClient";

const useRacuniApi = () => {
  return useAxiosClient({
    baseURL: import.meta.env.VITE_APP_RACUNI_API_BASE_URL,
  });
};

export default useRacuniApi;
