import { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../Modal";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";
import { PorudzbinaSchema } from "../../schemas/schemas";

const ModalEditPorudzbina = ({ row, setShowEditModal, fetchData }: { row: Porudzbina; setShowEditModal: (value: boolean) => void; fetchData: () => void }) => {
  const [updateData, setUpdateData] = useState(row);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const porudzbineService = dataServiceBuilder<Porudzbina>(axiosPrivate, authUser, "nabavke/porudzbine");

  console.log(updateData);

  const handleCancel = () => {
    setShowEditModal(false);
    setShowSpinner(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const handleCancelSaveModal = () => {
    setShowSaveModal(false);
    setShowSpinner(false);
  };

  const handleConfirmedSaveModal = async () => {
    setShowSpinner(true);
    try {
      const parsedEditPorudzbina = PorudzbinaSchema.parse(updateData);
      const response = await porudzbineService.updateResource(parsedEditPorudzbina.id, parsedEditPorudzbina);
      const savedEditedPorudzbina = response.data.data;
      toast.success(`Porudžebina ${savedEditedPorudzbina.proFaktura} je uspešno sačuvana!`, {
        position: "top-center",
      });
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSaveModal(false);
      setShowSpinner(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setUpdateData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="relative z-10">
      <form onSubmit={(e) => handleSave(e)}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
              <div className="w-full sm:mt-0">
                {/* Modal Head */}

                <h3>Izmena porudžbine</h3>
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                {/* Modal Body */}

                <div className="grid grid-cols-1">
                  {/* Podaci o reklamaciji */}
                  <div>
                    <h4>Podaci o porudžbini</h4>
                    <div className=" grid gap-4 md:grid-cols-2 ">
                      <div>
                        <label htmlFor="proFaktura">Broj Profakture/Fakture</label>
                        <input type="text" id="proFaktura" aria-describedby="Broj Profakture/Fakture" value={updateData?.proFaktura} onChange={handleChange} maxLength={64} required />
                      </div>
                      <div>
                        <label htmlFor="dobavljac">Dobavljač</label>
                        <input type="text" id="dobavljac" aria-describedby="Dobavljač" value={updateData?.dobavljac} onChange={handleChange} maxLength={64} required />
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
                        <label htmlFor="status">Status</label>
                        <select id="status" aria-label="Odaberi status" required value={updateData?.status} onChange={handleChange}>
                          <option value="">Odaberite status</option>
                          <option value="NACRT">NACRT</option>
                          <option value="PROIZVODNJA">PROIZVODNJA</option>
                          <option value="TRANZIT">TRANZIT</option>
                          <option value="PRIMLJENA">PRIMLJENA</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Podaci o kontejneru */}
                  <div className="mt-4">
                    <h4>Podaci o kontejneru</h4>
                    <div className=" grid gap-4 md:grid-cols-2 ">
                      <div>
                        <label htmlFor="brojKontejnera">Broj kontejnera</label>
                        <input type="text" id="brojKontejnera" aria-describedby="Broj kontejnera" value={updateData?.brojKontejnera || ""} onChange={handleChange} maxLength={64} />
                      </div>
                      <div>
                        <label htmlFor="spediter">Špediter</label>
                        <input
                          type="text"
                          id="spediter"
                          aria-describedby="Špediter"
                          value={updateData?.spediter || ""}
                          onChange={handleChange}
                          maxLength={64}
                          required={updateData.status === "TRANZIT" || updateData.status === "PRIMLJENA"}
                        />
                      </div>
                      <div>
                        <label htmlFor="datumPorudzbine">Datum porudžbine</label>
                        <div>
                          <DatePicker
                            id="datumPorudzbine"
                            locale="sr-Latn"
                            aria-describedby="Datum porudžbine"
                            autoComplete="off"
                            selected={updateData?.datumPorudzbine && new Date(updateData?.datumPorudzbine)}
                            onChange={(date) =>
                              date &&
                              setUpdateData((prev) => ({
                                ...prev,
                                datumPorudzbine: date,
                              }))
                            }
                            dateFormat="dd.MM.yyyy"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="datumPolaska">Datum polaska</label>
                        <div>
                          <DatePicker
                            id="datumPolaska"
                            locale="sr-Latn"
                            aria-describedby="Datum polaska"
                            autoComplete="off"
                            selected={updateData?.datumPolaska && new Date(updateData?.datumPolaska)}
                            onChange={(date) =>
                              date &&
                              setUpdateData((prev) => ({
                                ...prev,
                                datumPolaska: date,
                              }))
                            }
                            dateFormat="dd.MM.yyyy"
                            required={updateData.status === "TRANZIT" || updateData.status === "PRIMLJENA"}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="datumPrijema">Datum prijema</label>
                        <div>
                          <DatePicker
                            id="datumPrijema"
                            locale="sr-Latn"
                            aria-describedby="Datum prijema"
                            autoComplete="off"
                            selected={updateData?.datumPrijema && new Date(updateData?.datumPrijema)}
                            onChange={(date) =>
                              date &&
                              setUpdateData((prev) => ({
                                ...prev,
                                datumPrijema: date,
                              }))
                            }
                            dateFormat="dd.MM.yyyy"
                            required={updateData.status === "PRIMLJENA"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Komentar */}
                  <div className="mt-4">
                    <h4>Komentar</h4>

                    <div>
                      <label htmlFor="komentar">Komentar</label>
                      <textarea id="komentar" aria-describedby="Komentar" value={updateData?.komentar || ""} onChange={handleChange} maxLength={512} required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}

              <div className="flex flex-row-reverse gap-2">
                <button type="submit" className="button button-sky ms-2">
                  Sačuvaj
                </button>
                <button type="button" className="button button-gray" onClick={handleCancel}>
                  Odustani
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showSpinner && <Spinner />}

      {showSaveModal && <Modal onOK={handleConfirmedSaveModal} onCancel={handleCancelSaveModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />}
    </div>
  );
};

export default ModalEditPorudzbina;
