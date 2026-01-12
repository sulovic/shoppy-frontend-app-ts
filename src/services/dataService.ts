import type { AxiosInstance } from "axios";
import priviledges from "../config/dataAccessPriviledges";
import createApiParams from "./createApiParams";

const resolvePrivileges = (service: string) => {
  const keys = service.split("/");

  let current: unknown = priviledges;

  for (const key of keys) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      throw new Error(`Invalid service path: ${service}`);
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current as Record<string, number>;
};

const createDataService = <T>(
  axiosPrivate: AxiosInstance,
  authUser: AuthUser | null,
  service: "reklamacije" | "users" | "otpad/proizvodi" | "otpad/vrste-otpada" | "otpad/jci" | "otpad/delovodnik" | "nabavke/proizvodi" | "nabavke/porudzbine"
) => {
  const servicePriv = resolvePrivileges(service);

  const getAllResources = (apiParams: QueryParams | null): Promise<{ data: { data: T[] } }> => {
    if (!authUser || authUser.roleId < servicePriv.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/${service}${createApiParams(apiParams)}`);
  };

  const getAllResourcesCount = (apiParams: QueryParams | null): Promise<{ data: { count: number } }> => {
    if (!authUser || authUser.roleId < servicePriv.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/${service}/count${createApiParams(apiParams)}`);
  };

  const getResource = (id: number): Promise<{ data: { data: T } }> => {
    if (!authUser || authUser.roleId < servicePriv.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/${service}/${id}`);
  };

  const createResource = (data: T): Promise<{ data: { message: string; data: T } }> => {
    if (!authUser || authUser.roleId < servicePriv.POST) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.post(`/${service}`, data);
  };

  const updateResource = (id: number, data: T): Promise<{ data: { message: string; data: T } }> => {
    if (!authUser || authUser.roleId < servicePriv.PUT) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.put(`/${service}/${id}`, data);
  };

  const deleteResource = (id: number): Promise<{ data: { message: string; data: T } }> => {
    if (!authUser || authUser.roleId < servicePriv.DELETE) {
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
