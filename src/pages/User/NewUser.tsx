import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import { USERROLES } from "../../config/appConfig";
import { UserDataSchema } from "../../schemas/schemas";

const NewUser = () => {
  const blankUser: Omit<UserData, "userId"> = {
    firstName: "",
    lastName: "",
    email: "",
    roleName: "BASE",
    roleId: 1001,
  };

  const [newUser, setNewUser] = useState<Omit<UserData, "userId">>(blankUser);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const userService = dataServiceBuilder<Omit<UserData, "userId">>(axiosPrivate, authUser, "users");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const parsedNewUser = UserDataSchema.omit({ userId: true }).parse(newUser);
      const response = await userService.createResource(parsedNewUser);
      const createdUser = response.data.data;

      toast.success(`Korisnik ${createdUser?.email} je uspešno dodat!`, { position: "top-center" });
      navigate("/users/dashboard");
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewUser(blankUser);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/users/dashboard");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewUser((prev) => {
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
    <>
      <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm md:w-1/2 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Dodavanje novog korisnika</h3>

            <h4 className="my-3">Podaci o korisniku</h4>

            <div>
              <div className="mb-3">
                <label htmlFor="firstName">Ime</label>
                <input type="text" id="firstName" aria-describedby="firstName" value={newUser.firstName} onChange={handleChange} minLength={5} maxLength={190} required />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName">Prezime</label>
                <input type="text" id="lastName" aria-describedby="lastName" value={newUser.lastName} onChange={handleChange} minLength={5} maxLength={190} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input type="email" autoComplete="email" id="email" aria-describedby="Email" value={newUser.email} onChange={handleChange} maxLength={64} minLength={5} required />
              </div>
              <div className="mb-3 ">
                <label htmlFor="roleId">Ovlašćenja korisnika</label>
                <select id="roleId" value={newUser.roleId} onChange={handleChange}>
                  {USERROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="float-end mb-3 mt-3 flex gap-2">
                <button className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky" disabled={showSpinner}>
                  {showSpinner ? "Dodavanje..." : "Dodaj"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {showModal && (
          <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda dodavanja novog korisnika" question={`Da li ste sigurni da želite da dodate novog korisnika ${newUser.firstName} ${newUser.lastName} - ${newUser.email}`} />
        )}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewUser;
