import type { AxiosInstance } from "axios";
import priviledges from "../config/dataAccessPriviledges";

const createUploadService = (axiosPrivate: AxiosInstance, authUser: AuthUser | null) => {
  const uploadFiles = ({
    path,
    formData,
  }: {
    path: string;
    formData: FormData;
  }): Promise<{
    data: {
      message: string;
      files: {
        filename: string;
        size: number;
        mimetype: string;
      }[];
    };
  }> => {
    if (!authUser || authUser.roleId < priviledges.uploads.POST) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.post(`/uploads/${path}`, formData);
  };

  const deleteFiles = ({ path, files }: { path: string; files: string[] }): Promise<{ data: { message: string; deletedFiles: string[] } }> => {
    if (!authUser || authUser.roleId < priviledges.uploads.DELETE) {
      throw new Error("Unauthorized");
    }
    return axiosPrivate.delete(`/uploads/${path}`, { data: { files } });
  };

  return {
    uploadFiles,
    deleteFiles,
  };
};

export default createUploadService;
