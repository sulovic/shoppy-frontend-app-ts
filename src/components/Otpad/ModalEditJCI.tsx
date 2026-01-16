import React, { useState } from "react";
import Modal from "../Modal";
import Spinner from "../Spinner";
import DatePicker from "react-datepicker";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { JciPodaciSchema } from "../../schemas/schemas";

const ModalEditJCI = ({ row, setShowModalEdit, fetchData }: { row: JciPodaci; setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>; fetchData: () => void }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [updateData, setUpdateData] = useState<JciPodaci>(row);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const jciService = dataServiceBuilder<JciPodaci>(axiosPrivate, authUser, "otpad/jci");

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
      const parsedJci = JciPodaciSchema.parse(updateData);
      const response = await jciService.updateResource(parsedJci.id, parsedJci);
      const updatedJci = response.data.data;
      toast.success(`JCI broj ${updatedJci.brojJci} je uspešno sačuvana!`, {
        position: "top-center",
      });
      setShowModalEdit(false);
      fetchData();
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSaveModal(true);
      setShowSpinner(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdateData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeProizvod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);

    const kolicina = Math.max(0, parseFloat(e.target.value));

    setUpdateData((prev) => ({
      ...prev,
      jciProizvodi: prev.jciProizvodi.map((item) => (item.proizvod.id === id ? { ...item, kolicina: kolicina } : item)),
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
                  <div className="relative max-w-6xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
                    <div className=" sm:mt-0">
                      {/* Modal Head */}

                      <h4>Izmena podataka na JCI</h4>
                      <div className="my-4 h-0.5 bg-zinc-400"></div>

                      {/* Modal Body */}

                      <div className="grid grid-cols-1">
                        <h4>Podaci o JCI</h4>

                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                          <div>
                            <label htmlFor="brojJci">Broj JCI</label>
                            <input value={updateData?.brojJci} type="text" id="brojJci" aria-describedby="Broj JCI" required onChange={handleChange} />
                          </div>

                          <div>
                            <label htmlFor="datum">Datum JCI</label>
                            <DatePicker
                              id="datum"
                              locale="sr-Latn"
                              aria-describedby="Datum JCI"
                              autoComplete="off"
                              selected={new Date(updateData?.datum)}
                              onChange={(date) => {
                                if (!date) return;
                                setUpdateData((prev) => ({
                                  ...prev,
                                  datum: date,
                                }));
                              }}
                              dateFormat="dd.MM.yyyy"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="zemlja">Zemlja</label>
                            <select id="zemlja" aria-label="Odaberi zemlju" required value={updateData?.zemlja} onChange={handleChange}>
                              <option value="">Odaberite zemlju</option>
                              <option value="SRBIJA">Srbija</option>
                              <option value="CRNA_GORA">Crna Gora</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="operacija">Operacija</label>
                            <select id="operacija" aria-label="Odaberi operaciju" required value={updateData?.operacija} onChange={handleChange}>
                              <option value="">Odaberite operaciju</option>
                              <option value="UVOZ">Uvoz</option>
                              <option value="IZVOZ">Izvoz</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <h4 className="my-3">Podaci o proizvodima</h4>

                          <div className="grid grid-cols-2 gap-4">
                            {updateData &&
                              updateData?.jciProizvodi.map((row) => (
                                <div key={row.proizvod.id}>
                                  <label>{row?.proizvod?.proizvod}</label>
                                  <input
                                    type="number"
                                    step="0.001"
                                    id={row?.proizvod.id.toString()}
                                    aria-describedby="Ime i prezime"
                                    value={updateData.jciProizvodi.find((x) => x.proizvod.id === row.proizvod.id)?.kolicina}
                                    onChange={handleChangeProizvod}
                                    required
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      <div className="my-4 h-0.5 bg-zinc-400"></div>
                    </div>
                    {/* Modal Buttons */}

                    <div className="flex justify-end gap-2">
                      <button type="button" className="button button-gray" aria-describedby="Cancel" onClick={handleCancel}>
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
      )}
    </>
  );
};

export default ModalEditJCI;
