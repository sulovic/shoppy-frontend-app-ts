import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../hooks/useAuth";
import priviledges from "../config/priviledges";

const axiosPrivate = useAxiosPrivate();
const { authUser } = useAuth();

const getAllUsers = async () => {
  if (!authUser || authUser.roleId < priviledges.users.GET) {
    throw new Error("Unauthorized");
  }
  const response: { data: UserData[] } = await axiosPrivate.get("/users");
  return response.data;
};

const getAllUsersCount = async () => {
  if (!authUser || authUser.roleId < priviledges.users.GET) {
    throw new Error("Unauthorized");
  }
  const response: { data: number } = await axiosPrivate.get("/users/count");
  return response.data;
};

const getUser = async (id: string) => {
  if (!authUser || authUser.roleId < priviledges.users.GET) {
    throw new Error("Unauthorized");
  }
  const response: { data: UserData } = await axiosPrivate.get(`/users/${id}`);
  return response.data;
};

const createUser = async (user: UserData) => {
  if (!authUser || authUser.roleId < priviledges.users.POST) {
    throw new Error("Unauthorized");
  }
  const response: { data: { message: string; data: UserData } } = await axiosPrivate.post("/users", user);
  return response.data;
};

const updateUser = async (user: UserData) => {
  if (!authUser || authUser.roleId < priviledges.users.PUT) {
    throw new Error("Unauthorized");
  }
  const response: { data: { message: string; data: UserData } } = await axiosPrivate.put(`/users/${user.userId}`, user);
  return response.data;
};

const deleteUser = async (user: UserData) => {
  if (!authUser || authUser.roleId < priviledges.users.DELETE) {
    throw new Error("Unauthorized");
  }
  const response: { data: { message: string; data: UserData } } = await axiosPrivate.delete(`/users/${user.userId}`);
  return response.data;
};

export default { getAllUsers, getAllUsersCount, getUser, createUser, updateUser, deleteUser };
