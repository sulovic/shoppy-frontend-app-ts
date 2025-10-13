import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import ModalEdit from "./ModalEdit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import HandleFiles from "../../components/HandleFiles";
import { useNavigate } from "react-router-dom";

const PrijemReklamacija: React.FC = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedRowDelete, setSelectedRowDelete] = useState<any | null>(null);
  const [selectedRowFiles, setSelectedRowFiles] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [updateData, setUpdateData] = useState<any | null>(null);
  const [forwardData, setForwardData] = useState<any | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.get(
        `reklamacije?status_reklamacije=PRIJEM&sortBy=datum_prijema&sortOrder=asc`,
      );
      setTableData(response?.data?.data);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row: any) => {
    setUpdateData(row);
    setShowEditModal(true);
  };
  const handleDelete = (row: any) => {
    setSelectedRowDelete(row);
    setShowDeleteModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`reklamacije/${selectedRowDelete?.broj_reklamacije}`);

      if (selectedRowDelete?.files.length > 0) {
        await axiosPrivate.delete(`uploads/reklamacije`, {
          data: { files: JSON.parse(selectedRowDelete?.files) },
        });
      }

      toast.success("Reklamacija je uspešno obrisana!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowDeleteModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setShowSpinner(false);
  };

  const handleForward = (row: any) => {
    setForwardData(row);
    setShowForwardModal(true);
  };

  const handleForwardOK = async () => {
    setShowSpinner(true);
    const updatedForwardData = { ...forwardData, status_reklamacije: "OBRADA" };
    setForwardData(updatedForwardData);

    try {
      await axiosPrivate.put(`reklamacije/${updatedForwardData?.broj_reklamacije}`, updatedForwardData);

      toast.success("Reklamacija je uspešno zavedena i poslata na obradu!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowForwardModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleForwardCancel = () => {
    setShowForwardModal(false);
    setShowSpinner(false);
  };

  const handleShowFiles = (row: any) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  return (
    <>
      <h3 className="mt-4 ">Reklamacije u prijemu</h3>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          className="button button-sky "
          aria-label="Nova Reklamacija"
          onClick={() => navigate("/reklamacije/nova-reklamacija")}>
          Nova reklamacija
        </button>
      </div>
      {tableData?.length ? (
        <div>
          {tableData.map((row, index) => (
            <div key={index} className="my-3 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                <div>
                  <h5 key={`reklamacija_${index}`}>Podaci o reklamaciji:</h5>
                </div>

                <p
                  key={`broj_reklamacije_${index}`}
                  className="font-medium text-sky-500 hover:cursor-pointer hover:text-sky-400"
                  onClick={() => handleEdit(row)}>
                  {row?.broj_reklamacije}
                </p>
                <p key={`status_reklamacije_${index}`}>{row?.status_reklamacije}</p>
                <p key={`zemlja_reklamacije_${index}`}>{row?.zemlja_reklamacije}</p>
                <div>
                  <h5 key={`kupac_${index}`}>Podaci o kupcu:</h5>
                </div>
                <p key={`ime_prezime_${index}`}>{row?.ime_prezime}</p>
                <p key={`telefon_${index}`}>{row?.telefon}</p>
                <p key={`email_${index}`}>{row?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
                <div>
                  <h5 key={`proizvod_${index}`}>Podaci o kupovini:</h5>
                </div>
                <p key={`datum_kupovine_${index}`}>
                  {row?.datum_kupovine && format(row?.datum_kupovine, "dd.MM.yyyy")}
                </p>
                <p key={`broj_racuna_${index}`}>{row?.broj_racuna}</p>
                <p key={`naziv_poizvoda_${index}`}>{row?.naziv_poizvoda}</p>
                <div>
                  <h5 key={`opis_${index}`}>Opis reklamacije:</h5>
                </div>
                <p key={`opis_reklamacije_${index}`} className="col-span-2 sm:col-span-3">
                  {row?.datum_prijema && format(row?.datum_prijema, "dd.MM.yyyy")} - {row?.opis_reklamacije}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
                <div>
                  <h5 key={`komentar_${index}`}>Komentar:</h5>
                </div>
                <p key={`komentar_id_${index}`} className="col-span-2 sm:col-span-3">
                  {row?.komentar}
                </p>
                <div>
                  <h5 key={`odluka_${index}`}>Opis odluke:</h5>
                </div>
                <p key={`opis_odluke_${index}`} className="col-span-2 sm:col-span-3">
                  {row?.datum_odgovora && format(row?.datum_odgovora, "dd.MM.yyyy")} - {row?.opis_odluke}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                <div className="col-span-2 content-center sm:col-span-4">
                  <button
                    key={`datoteke_list_${index}`}
                    className="button button-sky"
                    onClick={() => handleShowFiles(row)}>
                    Rad sa datotekama - prikačeno {row.files ? JSON.parse(row?.files).length : "0"}
                  </button>
                </div>

                <div className="col-span-2 grid grid-cols-1 content-end items-end gap-2 sm:col-span-4 sm:grid-cols-2">
                  <h5 className="sm:col-span-2">Akcije:</h5>
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <button
                      type="button"
                      className="button button-red"
                      aria-label="Delete"
                      onClick={() => handleDelete(row)}>
                      Obriši
                    </button>
                    <button
                      type="button"
                      className="button button-sky"
                      aria-label="Forward"
                      onClick={() => handleForward(row)}>
                      Zavedi i prebaci u obradu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>
      )}
      {showDeleteModal && (
        <Modal
          onOK={handleDeleteOK}
          onCancel={handleDeleteCancel}
          title="Potvrda brisanja reklamacije"
          question={`Da li ste sigurni da želite da obrišete reklamaciju ${selectedRowDelete?.broj_reklamacije} - ${selectedRowDelete?.ime_prezime}?`}
        />
      )}
      {showForwardModal && (
        <Modal
          onOK={handleForwardOK}
          onCancel={handleForwardCancel}
          title="Potvrda prijema reklamacije"
          question={`Da li ste sigurni da želite da zavedete i prebacite u obradu reklamaciju ${forwardData?.broj_reklamacije} - ${forwardData?.ime_prezime}?`}
        />
      )}

      {updateData && showEditModal && (
        <ModalEdit
          setShowEditModal={setShowEditModal}
          updateData={updateData}
          setUpdateData={setUpdateData}
          fetchData={fetchData}
        />
      )}
      {showHandleFiles && (
        <HandleFiles
          url="reklamacije"
          id={selectedRowFiles?.broj_reklamacije}
          data={selectedRowFiles}
          fetchData={fetchData}
          setShowHandleFiles={setShowHandleFiles}
        />
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default PrijemReklamacija;
