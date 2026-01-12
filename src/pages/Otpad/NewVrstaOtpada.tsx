import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";
import { VrstaOtpadaSchema } from "../../schemas/schemas";

const NewVrstaOtpada: React.FC = () => {
  const newVrstaOtpada: Omit<VrstaOtpada, "id"> = {
    vrstaOtpada: "",
  };
  const [vrstaOtpada, setVrstaOtpada] = useState<Omit<VrstaOtpada, "id">>(newVrstaOtpada);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const vrsteOtpadaService = dataServiceBuilder<Omit<VrstaOtpada, "id">>(axiosPrivate, authUser, "otpad/vrste-otpada");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const parsedVrstaOtpada = VrstaOtpadaSchema.omit({ id: true }).parse(vrstaOtpada);
      const response = await vrsteOtpadaService.createResource(parsedVrstaOtpada);
      const newVrstaOtpada = response.data.data;
      toast.success(`Nova vrsta otpada ${newVrstaOtpada.vrstaOtpada} je uspešno dodata!`, {
        position: "top-center",
      });
      navigate("/otpad/vrste-otpada");
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = () => {
    setVrstaOtpada(newVrstaOtpada);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/otpad/vrste-otpada");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVrstaOtpada((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm lg:w-1/2 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Dodavanje nove vrste otpada</h3>
            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
            <h4 className="my-3">Podaci o vrsti otpada</h4>
            <div>
              <div className="mb-3">
                <label htmlFor="vrstaOtpada">Vrsta otpada</label>
                <input type="text" id="vrstaOtpada" aria-describedby="Vrsta otpada" value={vrstaOtpada?.vrstaOtpada} onChange={handleChange} maxLength={190} required />
              </div>
              <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
              <div className="float-end mb-3 mt-3 flex gap-2">
                <button type="button" className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky" disabled={showSpinner}>
                  {showSpinner ? "Dodavanje..." : "Dodaj"}
                </button>
              </div>
            </div>
          </form>
        </div>
        {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda dodavanja nove vrste otpada" question={`Da li ste sigurni da želite da dodate novu vrstu otpada: ${vrstaOtpada?.vrstaOtpada}?`} />}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewVrstaOtpada;
