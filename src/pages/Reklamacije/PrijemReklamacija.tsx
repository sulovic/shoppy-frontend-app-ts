import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import ModalEdit from "./ModalEdit";
import HandleFiles from "../../components/HandleFiles";
import { useNavigate } from "react-router-dom";
import reklamacijeServiceBuilder from "../../services/reklamacijeService";
import { handleCustomErrors } from "../../services/errorHandler";
import ReklamacijeTable from "../../components/ReklamacijeTable";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FiltersSearc from "../../components/FiltersSearch";

const PrijemReklamacija: React.FC = () => {
  const [tableData, setTableData] = useState<Reklamacija[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedRowFiles, setSelectedRowFiles] = useState<Reklamacija | null>(null);
  const [deleteData, setDeleteData] = useState<Reklamacija | null>(null);
  const [updateData, setUpdateData] = useState<Reklamacija | null>(null);
  const [forwardData, setForwardData] = useState<Reklamacija | null>(null);
  const { authUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const reklamacijeService = reklamacijeServiceBuilder(axiosPrivate, authUser);
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { statusReklamacije: "OPRAVDANA" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "datumPrijema" });
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

  const handleEdit = (row: Reklamacija) => {
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
    setDeleteData(null);
    setShowDeleteModal(false);
    setShowSpinner(false);
  };

  const handleForward = (row: Reklamacija) => {
    setForwardData(row);
    setShowForwardModal(true);
  };

  const handleForwardOK = async () => {
    setShowSpinner(true);
    const forwardReklamacija: Reklamacija = { ...forwardData!, statusReklamacije: "OBRADA" };

    try {
      await reklamacijeService.updateReklamacija(forwardReklamacija);

      toast.success("Reklamacija je uspešno zavedena i poslata na obradu!", {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setForwardData(null);
      setShowForwardModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleForwardCancel = () => {
    setForwardData(null);
    setShowForwardModal(false);
    setShowSpinner(false);
  };

  const handleShowFiles = (row: Reklamacija) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  return (
    <>
      <h3 className="mt-4 ">Reklamacije u prijemu</h3>
      <div className="mb-4 flex justify-end">
        <button type="button" className="button button-sky " aria-label="Nova Reklamacija" onClick={() => navigate("/reklamacije/nova-reklamacija")}>
          Nova reklamacija
        </button>
      </div>
      <FiltersSearc filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
      {tableData && tableData.length ? (
        <ReklamacijeTable tableData={tableData} handleEdit={handleEdit} handleDelete={handleDelete} handleShowFiles={handleShowFiles} handleForward={handleForward} />
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>
      )}
      {showDeleteModal && (
        <Modal onOK={handleDeleteOK} onCancel={handleDeleteCancel} title="Potvrda brisanja reklamacije" question={`Da li ste sigurni da želite da obrišete reklamaciju ${deleteData?.brojReklamacije} - ${deleteData?.imePrezime}?`} />
      )}
      {showForwardModal && (
        <Modal
          onOK={handleForwardOK}
          onCancel={handleForwardCancel}
          title="Potvrda prijema reklamacije"
          question={`Da li ste sigurni da želite da zavedete i prebacite u obradu reklamaciju ${forwardData?.brojReklamacije} - ${forwardData?.imePrezime}?`}
        />
      )}

      {updateData && showEditModal && <ModalEdit setShowEditModal={setShowEditModal} updateData={updateData} setUpdateData={setUpdateData} fetchData={fetchData} />}
      {showHandleFiles && <HandleFiles url="reklamacije" id={selectedRowFiles!.idReklamacije!} data={selectedRowFiles!} fetchData={fetchData} setShowHandleFiles={setShowHandleFiles} />}
      {showSpinner && <Spinner />}
    </>
  );
};

export default PrijemReklamacija;
