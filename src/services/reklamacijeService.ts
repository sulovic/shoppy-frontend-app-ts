import type { AxiosInstance } from "axios";
import priviledges from "../config/priviledges";
import createApiParams from "./createApiParams";

const createReklamacijeService = (axiosPrivate: AxiosInstance, authUser: AuthUser | null) => {
  const getAllReklamacije = (apiParams: QueryParams | null): Promise<{ data: { data: Reklamacija[] } }> => {
    if (!authUser || authUser.roleId < priviledges.reklamacije.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/reklamacije${createApiParams(apiParams)}`);
  };

  const getAllReklamacijeCount = (apiParams: QueryParams | null): Promise<{ data: { count: number } }> => {
    if (!authUser || authUser.roleId < priviledges.reklamacije.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/reklamacije/count${createApiParams(apiParams)}`);
  };

  const getReklamacija = (id: string): Promise<{ data: { data: Reklamacija } }> => {
    if (!authUser || authUser.roleId < priviledges.reklamacije.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/reklamacije/${id}`);
  };

  const createReklamacija = (reklamacija: Reklamacija): Promise<{ data: { message: string; data: Reklamacija } }> => {
    if (!authUser || authUser.roleId < priviledges.reklamacije.POST) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.post("/reklamacije", reklamacija);
  };

  const updateReklamacija = (reklamacija: Reklamacija): Promise<{ data: { message: string; data: Reklamacija } }> => {
    if (!authUser || authUser.roleId < priviledges.reklamacije.PUT) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.put(`/reklamacije/${reklamacija.idReklamacije}`, reklamacija);
  };

  const deleteReklamacija = (reklamacija: Reklamacija): Promise<{ data: { message: string; data: Reklamacija } }> => {
    if (!authUser || authUser.roleId < priviledges.reklamacije.DELETE) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.delete(`/reklamacije/${reklamacija.idReklamacije}`);
  };

  return {
    getAllReklamacije,
    getAllReklamacijeCount,
    getReklamacija,
    createReklamacija,
    updateReklamacija,
    deleteReklamacija,
  };
};

export default createReklamacijeService;
