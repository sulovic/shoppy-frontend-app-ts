import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

const NewJCI: React.FC = () => {
  const [novaJci, setNovaJci] = useState<any | null>(null);
  const [proizvodi, setProizvodi] = useState<any[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const fetchProizvodi = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get("otpad/proizvodi");
      setProizvodi(response?.data);
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju proizvoda: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchProizvodi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.post("otpad/evidencija", novaJci);
      toast.success(`Nova JCI broj ${response?.data?.brojJci} je uspešno dodata!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/otpad/evidencija");
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
    setNovaJci(null);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/otpad/evidencija");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovaJci((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeProizvod = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(e.target.value) >= 0) {
      setNovaJci((prev: any) => ({
        ...prev,
        jciProizvodi: {
          ...prev?.jciProizvodi,
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
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm xl:w-3/4 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Dodavanje nove JCI</h3>
            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
            <h4 className="my-3">Podaci o JCI</h4>
            <div className="my-3 grid gap-4 md:grid-cols-2 ">
              <div className="mb-3">
                <label htmlFor="brojJci">Broj JCI</label>
                <input
                  type="text"
                  id="brojJci"
                  aria-describedby="Broj JCI"
                  value={novaJci?.brojJci}
                  onChange={handleChange}
                  maxLength={190}
                  required
                />
              </div>

              <div>
                <label htmlFor="datum">Datum JCI</label>
                <div>
                  <DatePicker
                    id="datum"
                    locale="sr-Latn"
                    aria-describedby="Datum JCI"
                    autoComplete="off"
                    selected={novaJci?.datum}
                    onChange={(date: any) =>
                      setNovaJci((prev: any) => ({
                        ...prev,
                        datum: date,
                      }))
                    }
                    dateFormat="dd.MM.yyyy"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="zemlja">Zemlja</label>
                <select id="zemlja" aria-label="Odaberi zemlju" required value={novaJci?.zemlja} onChange={handleChange}>
                  <option value="">Odaberite zemlju</option>
                  <option value="SRBIJA">Srbija</option>
                  <option value="CRNAGORA">Crna Gora</option>
                </select>
              </div>
              <div>
                <label htmlFor="operacija">Operacija</label>
                <select id="operacija" aria-label="Odaberi operaciju" required value={novaJci?.operacija} onChange={handleChange}>
                  <option value="">Odaberite operaciju</option>
                  <option value="UVOZ">Uvoz</option>
                  <option value="IZVOZ">Izvoz</option>
                </select>
              </div>
            </div>

            <h4 className="my-3">Podaci o proizvodima</h4>

            <div className="grid grid-cols-2 gap-4">
              {proizvodi &&
                proizvodi.map((row: any, index: number) => (
                  <div key={`proizvod_${index}`}>
                    <label>{row?.proizvod}</label>
                    <input
                      type="number"
                      step="0.001"
                      id={row?.id}
                      aria-describedby="Ime i prezime"
                      value={novaJci?.jciProizvodi?.id}
                      onChange={handleChangeProizvod}
                      maxLength={190}
                      required
                    />
                  </div>
                ))}
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
            title="Potvrda dodavanja nove JCI"
            question={`Da li ste sigurni da želite da dodate novu JCI: ${novaJci?.brojJci}?`}
          />
        )}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewJCI;
