import { useState } from "react";
import Modal from "../Modal";
import ModalEdit from "./ModalEditReklamacija";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import reklamacijeServiceBuilder from "../../services/dataService";
import uploadServiceBuilder from "../../services/uploadService";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { handleCustomErrors } from "../../services/errorHandler";
import { ReklamacijaSchema } from "../../schemas/schemas";

type ReklamacijaStatus = "PRIJEM" | "OBRADA" | "OPRAVDANA" | "NEOPRAVDANA" | "DODATNI_ROK";

type Action = {
  buttonText: string;
  newStatus: ReklamacijaStatus;
  modalTitle: string;
  modalMessage: string;
};

type ReklamacijeActionMatrix = {
  [currentStatus in ReklamacijaStatus]: {
    [actionName: string]: Action;
  };
};

const ReklamacijeActions = ({ row, fetchData }: { row: Reklamacija; fetchData: () => void }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [deleteData, setDeleteData] = useState<Reklamacija | null>(null);
  const [updateData, setUpdateData] = useState<Reklamacija | null>(null);
  const [forwardData, setForwardData] = useState<Reklamacija | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const reklamacijeService = reklamacijeServiceBuilder<Reklamacija>(axiosPrivate, authUser, "reklamacije");
  const reklamacijeFilesService = uploadServiceBuilder(axiosPrivate, authUser, "reklamacije");

  const reklamacijeActionMatrix: ReklamacijeActionMatrix = {
    PRIJEM: {
      Obrada: {
        buttonText: "Pošalji u obradu",
        newStatus: "OBRADA",
        modalTitle: "Pošalji reklamaciju na obradu",
        modalMessage: "Da li želite da prebacite reklamaciju na obradu?",
      },
    },

    OBRADA: {
      Prijem: {
        buttonText: "Vrati na prijem",
        newStatus: "PRIJEM",
        modalTitle: "Vrati reklamaciju na prijem",
        modalMessage: "Da li želite da vratite reklamaciju na prijem?",
      },
      Opravdana: {
        buttonText: "Opravdana",
        newStatus: "OPRAVDANA",
        modalTitle: "Zaključite reklamaciju kao opravdanu",
        modalMessage: "Da li želite da zaključite reklamaciju kao opravdanu?",
      },
      Neopravdana: {
        buttonText: "Neopravdana",
        newStatus: "NEOPRAVDANA",
        modalTitle: "Zaključite reklamaciju kao neopravdanu",
        modalMessage: "Da li želite da zaključite reklamaciju kao neopravdanu?",
      },
      DodatniRok: {
        buttonText: "Dodatni rok",
        newStatus: "DODATNI_ROK",
        modalTitle: "Dodatni rok za reklamaciju",
        modalMessage: "Da li želite da aktivirate dodatni rok za reklamaciju?",
      },
    },
    OPRAVDANA: {
      Obrada: {
        buttonText: "Vrati u obradu",
        newStatus: "OBRADA",
        modalTitle: "Vrati reklamaciju na obradu",
        modalMessage: "Da li želite da vratite reklamaciju u obradu?",
      },
    },
    NEOPRAVDANA: {
      Obrada: {
        buttonText: "Vrati u obradu",
        newStatus: "OBRADA",
        modalTitle: "Vrati reklamaciju na obradu",
        modalMessage: "Da li želite da vratite reklamaciju u obradu?",
      },
    },
    DODATNI_ROK: {
      Obrada: {
        buttonText: "Vrati u obradu",
        newStatus: "OBRADA",
        modalTitle: "Vrati reklamaciju na obradu",
        modalMessage: "Da li želite da vratite reklamaciju u obradu?",
      },
      Opravdana: {
        buttonText: "Opravdana",
        newStatus: "OPRAVDANA",
        modalTitle: "Zaključite reklamaciju kao opravdanu",
        modalMessage: "Da li želite da zaključite reklamaciju kao opravdanu?",
      },
      Neopravdana: {
        buttonText: "Neopravdana",
        newStatus: "NEOPRAVDANA",
        modalTitle: "Zaključite reklamaciju kao neopravdanu",
        modalMessage: "Da li želite da zaključite reklamaciju kao neopravdanu?",
      },
    },
  };

  const availableActions: { [key: string]: Action } = reklamacijeActionMatrix[row.statusReklamacije];

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
      if (!deleteData || !deleteData?.idReklamacije) {
        toast.warn("Reklamacija nije izabrana!", {
          position: "top-center",
        });
        return;
      }

      if (deleteData && deleteData.files && deleteData.files.length > 0) {
        reklamacijeFilesService.deleteFiles({ path: "reklamacije", files: deleteData.files });
      }
      const parsedReklamacija = ReklamacijaSchema.parse(deleteData);

      const response = await reklamacijeService.deleteResource(parsedReklamacija.idReklamacije);
      const deletedReklamacija = response.data.data;

      toast.success(`Reklamacija ${deletedReklamacija.imePrezime} - ${deletedReklamacija?.brojReklamacije} je uspešno obrisana!`, {
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

  const handleForward = ({ row, action }: { row: Reklamacija; action: Action }) => {
    setSelectedAction(action);
    setForwardData(row);
    setShowActionModal(true);
  };

  const handleActionOK = async () => {
    setShowSpinner(true);

    try {
      if (!forwardData || !forwardData?.idReklamacije || !selectedAction) {
        toast.warn("Reklamacija nije izabrana!", {
          position: "top-center",
        });
        return;
      }

      const forwardReklamacija: Reklamacija = { ...forwardData, statusReklamacije: selectedAction?.newStatus };

      const parsedReklamacija = ReklamacijaSchema.parse(forwardReklamacija);
      const response = await reklamacijeService.updateResource(parsedReklamacija.idReklamacije, parsedReklamacija);

      const updatedReklamacija = response.data.data;

      toast.success(`Reklamaciji ${updatedReklamacija.imePrezime} - ${updatedReklamacija?.brojReklamacije} je promenjen status u ${selectedAction?.newStatus} !`, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setForwardData(null);
      setShowActionModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleActionCancel = () => {
    setForwardData(null);
    setShowActionModal(false);
    setShowSpinner(false);
  };

  return (
    <>
      <div className=" grid grid-cols-1 col-span-2 gap-2 sm:col-span-4 sm:grid-cols-2">
        <h5 className="sm:col-span-2">Akcije:</h5>
        <div className="grid grid-cols-2 gap-2">
          {authUser?.superAdmin && (
            <button type="button" className="button button-red self-start" aria-label="Delete" onClick={() => handleDelete(row)}>
              Obriši
            </button>
          )}
          <button type="button" className="button button-sky self-start" aria-label="Forward" onClick={() => handleEdit(row)}>
            Izmeni
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(availableActions).map(([key, action]) => (
            <button key={key} type="button" className="button button-sky" aria-label="Forward" onClick={() => handleForward({ row, action })}>
              {action.buttonText}
            </button>
          ))}
        </div>
      </div>
      {showDeleteModal && (
        <Modal onOK={handleDeleteOK} onCancel={handleDeleteCancel} title="Potvrda brisanja reklamacije" question={`Da li ste sigurni da želite da obrišete reklamaciju ${deleteData?.brojReklamacije} - ${deleteData?.imePrezime}?`} />
      )}
      {showActionModal && selectedAction && (
        <Modal onOK={handleActionOK} onCancel={handleActionCancel} title={selectedAction.modalTitle} question={`${selectedAction.modalMessage} - Reklamacija: ${forwardData?.brojReklamacije} - ${forwardData?.imePrezime}?`} />
      )}

      {showEditModal && updateData && <ModalEdit setShowEditModal={setShowEditModal} row={updateData} fetchData={fetchData} />}

      {showSpinner && <Spinner />}
    </>
  );
};

export default ReklamacijeActions;
