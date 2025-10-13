import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { useAuth } from "../../Context/AuthContext";

const ModalEdit: React.FC<any> = ({ updateData, setUpdateData, setShowEditModal, fetchData }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();

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
      await axiosPrivate.put(`reklamacije/${updateData?.broj_reklamacije}`, updateData);

      toast.success(`Reklamacija ${updateData?.broj_reklamacije} je uspešno sačuvana!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSaveModal(true);
      setShowEditModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUpdateData((prev: any) => ({
      ...prev,
      [e.target.id]: (e.target as HTMLInputElement).value,
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
                <h3>Izmena reklamacije</h3>
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                <div className="grid grid-cols-1">
                  <h4>Podaci o reklamaciji</h4>

                  <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div>
                      <label htmlFor="broj_reklamacije">Broj reklamacije</label>
                      <input
                        value={updateData?.broj_reklamacije}
                        type="text"
                        id="broj_reklamacije"
                        aria-describedby=" Broj reklamacije"
                        disabled
                      />
                    </div>
                    <div>
                      <label htmlFor="datum_prijema">Datum prijema</label>
                      <div>
                        <DatePicker
                          id="datum_prijema"
                          locale="sr-Latn"
                          autoComplete="off"
                          selected={new Date(updateData?.datum_prijema)}
                          onChange={(date: Date) =>
                            setUpdateData((prev: any) => ({
                              ...prev,
                              datum_prijema: date,
                            }))
                          }
                          dateFormat="dd-MM-yyyy"
                          required
                          disabled={updateData?.status_reklamacije !== "PRIJEM"}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zemlja_reklamacije">Zemlja reklamacije</label>
                      <select
                        id="zemlja_reklamacije"
                        aria-label="Odaberi zemlju"
                        required
                        value={updateData?.zemlja_reklamacije}
                        onChange={handleChange}
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}>
                        <option value="">Odaberite zemlju</option>
                        <option value="SRBIJA">Srbija</option>
                        <option value="CRNAGORA">Crna Gora</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="status_reklamacije">Status reklamacije</label>
                      <input
                        value={updateData?.status_reklamacije}
                        type="text"
                        id="status_reklamacije"
                        aria-describedby=" Status reklamacije"
                        disabled
                      />
                    </div>
                  </div>

                  <h4>Podaci o podnosiocu</h4>

                  <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div>
                      <label htmlFor="ime_prezime">Ime i prezime</label>
                      <input
                        type="text"
                        id="ime_prezime"
                        aria-describedby="Ime i prezime"
                        value={updateData?.ime_prezime}
                        onChange={handleChange}
                        maxLength={190}
                        required
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                    <div>
                      <label htmlFor="adresa">Adresa</label>
                      <input
                        type="text"
                        id="adresa"
                        aria-describedby="Adresa"
                        value={updateData?.adresa}
                        onChange={handleChange}
                        maxLength={190}
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                    <div>
                      <label htmlFor="telefon">Telefon</label>
                      <input
                        type="text"
                        id="telefon"
                        aria-describedby="Telefon"
                        value={updateData?.telefon}
                        onChange={handleChange}
                        maxLength={190}
                        required
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                    <div>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        autoComplete="on"
                        aria-describedby="Email"
                        value={updateData?.email}
                        onChange={handleChange}
                        maxLength={190}
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                  </div>

                  <h4>Opis o reklamacije</h4>

                  <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div>
                      <label htmlFor="datum_kupovine">Datum kupovine</label>
                      <div>
                        <DatePicker
                          id="datum_kupovine"
                          locale="sr-Latn"
                          autoComplete="off"
                          selected={new Date(updateData?.datum_kupovine)}
                          onChange={(date: Date) =>
                            setUpdateData((prev: any) => ({
                              ...prev,
                              datum_kupovine: date,
                            }))
                          }
                          dateFormat="dd-MM-yyyy"
                          required
                          disabled={updateData?.status_reklamacije !== "PRIJEM"}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="broj_racuna">Broj računa</label>
                      <input
                        type="text"
                        id="broj_racuna"
                        aria-describedby="Broj računa"
                        value={updateData?.broj_racuna}
                        onChange={handleChange}
                        maxLength={190}
                        required
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                    <div>
                      <label htmlFor="naziv_poizvoda">Naziv proizvoda</label>
                      <input
                        type="text"
                        id="naziv_poizvoda"
                        aria-describedby="Naziv proizvoda"
                        value={updateData?.naziv_poizvoda}
                        onChange={handleChange}
                        maxLength={190}
                        required
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-1 gap-2">
                    <div className="mb-2">
                      <label htmlFor="opis_reklamacije">Opis reklamacije</label>
                      <textarea
                        id="opis_reklamacije"
                        aria-describedby="Opis reklamacije"
                        value={updateData?.opis_reklamacije}
                        onChange={handleChange}
                        maxLength={512}
                        required
                        disabled={updateData?.status_reklamacije !== "PRIJEM"}
                      />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-2">
                    <div className="mb-2">
                      <label htmlFor="komentar">Komentar</label>
                      <input
                        type="text"
                        id="komentar"
                        aria-describedby="Komentar"
                        value={updateData?.komentar}
                        onChange={handleChange}
                        maxLength={512}
                      />
                    </div>
                  </div>
                </div>

                <h4>Odluka o reklamaciji</h4>

                <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                  <div className="mb-3">
                    <label htmlFor="datum_odgovora">Datum odluke</label>
                    <div className="md:col-span-1">
                      <DatePicker
                        id="datum_odgovora"
                        locale="sr-Latn"
                        autoComplete="off"
                        selected={updateData?.datum_odgovora && new Date(updateData?.datum_odgovora)}
                        onChange={(date: Date) =>
                          setUpdateData((prev: any) => ({
                            ...prev,
                            datum_odgovora: date,
                          }))
                        }
                        dateFormat="dd-MM-yyyy"
                        required={updateData?.status_reklamacije !== "OBRADA"}
                        disabled={updateData?.status_reklamacije !== "OBRADA" || authUser?.role_id < 3000}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label htmlFor="opis_odluke">Opis odluke o reklamaciji</label>
                    <textarea
                      id="opis_odluke"
                      aria-describedby="Odluka o reklamaciji"
                      value={updateData?.opis_odluke}
                      onChange={handleChange}
                      maxLength={512}
                      required={updateData?.status_reklamacije !== "OBRADA"}
                      disabled={updateData?.status_reklamacije !== "OBRADA" || authUser?.role_id < 3000}
                    />
                  </div>
                </div>
                <div className="my-4 h-0.5 bg-zinc-400"></div>
              </div>

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

      {showSaveModal && (
        <Modal
          onOK={handleConfirmedSaveModal}
          onCancel={handleCancelSaveModal}
          title="Sačuvati izmene"
          question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?"
        />
      )}
    </div>
  );
};

export default ModalEdit;
