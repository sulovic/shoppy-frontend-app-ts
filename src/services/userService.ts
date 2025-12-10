import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../hooks/useAuth";

const axiosPrivate = useAxiosPrivate();
const { authUser } = useAuth();

const getAllUsers = async () => {
  const response: { data: UserData[] } = await axiosPrivate.get("/user");
  return response.data;
};

const getAllUsersCount = async () => {
  const response: { data: number } = await axiosPrivate.get("/user/count");
  return response.data;
};

const getUser = async (id: string) => {
  const response: { data: UserData } = await axiosPrivate.get(`/user/${id}`);
  return response.data;
};

const createUser = async (user: UserData) => {
  const response: { data: { message: string; data: UserData } } = await axiosPrivate.post("/user", user);
  return response.data;
};

const updateUser = async (user: UserData) => {
  const response: { data: { message: string; data: UserData } } = await axiosPrivate.put(`/user/${user.userId}`, user);
  return response.data;
};

const deleteUser = async (user: UserData) => {
  const response: { data: { message: string; data: UserData } } = await axiosPrivate.delete(`/user/${user.userId}`);
  return response.data;
};

export default { getAllUsers, getAllUsersCount, getUser, createUser, updateUser, deleteUser };
