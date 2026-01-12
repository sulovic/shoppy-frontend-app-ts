import { useState } from "react";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import { USERROLES } from "../../config/appConfig";

const ModalEditUser = ({
  setShowModalEditUser,
  selectedUser,
  setSelectedUser,
  fetchData,
}: {
  setShowModalEditUser: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: UserData;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  fetchData: () => void;
}) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const userService = dataServiceBuilder<UserData>(axiosPrivate, authUser, "users");

  const handleCancelModal = () => {
    setShowSaveModal(false);
    setShowSpinner(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const handleCancel = () => {
    setShowModalEditUser(false);
    setShowSpinner(false);
  };

  const handleSaveOk = async () => {
    setShowSpinner(true);
    try {
      const response = await userService.updateResource(selectedUser.userId, selectedUser);
      const updatedUser = response.data.data;
      toast.success(`Korisnik ${updatedUser?.firstName} ${updatedUser?.lastName} - ${updatedUser?.email} je uspešno sačuvan!`, { position: "top-center" });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSaveModal(false);
      setShowModalEditUser(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedUser((prev) => {
      if (!prev) return prev;

      if (id === "roleId") {
        const select = e.target as HTMLSelectElement;
        const roleName = select.options[select.selectedIndex].text;

        return {
          ...prev,
          roleId: Number(value),
          roleName: roleName,
        };
      }

      return {
        ...prev,
        [id]: value,
      };
    });
  };

  return (
    <div className="relative z-10">
      <form onSubmit={handleSave}>
        <div className="fixed inset-0 bg-gray-900/80 ">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
                <div className="w-full sm:mt-0">
                  <h4>Izmena korisnika</h4>
                  <div className="my-4 h-0.5 bg-zinc-400"></div>

                  <div className="grid grid-cols-1">
                    <h4>Podaci o korisniku</h4>

                    <div>
                      <div className="col-lg-12 mb-3">
                        <label htmlFor="firstName">Ime</label>
                        <input value={selectedUser?.firstName} type="text" id="firstName" aria-describedby="firstName" onChange={handleChange} maxLength={190} required />
                      </div>
                      <div className="col-lg-12 mb-3">
                        <label htmlFor="lastName">Prezime</label>
                        <input value={selectedUser?.lastName} type="text" id="lastName" aria-describedby="lastName" onChange={handleChange} maxLength={190} required />
                      </div>
                      <div className="col-lg-12 mb-3">
                        <label htmlFor="email">Email</label>
                        <input value={selectedUser?.email} type="email" id="email" aria-describedby="email" disabled />
                      </div>
                      <div className="col-lg-12 mb-3">
                        <label htmlFor="roleId">Nivo ovašćenja</label>
                        <select id="roleId" value={selectedUser.roleId} onChange={handleChange}>
                          {USERROLES.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="my-4 h-0.5 bg-zinc-400"></div>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" className="button button-gray" onClick={handleCancel}>
                    Odustani
                  </button>
                  <button type="submit" className="button button-sky" aria-describedby="Submit" disabled={showSpinner}>
                    {showSpinner ? "Čuvanje..." : "Sačuvaj"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showSpinner && <Spinner />}
        {showSaveModal && <Modal onOK={handleSaveOk} onCancel={handleCancelModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />}
      </form>
    </div>
  );
};

export default ModalEditUser;
