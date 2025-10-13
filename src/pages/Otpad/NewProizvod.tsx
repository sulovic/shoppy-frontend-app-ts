import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

const NewProizvod: React.FC = () => {
  const [proizvod, setProizvod] = useState<any | null>(null);
  const [vrsteOtpada, setVrsteOtpada] = useState<any[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.get(`otpad/vrste-otpada`);
      setVrsteOtpada(response?.data);
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju vrsta otpada: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.post("otpad/proizvodi", proizvod);
      toast.success(`Nova vrsta proizvoda ${response?.data?.proizvod} je uspešno dodata!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/otpad/proizvodi");
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
    setProizvod(null);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/otpad/proizvodi");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProizvod((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeVrsta = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(e.target.value) >= 0) {
      setProizvod((prev: any) => ({
        ...prev,
        vrsteOtpada: {
          ...prev?.vrsteOtpada,
          [e.target.id]: parseFloat(e.target.value),
        },
      }));
    } else {
      e.target.value = "0";
    }
  };

  return (
    <>
      <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm lg:w-1/2 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Dodavanje nove vrste proizvoda</h3>
            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
            <h4 className="my-3">Podaci o vrsti proizvoda</h4>
            <div>
              <div className="mb-3">
                <label htmlFor="proizvod">Vrsta proizvoda</label>
                <input
                  type="text"
                  id="proizvod"
                  aria-describedby="Vrsta proizvoda"
                  value={proizvod?.proizvod}
                  onChange={handleChange}
                  maxLength={190}
                  required
                />
              </div>

              <h4 className="my-3">Parametrizacija otpada</h4>

              {vrsteOtpada &&
                vrsteOtpada.map((row: any, index: number) => (
                  <div key={`vrstaOtpada_${index}`}>
                    <label>{row?.vrstaOtpada}</label>
                    <input
                      type="number"
                      step="0.001"
                      id={row?.id}
                      aria-describedby="Kolicina"
                      value={proizvod?.vrstaOtpada?.id}
                      onChange={handleChangeVrsta}
                      maxLength={190}
                      required
                    />
                  </div>
                ))}

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
            title="Potvrda dodavanja nove vrste proizvoda"
            question={`Da li ste sigurni da želite da dodate novu vrstu proizvoda: ${proizvod?.proizvod}?`}
          />
        )}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewProizvod;
