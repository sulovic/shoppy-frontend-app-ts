import { useState } from "react";
import Modal from "./Modal";
import ModalEdit from "../pages/Reklamacije/ModalEdit";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import reklamacijeServiceBuilder from "../services/reklamacijaService";
import { useAuth } from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { handleCustomErrors } from "../services/errorHandler";

const ReklamacijeActions = ({ row, fetchData }: { row: Reklamacija; fetchData: () => void }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [deleteData, setDeleteData] = useState<Reklamacija | null>(null);
  const [updateData, setUpdateData] = useState<Reklamacija | null>(null);
  const [forwardData, setForwardData] = useState<Reklamacija | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const reklamacijeService = reklamacijeServiceBuilder(axiosPrivate, authUser);

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

      if (deleteData && deleteData.files && deleteData.files.length > 0) {
        await axiosPrivate.delete(`uploads/reklamacije`, {
          data: { files: JSON.parse(deleteData?.files) },
        });
      }

      toast.success("Reklamacija je uspešno obrisana!", {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(`Greška, ${error}`);
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
      handleCustomErrors(error as string);
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

  return (
    <>
      <div className=" grid grid-cols-1 col-span-2 content-end items-end gap-2 sm:col-span-4 sm:grid-cols-2">
        <h5 className="sm:col-span-2">Akcije:</h5>
        <div className="flex gap-2 ">
          {authUser?.superAdmin && (
            <button type="button" className="button button-red" aria-label="Delete" onClick={() => handleDelete(row)}>
              OBRIŠI
            </button>
          )}
          <button type="button" className="button button-sky" aria-label="Forward" onClick={() => handleEdit(row)}>
            IZMENI
          </button>
        </div>
        <div>
          <button type="button" className="button button-sky" aria-label="Forward" onClick={() => handleForward(row)}>
            VRATI
          </button>
        </div>
      </div>
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

      {showEditModal && updateData && <ModalEdit setShowEditModal={setShowEditModal} row={updateData} fetchData={fetchData} />}

      {showSpinner && <Spinner />}
    </>
  );
};

export default ReklamacijeActions;
