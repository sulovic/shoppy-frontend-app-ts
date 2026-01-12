import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Spinner from "../Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";

const ModalEditProizvod = ({ row, setShowModalEdit, fetchData }: { row: JciProizvodi; setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>; fetchData: () => void }) => {
  const [updateData, setUpdateData] = useState(row);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [vrsteOtpada, setVrsteOtpada] = useState<VrstaOtpada[] | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const proizvodiService = dataServiceBuilder<JciProizvodi>(axiosPrivate, authUser, "otpad/proizvodi");
  const vrsteOtpadaService = dataServiceBuilder<VrstaOtpada>(axiosPrivate, authUser, "otpad/vrste-otpada");

  const fetchVrsteOtpada = async () => {
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
    fetchVrsteOtpada();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelModal = () => {
    setShowSaveModal(false);
    setShowSpinner(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const handleCancel = () => {
    setShowModalEdit(false);
    setShowSpinner(false);
  };

  const handleSaveOk = async () => {
    setShowSpinner(true);
    try {
      const response = await proizvodiService.updateResource(updateData.id, updateData);
      const updatedProizvod = response.data.data;
      toast.success(`Proizvod ${updatedProizvod.proizvod} je uspešno sačuvan!`, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSaveModal(true);
      setShowModalEdit(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeVrstaMasaOtpada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const masa = parseFloat(e.target.value);
    setUpdateData((prev) => ({
      ...prev,
      ProizvodMasaOtpada: prev.ProizvodMasaOtpada.map((item) => (item.VrstaOtpada.id === id ? { ...item, masa: Math.max(0, masa) } : item)),
    }));
  };

  return (
    <>
      {updateData && (
        <div className="relative z-10">
          <form onSubmit={(e) => handleSave(e)}>
            <div className="fixed inset-0 bg-gray-900/80 ">
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
                    <div className="w-full sm:mt-0">
                      <h4>Izmena proizvoda</h4>
                      <div className="my-4 h-0.5 bg-zinc-400"></div>
                      <div className="grid grid-cols-1">
                        <h4>Podaci o proizvodu</h4>
                        <div>
                          <div className="col-lg-12 mb-3">
                            <label htmlFor="proizvod">Proizvod</label>
                            <input value={updateData?.proizvod} type="text" id="proizvod" aria-describedby="Proizvod" required onChange={handleChangeName} />
                          </div>
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
                                value={updateData.ProizvodMasaOtpada.find((item) => item.VrstaOtpada.id === row.id)?.masa ?? ""}
                                onChange={handleChangeVrstaMasaOtpada}
                                maxLength={190}
                                required
                              />
                            </div>
                          ))}
                      </div>
                      <div className="my-4 h-0.5 bg-zinc-400"></div>
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                      <button type="submit" className="button button-sky" aria-describedby="Submit">
                        Sačuvaj
                      </button>
                      <button type="button" className="button button-gray" aria-describedby="Cancel" onClick={handleCancel}>
                        Odustani
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {showSpinner && <Spinner />}
          {showSaveModal && <Modal onOK={handleSaveOk} onCancel={handleCancelModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />}
        </div>
      )}
    </>
  );
};

export default ModalEditProizvod;
