import React, { useState } from "react";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ModalEditUser: React.FC<any> = ({ setShowModalEditUser, updateData, setUpdateData, fetchData }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

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
      await axiosPrivate.put(`users/${updateData?.email}`, updateData);
      toast.success(`Korisnik ${updateData?.email} je uspešno sačuvan!`, { position: toast.POSITION.TOP_CENTER });
      navigate("/users/dashboard");
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowSaveModal(true);
      setShowModalEditUser(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdateData((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.id === "role_id" ? parseInt((e.target as HTMLSelectElement).value) : (e.target as HTMLInputElement).value,
      role: undefined,
    }));
  };

  return (
    <div className="relative z-10">
      <form onSubmit={(e) => handleSave(e)}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
              <div className="w-full sm:mt-0">
                <h4>Izmena korisnika</h4>
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                <div className="grid grid-cols-1">
                  <h4>Podaci o korisniku</h4>

                  <div>
                    <div className="col-lg-12 mb-3">
                      <label htmlFor="ime_prezime">Ime i prezime</label>
                      <input value={updateData?.ime_prezime} type="text" id="ime_prezime" aria-describedby="Ime i prezime" onChange={handleChange} maxLength={190} required />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label htmlFor="email">Email</label>
                      <input value={updateData?.email} type="email" id="email" aria-describedby="Email" disabled />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label htmlFor="role_id">Nivo ovašćenja</label>
                      <select id="role_id" aria-label="Odaberi novo ovlašćenja" required value={updateData?.role_id} onChange={handleChange}>
                        <option value={1001}>BASE</option>
                        <option value={3001}>POWER</option>
                        <option value={5001}>ADMIN</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="my-4 h-0.5 bg-zinc-400"></div>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <button type="submit" className="button button-sky">Sačuvaj</button>
                <button type="button" className="button button-gray" onClick={handleCancel}>Odustani</button>
              </div>
            </div>
          </div>
        </div>
        {showSpinner && <Spinner />}
        {showSaveModal && (<Modal onOK={handleSaveOk} onCancel={handleCancelModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />)}
      </form>
    </div>
  );
};

export default ModalEditUser;
