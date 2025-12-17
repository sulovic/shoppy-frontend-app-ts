import type { AxiosInstance } from "axios";
import priviledges from "../config/dataAccessPriviledges";
import createApiParams from "./createApiParams";

const createUserService = (axiosPrivate: AxiosInstance, authUser: AuthUser | null) => {
  const getAllUsers = (apiParams: QueryParams | null): Promise<{ data: { data: UserData[] } }> => {
    if (!authUser || authUser.roleId < priviledges.users.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/users${createApiParams(apiParams)}`);
  };

  const getAllUsersCount = (apiParams: QueryParams | null): Promise<{ data: { count: number } }> => {
    if (!authUser || authUser.roleId < priviledges.users.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/users/count${createApiParams(apiParams)}`);
  };

  const getUser = (id: string): Promise<{ data: { data: UserData } }> => {
    if (!authUser || authUser.roleId < priviledges.users.GET) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.get(`/users/${id}`);
  };

  const createUser = (user: UserData): Promise<{ data: { message: string; data: UserData } }> => {
    if (!authUser || authUser.roleId < priviledges.users.POST) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.post("/users", user);
  };

  const updateUser = (user: UserData): Promise<{ data: { message: string; data: UserData } }> => {
    if (!authUser || authUser.roleId < priviledges.users.PUT) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.put(`/users/${user.userId}`, user);
  };

  const deleteUser = (user: UserData): Promise<{ data: { message: string; data: UserData } }> => {
    if (!authUser || authUser.roleId < priviledges.users.DELETE) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.delete(`/users/${user.userId}`);
  };

  return {
    getAllUsers,
    getAllUsersCount,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default createUserService;
