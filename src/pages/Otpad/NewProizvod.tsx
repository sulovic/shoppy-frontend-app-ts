import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";

const NewProizvod: React.FC = () => {
  const newProizvod: Omit<JciProizvodi, "id"> = {
    proizvod: "",
    ProizvodMasaOtpada: [],
  };
  const [proizvod, setProizvod] = useState<Omit<JciProizvodi, "id">>(newProizvod);
  const [vrsteOtpada, setVrsteOtpada] = useState<VrstaOtpada[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const vrsteOtpadaService = dataServiceBuilder<VrstaOtpada>(axiosPrivate, authUser, "otpad/vrste-otpada");
  const proizvodiService = dataServiceBuilder<Omit<JciProizvodi, "id">>(axiosPrivate, authUser, "otpad/proizvodi");

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await vrsteOtpadaService.getAllResources(null);
      setVrsteOtpada(response.data.data);
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Preinitialize ProizvodMasaOtpada with the fetched data and use that data later
  useEffect(() => {
    if (!vrsteOtpada) return;

    setProizvod((prev) => ({
      ...prev,
      ProizvodMasaOtpada: vrsteOtpada.map((v) => ({
        masa: 0,
        VrstaOtpada: {
          id: v.id,
          vrstaOtpada: v.vrstaOtpada,
        },
      })),
    }));
  }, [vrsteOtpada]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);
    try {
      if (!proizvod) return;
      const response = await proizvodiService.createResource(proizvod);
      const newProizvod = response.data.data;
      toast.success(`Nova vrsta proizvoda ${newProizvod.proizvod} je uspešno dodata!`, {
        position: "top-center",
      });
      navigate("/otpad/proizvodi");
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    setProizvod(newProizvod);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/otpad/proizvodi");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProizvod((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeVrstaMasaOtpada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const masa = parseFloat(e.target.value);
    setProizvod((prev) => ({
      ...prev,
      ProizvodMasaOtpada: prev.ProizvodMasaOtpada.map((item) => (item.VrstaOtpada.id === id ? { ...item, masa: Math.max(0, masa) } : item)),
    }));
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
                <input type="text" id="proizvod" placeholder="Usesite naziv proizvoda" aria-describedby="Vrsta proizvoda" value={proizvod?.proizvod} onChange={handleChangeName} maxLength={190} required />
              </div>

              <h4 className="my-3">Parametrizacija otpada</h4>

              {vrsteOtpada &&
                vrsteOtpada.map((row) => (
                  <div key={row.id}>
                    <label>{row?.vrstaOtpada}</label>
                    <input
                      type="number"
                      step="0.001"
                      id={row.id.toString()}
                      aria-describedby="Kolicina"
                      value={proizvod.ProizvodMasaOtpada.find((item) => item.VrstaOtpada.id === row.id)?.masa ?? ""}
                      onChange={handleChangeVrstaMasaOtpada}
                      maxLength={190}
                      required
                    />
                  </div>
                ))}

              <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

              <div className="float-end mb-3 mt-3 flex gap-2">
                <button type="button" className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky">
                  Dodaj
                </button>
              </div>
            </div>
          </form>
        </div>

        {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda dodavanja nove vrste proizvoda" question={`Da li ste sigurni da želite da dodate novu vrstu proizvoda: ${proizvod?.proizvod}?`} />}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewProizvod;
