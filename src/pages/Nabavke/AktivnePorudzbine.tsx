import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import ModalEditPorudzbina from "./ModalEditPorudzbina";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import HandleFiles from "../../components/HandleFiles";
import { useNavigate } from "react-router-dom";
import SadrzajPorudzbine from "./SadrzajPorudzbine";

const AktivnePorudzbine = () => {
  const [tableData, setTableData] = useState();
  const [selectedRowDelete, setSelectedRowDelete] = useState(null);
  const [selectedRowFiles, setSelectedRowFiles] = useState(null);
  const [selectedRowSadrzaj, setSelectedRowSadrzaj] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const [showSadrzaj, setShowSadrzaj] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.get(
        `nabavke/porudzbine?status=NACRT,PROIZVODNJA,TRANZIT&sortBy=id&sortOrder=desc`,
      );
      setTableData(response?.data);
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

  const handleEdit = (row) => {
    setUpdateData(row);
    setShowEditModal(true);
  };
  const handleDelete = (row) => {
    setSelectedRowDelete(row);
    setShowDeleteModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`nabavke/porudzbine/${selectedRowDelete?.id}`);

      if (selectedRowDelete?.files.length > 0) {
        await axiosPrivate.delete(`uploads/nabavke/porudzbine`, {
          data: { files: JSON.parse(selectedRowDelete?.files) },
        });
      }

      toast.success("Porudžebina je uspešno obrisana!", {
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

  const handleShowFiles = (row) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  const handleShowSadrzaj = (row) => {
    setSelectedRowSadrzaj(row);
    setShowSadrzaj(true);
  };

  return (
    <>
      <h3 className="my-4 ">Pregled aktivnih porudžebina</h3>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          className="button button-sky "
          aria-label="Nova porudžebina"
          onClick={() => navigate("/nabavke/nova-porudzbina")}>
          Nova porudžebina
        </button>
      </div>
      {tableData ? (
        <div>
          {tableData.map((row, index) => (
            <div key={index} className="my-3 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
              <div>
                <h5>Podaci o porudžebini:</h5>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                  <h5>Pro/Faktura:</h5>
                  <p key={`proFaktura_${index}`}>{row?.proFaktura}</p>
                  <h5>Dobavljač:</h5>
                  <p key={`dobavljac_${index}`}>{row?.dobavljac}</p>
                  <h5>Zemlja:</h5>
                  <p key={`zemlja_${index}`}>{row?.zemlja}</p>
                  <h5>Status:</h5>
                  <p key={`status_${index}`}>{row?.status}</p>
                </div>
              </div>

              <div className="mt-4">
                <h5>Podaci o kontejneru:</h5>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                  <h5>Broj kontejnera:</h5>
                  <p key={`brojKontejnera_${index}`}>{row?.brojKontejnera}</p>
                  <h5>Špediter:</h5>
                  <p key={`spediter_${index}`}>{row?.spediter}</p>
                  <h5>Datum porudžebine:</h5>
                  <p key={`datumPorudzbine_${index}`}>
                    {row?.datumPorudzbine && format(row?.datumPorudzbine, "dd.MM.yyyy")}
                  </p>
                  <h5>Datum polaska:</h5>
                  <p key={`datumPolaska_${index}`}>{row?.datumPolaska && format(row?.datumPolaska, "dd.MM.yyyy")}</p>
                  <h5>Datum prijema:</h5>
                  <p key={`datumPrijema_${index}`}>{row?.datumPrijema && format(row?.datumPrijema, "dd.MM.yyyy")}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                <h5>Komentar:</h5>
                <p className="xl:grid-span-7 md:col-span-3" key={`komentar_${index}`}>
                  {row?.komentar}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                <div className="content-center sm:col-span-2">
                  <button
                    key={`datoteke_list_${index}`}
                    className="button button-sky"
                    onClick={() => handleShowFiles(row)}>
                    Rad sa datotekama - prikačeno {row.files ? JSON.parse(row?.files).length : "0"}
                  </button>
                </div>
                <div className="content-center sm:col-span-2">
                  <button key={`sadrzaj_${index}`} className="button button-sky" onClick={() => handleShowSadrzaj(row)}>
                    Sadržaj kontejnera
                  </button>
                </div>

                <div className="col-span-2 grid grid-cols-1 content-end items-end gap-2 sm:col-span-4 sm:grid-cols-2">
                  <h5 className="sm:col-span-2">Akcije:</h5>
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <button
                      type="button"
                      className="button button-sky"
                      aria-label="Izmeni"
                      onClick={() => handleEdit(row)}>
                      Izmeni
                    </button>
                    <button
                      type="button"
                      className="button button-red"
                      aria-label="Obriši"
                      onClick={() => handleDelete(row)}>
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nemate aktivne porudžbine...</h4>
      )}
      {showHandleFiles && (
        <HandleFiles
          url="nabavke/porudzbine"
          id={selectedRowFiles?.id}
          data={selectedRowFiles}
          fetchData={fetchData}
          setShowHandleFiles={setShowHandleFiles}
        />
      )}
      {showSadrzaj && <SadrzajPorudzbine id={selectedRowSadrzaj?.id} setShowSadrzaj={setShowSadrzaj} />}
      {showSpinner && <Spinner />}
      {showDeleteModal && (
        <Modal
          onOK={handleDeleteOK}
          onCancel={handleDeleteCancel}
          title="Potvrda brisanja porudžebine"
          question={`Da li ste sigurni da želite da obrišete porudžebinu: ${selectedRowDelete?.proFaktura}?`}
        />
      )}

      {updateData && showEditModal && (
        <ModalEditPorudzbina
          setShowEditModal={setShowEditModal}
          updateData={updateData}
          setUpdateData={setUpdateData}
          fetchData={fetchData}
        />
      )}
    </>
  );
};

export default AktivnePorudzbine;
