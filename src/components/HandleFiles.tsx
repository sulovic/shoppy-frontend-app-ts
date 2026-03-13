import { useState, useRef } from "react";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { allowedFileTypes } from "../config/appConfig";
import { allowedExtensions } from "../config/appConfig";
import { useAuth } from "../hooks/useAuth";
import uploadServiceBuilder from "../services/uploadService";
import createDataService from "../services/dataService";
import { handleCustomErrors } from "../services/errorHandler";
import OpenFileButton from "./OpenFileButton";

const HandleFiles = <T extends { files?: string[] | null | undefined }>({
  url,
  id,
  dataWithFiles,
  setShowHandleFiles,
  fetchData,
}: {
  url: "users" | "reklamacije" | "nabavke/porudzbine";
  id: number;
  dataWithFiles: T;
  setShowHandleFiles: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: () => void;
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<T>(dataWithFiles);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const uploadService = uploadServiceBuilder(axiosPrivate, authUser, url);
  const deleteService = uploadServiceBuilder(axiosPrivate, authUser, url);
  const dataService = createDataService<T>(axiosPrivate, authUser, url);

  const handleDelete = (fileUrl: string) => {
    setFileUrl(fileUrl);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteOk = async () => {
    setShowSpinner(true);
    try {
      if (!fileUrl) return;
      //new array with removed file
      const updatedFiles = (editedData.files ?? []).filter((fileName) => fileName !== fileUrl);
      const updatedData = { ...editedData, files: updatedFiles };
      //Update database with new object
      const uploadedData = await dataService.updateResource(id, updatedData);
      setEditedData(uploadedData.data.data);

      // Delete file
      await deleteService.deleteFiles({ path: url, files: [fileUrl] });

      toast.success("Datoteka je uspešno obrisana!", {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      fetchData();
      setShowSpinner(false);
      setShowDeleteModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      setShowSpinner(true);
      await uploadService.uploadFiles({ formData }); // now it has real File objects
      // update your resource after upload
      const updatedFiles = [...(editedData.files ?? []), ...selectedFiles.map((f) => f.name)];
      const updatedData = { ...editedData, files: updatedFiles };
      const uploadedData = await dataService.updateResource(id, updatedData);

      setEditedData(uploadedData.data.data);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Datoteke su uspešno poslate!", {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      fetchData();
      setShowSpinner(false);
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (Object.values(allowedFileTypes).includes(file.type)) {
        const fileName = id + "-" + file.name.replace(/[^a-zA-Z0-9-.]/g, "");
        validFiles.push(new File([file], fileName, { type: file.type }));
      } else {
        toast.error(`Nije dozvoljena ekstenzija datoteke: ${file.type}`, {
          position: "top-center",
        });
      }
    }

    if (selectedFiles.length + validFiles.length > 5) {
      toast.warn("Možete dodati maksimum 5 datoteka", {
        position: "top-center",
      });
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleCancel = () => {
    setShowHandleFiles(false);
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-900/90 ">
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
              <div className="w-full sm:mt-0">
                {/* Modal Head */}

                <h3>Pregled datoteka</h3>
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                {/* Modal Body */}

                <div className="grid grid-cols-1">
                  <h4>Prikačene datoteke: </h4>

                  <div>
                    {editedData?.files && editedData.files.length > 0 ? (
                      editedData?.files.map((fileUrl, index) => (
                        <div key={`fileUrl_${index}`} className="my-4 flex items-center gap-4">
                          <p className="grow">{fileUrl}</p>
                          <OpenFileButton filePath={`${url}/${fileUrl}`} buttonText="Otvori" />
                          <button type="button" className="button button-red" disabled={authUser!.roleId < 5000} onClick={() => handleDelete(fileUrl)}>
                            Obriši
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>Nema prikačenih datoteka...</p>
                    )}
                  </div>
                </div>

                <h4>Dodaj nove datoteke: </h4>

                <div>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <div>
                        <input ref={fileInputRef} type="file" disabled={showSpinner} onChange={handleAddFiles} id="addFilesForm" multiple accept={allowedExtensions} />
                      </div>
                      <div className="mt-2 flex items-center justify-end">
                        <button type="submit" disabled={selectedFiles.length === 0 || showSpinner} className="button button-sky ms-2">
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Modal Buttons */}
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                <div className="flex flex-row-reverse gap-2">
                  <button type="button" className="button button-gray" onClick={handleCancel}>
                    Zatvori
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDeleteModal && <Modal onOK={handleDeleteOk} onCancel={handleDeleteCancel} title="Potvrda brisanja datoteke" question={`Da li ste sigurni da želite da obrišete datoteku ${fileUrl}?`} />}
        {showSpinner && <Spinner />}
      </div>
    </div>
  );
};

export default HandleFiles;
