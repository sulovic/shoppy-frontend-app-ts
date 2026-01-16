import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../Modal";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import reklamacijeServiceBuilder from "../../services/dataService";
import { ReklamacijaSchema } from "../../schemas/schemas";

const ModalEdit = ({ row, setShowEditModal, fetchData }: { row: Reklamacija; setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>; fetchData: () => void }) => {
  const [updateData, setUpdateData] = useState<Reklamacija>(row);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const reklamacijeService = reklamacijeServiceBuilder<Reklamacija>(axiosPrivate, authUser, "reklamacije");

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
      const parsedReklamacija = ReklamacijaSchema.parse(updateData);
      const response = await reklamacijeService.updateResource(parsedReklamacija.idReklamacije, parsedReklamacija);
      const updatedReklamacija = response.data.data;
      toast.success(`Reklamacija  ${updatedReklamacija?.imePrezime} - ${updatedReklamacija?.brojReklamacije} je uspešno sačuvana!`, {
        position: "top-center",
      });
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSaveModal(true);
      setShowSpinner(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    // normalize phone number
    if (id === "telefon") {
      const cleaned = value.replace(/[^\d+\s\-()/]/g, "");
      setUpdateData((prev) => ({ ...prev, telefon: cleaned }));
      return;
    }

    // normalize empty string to null
    if (id === "email") {
      setUpdateData((prev) => ({
        ...prev,
        email: value === "" ? null : value,
      }));
      return;
    }

    setUpdateData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="relative z-10">
      <form onSubmit={(e) => handleSave(e)}>
        <div className="fixed inset-0 bg-gray-900/80 ">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
                <div className="w-full sm:mt-0">
                  <h3>Izmena reklamacije</h3>
                  <div className="my-4 h-0.5 bg-zinc-400"></div>

                  <div className="grid grid-cols-1">
                    <h4>Podaci o reklamaciji</h4>

                    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                      <div>
                        <label htmlFor="broj_reklamacije">Broj reklamacije</label>
                        <input value={updateData?.brojReklamacije} type="text" id="broj_reklamacije" aria-describedby=" Broj reklamacije" disabled />
                      </div>
                      <div>
                        <label htmlFor="datumPrijema">Datum prijema</label>
                        <div>
                          <DatePicker
                            id="datumPrijema"
                            locale="sr-Latn"
                            autoComplete="off"
                            selected={updateData.datumPrijema || null}
                            onChange={(date: Date | null) =>
                              setUpdateData((prev) => ({
                                ...prev,
                                datumPrijema: date,
                              }))
                            }
                            dateFormat="dd-MM-yyyy"
                            required
                            disabled={updateData?.statusReklamacije !== "PRIJEM"}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="zemljaReklamacije">Zemlja reklamacije</label>
                        <select id="zemljaReklamacije" aria-label="Odaberi zemlju" required value={updateData?.zemljaReklamacije} onChange={handleChange} disabled={updateData?.statusReklamacije !== "PRIJEM"}>
                          <option value="">Odaberite zemlju</option>
                          <option value="SRBIJA">Srbija</option>
                          <option value="CRNAGORA">Crna Gora</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="statusReklamacije">Status reklamacije</label>
                        <input value={updateData?.statusReklamacije} type="text" id="statusReklamacije" aria-describedby="statusReklamacije" disabled />
                      </div>
                    </div>

                    <h4>Podaci o podnosiocu</h4>

                    <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                      <div>
                        <label htmlFor="imePrezime">Ime i prezime</label>
                        <input type="text" id="imePrezime" aria-describedby="Ime i prezime" value={updateData?.imePrezime} onChange={handleChange} maxLength={190} required disabled={updateData?.statusReklamacije !== "PRIJEM"} />
                      </div>
                      <div>
                        <label htmlFor="adresa">Adresa</label>
                        <input type="text" id="adresa" aria-describedby="Adresa" value={updateData?.adresa || ""} onChange={handleChange} maxLength={190} disabled={updateData?.statusReklamacije !== "PRIJEM"} />
                      </div>
                      <div>
                        <label htmlFor="telefon">Telefon</label>
                        <input type="text" id="telefon" aria-describedby="Telefon" value={updateData?.telefon} onChange={handleChange} maxLength={190} required disabled={updateData?.statusReklamacije !== "PRIJEM"} />
                      </div>
                      <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" autoComplete="on" aria-describedby="Email" value={updateData?.email || ""} onChange={handleChange} maxLength={190} disabled={updateData?.statusReklamacije !== "PRIJEM"} />
                      </div>
                    </div>

                    <h4>Opis o reklamacije</h4>

                    <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                      <div>
                        <label htmlFor="datumKupovine">Datum kupovine</label>
                        <div>
                          <DatePicker
                            id="datumKupovine"
                            locale="sr-Latn"
                            autoComplete="off"
                            selected={updateData.datumKupovine || null}
                            onChange={(date: Date | null) =>
                              setUpdateData((prev) => ({
                                ...prev,
                                datumKupovine: date,
                              }))
                            }
                            dateFormat="dd-MM-yyyy"
                            required
                            disabled={updateData?.statusReklamacije !== "PRIJEM"}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="brojRacuna">Broj računa</label>
                        <input type="text" id="brojRacuna" aria-describedby="Broj računa" value={updateData?.brojRacuna || ""} onChange={handleChange} maxLength={190} required disabled={updateData?.statusReklamacije !== "PRIJEM"} />
                      </div>
                      <div>
                        <label htmlFor="nazivProizvoda">Naziv proizvoda</label>
                        <input
                          type="text"
                          id="nazivProizvoda"
                          aria-describedby="Naziv proizvoda"
                          value={updateData?.nazivProizvoda || ""}
                          onChange={handleChange}
                          maxLength={190}
                          required
                          disabled={updateData?.statusReklamacije !== "PRIJEM"}
                        />
                      </div>
                    </div>

                    <div className="mb-2 grid grid-cols-1 gap-2">
                      <div className="mb-2">
                        <label htmlFor="opisReklamacije">Opis reklamacije</label>
                        <textarea id="opisReklamacije" aria-describedby="Opis reklamacije" value={updateData?.opisReklamacije || ""} onChange={handleChange} maxLength={512} required disabled={updateData?.statusReklamacije !== "PRIJEM"} />
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-1 gap-2">
                      <div className="mb-2">
                        <label htmlFor="komentar">Komentar</label>
                        <input type="text" id="komentar" aria-describedby="Komentar" value={updateData?.komentar || ""} onChange={handleChange} maxLength={512} />
                      </div>
                    </div>
                  </div>

                  <h4>Odluka o reklamaciji</h4>

                  <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div className="mb-3">
                      <label htmlFor="datumOdgovora">Datum odluke</label>
                      <div className="md:col-span-1">
                        <DatePicker
                          id="datumOdgovora"
                          locale="sr-Latn"
                          autoComplete="off"
                          selected={updateData.datumOdgovora || null}
                          onChange={(date: Date | null) =>
                            setUpdateData((prev) => ({
                              ...prev,
                              datumOdgovora: date,
                            }))
                          }
                          dateFormat="dd-MM-yyyy"
                          required={updateData?.statusReklamacije !== "OBRADA"}
                          disabled={updateData?.statusReklamacije !== "OBRADA" || authUser!.roleId < 3000}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="opisOdluke">Opis odluke o reklamaciji</label>
                      <textarea
                        id="opisOdluke"
                        aria-describedby="Odluka o reklamaciji"
                        value={updateData?.opisOdluke || ""}
                        onChange={handleChange}
                        maxLength={512}
                        required={updateData?.statusReklamacije !== "OBRADA"}
                        disabled={updateData?.statusReklamacije !== "OBRADA" || authUser!.roleId < 3000}
                      />
                    </div>
                  </div>
                  <div className="my-4 h-0.5 bg-zinc-400"></div>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" className="button button-gray" onClick={handleCancel}>
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
      </form>

      {showSpinner && <Spinner />}

      {showSaveModal && <Modal onOK={handleConfirmedSaveModal} onCancel={handleCancelSaveModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />}
    </div>
  );
};

export default ModalEdit;
