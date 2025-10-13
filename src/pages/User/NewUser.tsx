import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import type { User } from "../../types/global";

const NewUser: React.FC = () => {
  const [newUser, setNewUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.post("users", newUser);
      toast.success(`Korisnik ${response?.data?.email} je uspešno dodat!`, { position: "top-center" });
      navigate("/users/dashboard");
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, { position: "top-center" });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewUser(null);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/users/dashboard");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  type UserKeys = keyof User;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const key = e.target.id as UserKeys;
    const value = key === "role_id" ? parseInt(e.target.value) : e.target.value;

    setNewUser((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <>
      <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm md:w-1/2 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Dodavanje novog korisnika</h3>

            <h4 className="my-3">Podaci o korisniku</h4>

            <div>
              <div className="mb-3">
                <label htmlFor="ime_prezime">Ime i prezime</label>
                <input type="text" id="ime_prezime" aria-describedby="Ime i prezime" value={newUser?.ime_prezime} onChange={handleChange} maxLength={190} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" aria-describedby="Email" value={newUser?.email} onChange={handleChange} maxLength={64} required />
              </div>
              <div className="mb-3 ">
                <label htmlFor="role_id">Ovlašćenja korisnika</label>
                <select id="role_id" aria-label="Odaberite ovlašćenja korisnika" required value={newUser?.role_id} onChange={handleChange}>
                  <option value={1001}>BASE</option>
                  <option value={3001}>POWER</option>
                  <option value={5001}>ADMIN</option>
                </select>
              </div>
              <div className="float-end mb-3 mt-3 flex gap-2">
                <button className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky">
                  Dodaj korisnika
                </button>
              </div>
            </div>
          </form>
        </div>

        {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda dodavanja novog korisnika" question={`Da li ste sigurni da želite da dodate novog korisnika ${newUser?.email}`} />}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewUser;
