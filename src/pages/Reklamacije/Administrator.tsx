import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import ModalEdit from "./ModalEdit";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import HandleFiles from "../../components/HandleFiles";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../components/Pagination";
import { handleCustomErrors } from "../../services/errorHandler";
import reklamacijeServiceBuilder from "../../services/reklamacijaService";

const Administrator: React.FC = () => {
  const [tableData, setTableData] = useState<Reklamacija[]>([]);
  const [deleteData, setDeleteData] = useState<Reklamacija | null>(null);
  const [updateData, setUpdateData] = useState<Reklamacija | null>(null);
  const [processData, setProcessData] = useState<Reklamacija | null>(null);
  const [selectedRowFiles, setSelectedRowFiles] = useState<Reklamacija | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showRetrunModal, setShowRetrunModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const reklamacijeService = reklamacijeServiceBuilder(axiosPrivate, authUser);

  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { statusReklamacije: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "datumPrijema" });
  const filtersOptions: FiltersOptions = {
    zemljaReklamacije: ["SRBIJA", "CRNA_GORA"],
    statusReklamacije: ["PRIJEM", "OBRADA", "OPRAVDANA", "NEOPRAVDANA", "DODATNI_ROK"],
  };

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await reklamacijeService.getAllReklamacije(queryParams);
      const reklamacijeCount = await reklamacijeService.getAllReklamacijeCount(queryParams);
      setTableData(response.data.data);
      setQueryParams({ ...queryParams, count: reklamacijeCount.data.count });
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.filters, queryParams.search, queryParams.page, queryParams.limit, queryParams.sortOrder, queryParams.sortBy]);

  const handleResolve = (row: Reklamacija) => {
    setUpdateData(row);
    setShowEditModal(true);
  };

  const handleDelete = (row: Reklamacija) => {
    setDeleteData(row);
    setShowDeleteModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await reklamacijeService.deleteReklamacija(deleteData!);

      // Brisanje fajlova TODO
      // if (deleteData && deleteData.files && deleteData.files.length > 0) {
      //   await axiosPrivate.delete(`uploads/reklamacije`, {
      //     data: { files: JSON.parse(deleteData?.files) },
      //   });
      // }

      toast.success("Reklamacija je uspešno obrisana!", {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setDeleteData(null);
      setShowDeleteModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setShowSpinner(false);
    setDeleteData(null);
  };

  const handleReturn = (row: Reklamacija) => {
    setProcessData(row);
    setShowRetrunModal(true);
  };

  const handleReturnOK = async () => {
    setShowSpinner(true);
    const returnedReklamacija: Reklamacija = { ...processData!, statusReklamacije: "OBRADA" };

    try {
      await reklamacijeService.updateReklamacija(returnedReklamacija);
      await axiosPrivate.put(`reklamacije/${updatedProcessData?.broj_reklamacije}`, updatedProcessData);
      toast.success(`Reklamacija ${updatedProcessData?.broj_reklamacije} je uspešno vraćena u obradu!`, { position: toast.POSITION.TOP_CENTER });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowRetrunModal(false);
      setProcessData(null);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleRetrunCancel = () => {
    setProcessData(null);
    setShowRetrunModal(false);
    setShowSpinner(false);
  };

  const handleShowFiles = (row: any) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  return (
    <div className="mb-4">
      <h3 className="my-4">Administrator reklamacija</h3>
      {tableData.length ? (
        <div>
          {tableData.map((row, index) => (
            <div key={index} className="my-3 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
                <div>
                  <h5 key={`reklamacija_${index}`}>Podaci o reklamaciji:</h5>
                </div>
                <p key={`broj_reklamacije_${index}`} className="font-medium text-sky-500 hover:cursor-pointer hover:text-sky-400" onClick={() => handleResolve(row)}>
                  {row?.broj_reklamacije}
                </p>
                <p className={`text-center font-medium ${row?.status_reklamacije === "OPRAVDANA" ? `bg-green-300` : row?.status_reklamacije === "NEOPRAVDANA" ? `bg-red-300` : `bg-zinc-300`}`} key={`status_reklamacije_${index}`}>
                  {row?.status_reklamacije}
                </p>
                <p key={`zemlja_reklamacije_${index}`}>{row?.zemlja_reklamacije}</p>
                <div>
                  <h5 key={`kupac_${index}`}>Podaci o kupcu:</h5>
                </div>
                <p key={`ime_prezime_${index}`}>{row?.ime_prezime}</p>
                <p key={`telefon_${index}`}>{row?.telefon}</p>
                <p className="text-ellipsis	" key={`email_${index}`}>
                  {row?.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
                <div>
                  <h5 key={`proizvod_${index}`}>Podaci o kupovini:</h5>
                </div>
                <p key={`datum_kupovine_${index}`}>{row?.datum_kupovine && format(new Date(row?.datum_kupovine), "dd.MM.yyyy")}</p>
                <p key={`broj_racuna_${index}`}>{row?.broj_racuna}</p>
                <p key={`naziv_poizvoda_${index}`}>{row?.naziv_poizvoda}</p>
                <div>
                  <h5 key={`opis_${index}`}>Opis reklamacije:</h5>
                </div>
                <p key={`opis_reklamacije_${index}`} className="col-span-2 sm:col-span-3">
                  {row?.datum_prijema && format(new Date(row?.datum_prijema), "dd.MM.yyyy")} - {row?.opis_reklamacije}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
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
                  {row?.datum_odgovora && format(new Date(row?.datum_odgovora), "dd.MM.yyyy")} - {row?.opis_odluke}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                <div className="col-span-2 content-center sm:col-span-4">
                  <button key={`datoteke_list_${index}`} className="button button-sky" onClick={() => handleShowFiles(row)}>
                    Rad sa datotekama - prikačeno {row?.files ? JSON.parse(row?.files).length : "0"}
                  </button>
                </div>

                <div className="col-span-2 grid grid-cols-1 content-end items-end gap-2 sm:col-span-4 ">
                  <h5 className="sm:col-span-2">Akcije:</h5>
                  <div className="flex justify-end gap-2">
                    <button type="button" className="button button-sky" aria-label="Return" disabled={!authUser?.superAdmin} onClick={() => handleReturn(row)}>
                      Vrati
                    </button>

                    <button type="button" className="button button-red" aria-label="Delete" onClick={() => handleDelete(row)} disabled={!authUser?.superAdmin}>
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!showSpinner && <Pagination pagination={pagination} setPagination={setPagination} />}
        </div>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>
      )}
      {showDeleteModal && (
        <Modal onOK={handleDeleteOK} onCancel={handleDeleteCancel} title="Potvrda brisanja reklamacije" question={`Da li ste sigurni da želite da obrišete reklamaciju ${deleteData?.broj_reklamacije} - ${deleteData?.ime_prezime}?`} />
      )}

      {showRetrunModal && (
        <Modal
          onOK={handleReturnOK}
          onCancel={handleRetrunCancel}
          title="Vraćanje reklamacije u obradu"
          question={`Da li ste sigurni da želite da vratite u obradu reklamaciju ${processData?.broj_reklamacije} - ${processData?.ime_prezime}?`}
        />
      )}

      {updateData && showEditModal && <ModalEdit setShowEditModal={setShowEditModal} updateData={updateData} setUpdateData={setUpdateData} fetchData={fetchData} />}
      {showHandleFiles && <HandleFiles url="reklamacije" id={selectedRowFiles?.broj_reklamacije} data={selectedRowFiles} fetchData={fetchData} setShowHandleFiles={setShowHandleFiles} />}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default Administrator;
