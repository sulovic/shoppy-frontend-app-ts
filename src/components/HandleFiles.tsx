import { useState, useRef } from "react";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAxiosPrivateFiles from "../hooks/useAxiosPrivateFiles";
import { allowedFileTypes } from "../config/Config";
import { allowedExtensions } from "../config/Config";
import { useAuth } from "../hooks/useAuth";

const HandleFiles = ({ url, id, data, setShowHandleFiles, fetchData }: { url: string; id: number; data: Reklamacija; setShowHandleFiles: React.Dispatch<React.SetStateAction<boolean>>; fetchData: () => void }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<Reklamacija>(data);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [formFiles, setFormFiles] = useState(new FormData());
  const [uploadFileNames, setUploadFileNames] = useState<string[]>([]);
  const fileInputRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const axiosPrivateFiles = useAxiosPrivateFiles();
  const { authUser } = useAuth();

  const handleFileClick = async (fileUrl: string) => {
    try {
      const response = await axiosPrivate.get(`uploads/${url}/${fileUrl}`, { responseType: "blob" });
      const blob = new Blob([response?.data], {
        type: response?.headers["content-type"] || "application/octet-stream",
      });
      const windowUrl = URL.createObjectURL(blob);

      const newWindow = window.open();

      if (!newWindow) {
        toast.error("Failed to open the new window.", { position: "top-center" });
        return;
      }

      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pregled dokumenta ${fileUrl}</title>
            <style>
                body { font-size: 48px; margin:0; display:flex; justify-content:center; align-items:center; height:100vh; }
                @media only screen and (max-width: 767px) { body { font-size: 8px; } }
                img { max-width: 100%; max-height: 100%; }
            </style>
        </head>
        <body>
          <a href="${windowUrl}" download="${fileUrl}">
            <img src="${windowUrl}" alt="${fileUrl}" style="max-width: 100%; max-height:100%">
          </a>
        </body>
        </html>
      `);
      newWindow.addEventListener("beforeunload", () => {
        // Clean up resources when the new window is about to be closed
        URL.revokeObjectURL(windowUrl);
      });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: "top-center" });
    }
  };

  const handleDelete = async (fileUrl: string) => {
    setFileUrl(fileUrl);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = async () => {
    setShowDeleteModal(false);
  };

  const handleDeleteOk = async () => {
    setShowSpinner(true);
    try {
      //new array with removed file
      const updatedFiles = editedData!.files!.filter((fileName) => fileName !== fileUrl);
      const updatedData = {
        ...editedData,
        files: updatedFiles,
      };

      //Update database with new object
      await axiosPrivate.put(`${url}/${id}`, updatedData);

      // Delete file
      await axiosPrivate.delete(`uploads/${url}`, { data: { files: [fileUrl] } });

      toast.success("Datoteka je uspešno obrisana!", {
        position: "top-center",
      });
      setEditedData(updatedData);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: "top-center",
      });
    } finally {
      fetchData();
      setShowSpinner(false);
      setShowDeleteModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSpinner(true);

    try {
      // Check files for duplicates

      const newFileNames = editedData?.files ?? [];

      for (const uploadFileName of uploadFileNames) {
        if (newFileNames.includes(uploadFileName)) {
          toast.warn(`Fajl ${uploadFileName} već postoji u fajlovima reklamacije i neće biti dodat`, {
            position: "top-center",
          });
        } else {
          newFileNames.push(uploadFileName);
        }
      }

      const updatedData = {
        ...editedData,
        files: newFileNames,
      };

      await axiosPrivateFiles.post(`uploads/${url}`, formFiles);

      await axiosPrivate.put(`${url}/${id}`, updatedData);

      if (fileInputRef.current) {
        fileInputRef.current = null;
      }
      toast.success(`Izmena je uspešno sačuvana !`, {
        position: "top-center",
      });
      setEditedData(updatedData);
      setFormFiles(new FormData());
    } catch (error: any) {
      if (error.response && error.response.status === 413) {
        toast.error(`Neki od fajlova prelazi ograničenje od 10MB `, {
          position: "top-center",
        });
      } else {
        toast.error(`UPS!!! Došlo je do greške: ${error} `, {
          position: "top-center",
        });
      }
    } finally {
      fetchData();
      setShowSpinner(false);
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const renamedFormFiles = new FormData();

    if (files && files.length > 0 && files.length <= 5) {
      const fileNames = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (allowedFileTypes.includes(file.type)) {
          // File type is allowed, proceed with appending to form data
          const fileName = id + "-" + file.name.replace(/[^a-zA-Z0-9-.]/g, "");
          fileNames.push(fileName);
          const renamedFile = new File([file], fileName, { type: file.type });
          renamedFormFiles.append(`files`, renamedFile);
        } else {
          // File type is not allowed, handle accordingly (e.g., show an error message)
          toast.error(`Nije dozvoljena ekstenzija datoteke: ${file?.type} `, {
            position: "top-center",
          });
        }
      }
      setFormFiles(renamedFormFiles);
      setUploadFileNames(fileNames);
    } else {
      toast.warn(`Možete dodati između 1 i 5 datoteka `, {
        position: "top-center",
      });
      e.target.value = "";
    }
  };

  const handleCancel = () => {
    setShowHandleFiles(false);
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
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
                        <button type="button" className="button button-sky" onClick={() => handleFileClick(fileUrl)}>
                          Pogledaj
                        </button>
                        <button type="button" className="button button-red" disabled={!authUser?.superAdmin} onClick={() => handleDelete(fileUrl)}>
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
                      <input required ref={fileInputRef} type="file" onChange={handleAddFiles} id="addFilesForm" multiple accept={allowedExtensions} />
                    </div>
                    <div className="mt-2 flex items-center justify-end">
                      <button type="submit" className="button button-sky ms-2">
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
  );
};

export default HandleFiles;
