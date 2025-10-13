import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";

const NewPorudzbina = () => {
  const [novaPorudzbina, setNovaPorudzbina] = useState({
    proFaktura: "",
    status: "NACRT",
    dobavljac: "",
    zemlja: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.post("nabavke/porudzbine", novaPorudzbina);
      toast.success(`Nova porudžebina broj ${response?.data?.broj} je uspešno dodata!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/nabavke/aktivne-porudzbine");
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setNovaPorudzbina(null);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/nabavke/aktivne-porudzbine");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setNovaPorudzbina((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm xl:w-3/4 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Kreiranje nove porudžebine</h3>

            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

            <h4 className="my-3">Podaci o porudžebini</h4>

            <div className="my-3 grid gap-4 md:grid-cols-2 ">
              <div>
                <label htmlFor="proFaktura">Broj Profakture/Fakture</label>
                <input
                  type="text"
                  id="proFaktura"
                  aria-describedby="Broj Profakture/Fakture"
                  value={novaPorudzbina?.proFaktura}
                  onChange={handleChange}
                  maxLength={64}
                  required
                />
              </div>

              <div>
                <label htmlFor="dobavljac">Dobavljač</label>
                <input
                  type="text"
                  id="dobavljac"
                  aria-describedby="Dobavljač"
                  value={novaPorudzbina?.dobavljac}
                  onChange={handleChange}
                  maxLength={64}
                  required
                />
              </div>

              <div>
                <label htmlFor="datumPorudzbine">Datum porudžebine</label>
                <div>
                  <DatePicker
                    id="datumPorudzbine"
                    locale="sr-Latn"
                    aria-describedby="Datum porudžebine"
                    autoComplete="off"
                    selected={novaPorudzbina?.datumPorudzbine}
                    onChange={(date) =>
                      setNovaPorudzbina((prev) => ({
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
                <label htmlFor="zemlja">Zemlja</label>
                <select
                  id="zemlja"
                  aria-label="Odaberi zemlju"
                  required
                  value={novaPorudzbina?.zemlja}
                  onChange={handleChange}>
                  <option value="">Odaberite zemlju</option>
                  <option value="SRBIJA">Srbija</option>
                  <option value="CRNAGORA">Crna Gora</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="komentar">Komentar</label>
                <textarea
                  type="text"
                  id="komentar"
                  aria-describedby="Komentar"
                  value={novaPorudzbina?.komentar}
                  onChange={handleChange}
                  maxLength={512}
                  required
                />
              </div>
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
          </form>
        </div>

        {showModal && (
          <Modal
            onOK={handleOK}
            onCancel={handleCancel}
            title="Potvrda kreiranja nove porudžebine"
            question={`Da li ste sigurni da želite da kreirate novu porudžebinu broj: ${novaPorudzbina?.proFaktura}?`}
          />
        )}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewPorudzbina;
