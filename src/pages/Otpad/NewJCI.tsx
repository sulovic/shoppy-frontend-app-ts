import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";
import { JciPodaciSchema } from "../../schemas/schemas";

const NewJCI: React.FC = () => {
  const newJci: Omit<JciPodaci, "id"> = {
    zemlja: "SRBIJA",
    brojJci: "",
    datum: new Date(),
    operacija: "UVOZ",
    jciProizvodi: [],
  };
  const [jci, setJci] = useState<Omit<JciPodaci, "id">>(newJci);
  const [proizvodi, setProizvodi] = useState<JciProizvodi[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const proizvodiService = dataServiceBuilder<JciProizvodi>(axiosPrivate, authUser, "otpad/proizvodi");
  const jciService = dataServiceBuilder<Omit<JciPodaci, "id">>(axiosPrivate, authUser, "otpad/jci");

  const fetchProizvodi = async () => {
    setShowSpinner(true);
    try {
      const response = await proizvodiService.getAllResources({ sortOrder: "asc", sortBy: "id", limit: 100, page: 1 });
      setProizvodi(response?.data.data);
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchProizvodi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Initialize newJci with proizvodi data
  useEffect(() => {
    if (!proizvodi) return;

    setJci((prev) => ({
      ...prev,
      jciProizvodi: proizvodi.map((proizvod) => ({
        kolicina: 0,
        proizvod: {
          id: proizvod.id,
          proizvod: proizvod.proizvod,
          ProizvodMasaOtpada: proizvod.ProizvodMasaOtpada,
        },
      })),
    }));
  }, [proizvodi]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);
    try {
      const parsedJci = JciPodaciSchema.parse(jci);
      const response = await jciService.createResource(parsedJci);
      const createdJci = response.data.data;
      toast.success(`Nova JCI broj ${createdJci.brojJci} je uspešno dodata!`, {
        position: "top-center",
      });
      navigate("/otpad/evidencija");
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    setJci(newJci);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/otpad/evidencija");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setJci((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleChangeProizvod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const kolicina = Math.max(0, parseFloat(e.target.value));

    setJci((prev) => ({
      ...prev,
      jciProizvodi: prev.jciProizvodi.map((item) => (item.proizvod.id === id ? { ...item, kolicina: kolicina } : item)),
    }));
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
                <input type="text" id="brojJci" aria-describedby="Broj JCI" value={jci?.brojJci} onChange={handleChange} maxLength={190} required />
              </div>

              <div>
                <label htmlFor="datum">Datum JCI</label>
                <div>
                  <DatePicker
                    id="datum"
                    locale="sr-Latn"
                    aria-describedby="Datum JCI"
                    autoComplete="off"
                    selected={jci.datum}
                    onChange={(date) => {
                      if (!date) return;
                      setJci((prev) => ({
                        ...prev,
                        datum: date,
                      }));
                    }}
                    dateFormat="dd.MM.yyyy"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="zemlja">Zemlja</label>
                <select id="zemlja" aria-label="Odaberi zemlju" required value={jci.zemlja} onChange={handleChange}>
                  <option value="">Odaberite zemlju</option>
                  <option value="SRBIJA">Srbija</option>
                  <option value="CRNA_GORA">Crna Gora</option>
                </select>
              </div>
              <div>
                <label htmlFor="operacija">Operacija</label>
                <select id="operacija" aria-label="Odaberi operaciju" required value={jci.operacija} onChange={handleChange}>
                  <option value="">Odaberite operaciju</option>
                  <option value="UVOZ">Uvoz</option>
                  <option value="IZVOZ">Izvoz</option>
                </select>
              </div>
            </div>

            <h4 className="my-3">Podaci o proizvodima</h4>

            <div className="grid grid-cols-2 gap-4">
              {proizvodi &&
                proizvodi.map((row) => (
                  <div key={row.id}>
                    <label>{row?.proizvod}</label>
                    <input type="number" step="0.001" id={row?.id.toString()} aria-describedby="Ime i prezime" value={jci.jciProizvodi.find((x) => x.proizvod.id === row.id)?.kolicina} onChange={handleChangeProizvod} required />
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

        {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda dodavanja nove JCI" question={`Da li ste sigurni da želite da dodate novu JCI: ${jci?.brojJci}?`} />}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewJCI;
