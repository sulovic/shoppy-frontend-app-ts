import type { AxiosInstance } from "axios";
import priviledges from "../config/dataAccessPriviledges";
import createApiParams from "./createApiParams";

const createDataService = <T>(axiosPrivate: AxiosInstance, authUser: AuthUser | null, service: "reklamacije" | "users") => {
  const getAllResources = (apiParams: QueryParams | null): Promise<{ data: { data: T[] } }> => {
    if (!authUser || authUser.roleId < priviledges[service].GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/${service}${createApiParams(apiParams)}`);
  };

  const getAllResourcesCount = (apiParams: QueryParams | null): Promise<{ data: { count: number } }> => {
    if (!authUser || authUser.roleId < priviledges[service].GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/${service}/count${createApiParams(apiParams)}`);
  };

  const getResource = (id: number): Promise<{ data: { data: T } }> => {
    if (!authUser || authUser.roleId < priviledges[service].GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/${service}/${id}`);
  };

  const createResource = (data: T): Promise<{ data: { message: string; data: T } }> => {
    if (!authUser || authUser.roleId < priviledges[service].POST) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.post(`/${service}`, data);
  };

  const updateResource = (id: number, data: T): Promise<{ data: { message: string; data: T } }> => {
    if (!authUser || authUser.roleId < priviledges[service].PUT) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.put(`/${service}/${id}`, data);
  };

  const deleteResource = (id: number): Promise<{ data: { message: string; data: T } }> => {
    if (!authUser || authUser.roleId < priviledges[service].DELETE) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.delete(`/${service}/${id}`);
  };

  return {
    getAllResources,
    getAllResourcesCount,
    getResource,
    createResource,
    updateResource,
    deleteResource,
  };
};

export default createDataService;
