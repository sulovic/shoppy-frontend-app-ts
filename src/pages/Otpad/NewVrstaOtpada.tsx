import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

const NewVrstaOtpada: React.FC = () => {
  const [vrstaOtpada, setVrstaOtpada] = useState<any | null>(null);
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
      const response = await axiosPrivate.post(`otpad/vrste-otpada`, vrstaOtpada);
      toast.success(`Nova vrsta otpada ${response?.data?.vrstaOtpada} je uspešno dodata!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/otpad/vrste-otpada");
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    setVrstaOtpada({});
    setShowModal(false);
    setShowSpinner(false);
    navigate("/otpad/vrste-otpada");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVrstaOtpada((prev: any) => ({
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
                <input
                  type="text"
                  id="vrstaOtpada"
                  aria-describedby="Vrsta otpada"
                  value={vrstaOtpada?.vrstaOtpada}
                  onChange={handleChange}
                  maxLength={190}
                  required
                />
              </div>
              <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
              <div className="float-end mb-3 mt-3 flex gap-2">
                <button type="submit" className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky">
                  Dodaj
                </button>
              </div>
            </div>
          </form>
        </div>
        {showModal && (
          <Modal
            onOK={handleOK}
            onCancel={handleCancel}
            title="Potvrda dodavanja nove vrste otpada"
            question={`Da li ste sigurni da želite da dodate novu vrstu otpada: ${vrstaOtpada?.vrstaOtpada}?`}
          />
        )}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewVrstaOtpada;
