import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { handleCustomErrors } from "../../services/errorHandler";
import reklamacijeServiceBuilder from "../../services/reklamacijaService";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ReklamacijaSchema } from "../../schemas/schemas";

const NovaReklamacija: React.FC = () => {
  const brojReklamacije = Math.floor(Math.random() * 8999999 + 100000).toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getFullYear().toString();
  const praznaReklamacija: Reklamacija = {
    imePrezime: "",
    brojReklamacije: brojReklamacije,
    odgovornaOsoba: "Ivan Mitić, Direktor",
    statusReklamacije: "PRIJEM",
    datumPrijema: null,
    adresa: "",
    telefon: "",
    email: "",
    zemljaReklamacije: "SRBIJA",
    datumKupovine: null,
    brojRacuna: "",
    nazivProizvoda: "",
    opisReklamacije: "",
    komentar: "",
    smsSent: false,
  };
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [novaReklamacija, setNovaReklamacija] = useState<Reklamacija>(praznaReklamacija);
  const { authUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const reklamacijeService = reklamacijeServiceBuilder(axiosPrivate, authUser);

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    setNovaReklamacija(praznaReklamacija);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/reklamacije/prijem-reklamacija");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const paresedReklamacija = ReklamacijaSchema.parse(novaReklamacija);
      await reklamacijeService.createReklamacija(paresedReklamacija);
      toast.success(`Reklamacija ${paresedReklamacija?.brojReklamacije} je uspešno sačuvana!`, {
        position: "top-center",
      });
      setNovaReklamacija(praznaReklamacija);
      navigate("/reklamacije/prijem-reklamacija");
    } catch (error) {
      handleCustomErrors(JSON.stringify(error));
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    // normalize phone number
    if (id === "telefon") {
      const cleaned = value.replace(/[^\d+\s\-()/]/g, "");
      setNovaReklamacija((prev) => ({ ...prev, telefon: cleaned }));
      return;
    }

    // normalize empty string to null
    if (id === "email") {
      setNovaReklamacija((prev) => ({
        ...prev,
        email: value === "" ? null : value,
      }));
      return;
    }

    setNovaReklamacija((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="my-4 grid grid-cols-1 gap-2 rounded-xl border-2 border-solid border-zinc-100 bg-gray-50  p-4 shadow-sm dark:bg-gray-800">
      {/* Form component */}

      <form onSubmit={handleSubmit}>
        <h3 className="mb-4 ">Prijem nove reklamacije</h3>

        <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

        {/* Podaci o reklamaciji */}

        <h4 className="my-3">Podaci o reklamaciji</h4>

        <div className="my-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 ">
          <div>
            <label htmlFor="brojReklamacije">Broj reklamacije</label>
            <input value={novaReklamacija.brojReklamacije} type="text" id="brojReklamacije" aria-describedby=" Broj reklamacije" disabled />
          </div>
          <div>
            <label htmlFor="datumPrijema">Datum prijema</label>
            <div>
              <DatePicker
                id="datumPrijema"
                locale="sr-Latn"
                autoComplete="off"
                selected={novaReklamacija.datumPrijema || null}
                onChange={(date: Date | null) =>
                  setNovaReklamacija((prev) => ({
                    ...prev,
                    datumPrijema: date,
                  }))
                }
                dateFormat="dd - MM - yyyy"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="zemljaReklamacije">Zemlja reklamacije</label>
            <select id="zemljaReklamacije" aria-label="Odaberi zemlju" required value={novaReklamacija.zemljaReklamacije} onChange={handleChange}>
              <option value="">Odaberite zemlju</option>
              <option value="SRBIJA">Srbija</option>
              <option value="CRNAGORA">Crna Gora</option>
            </select>
          </div>
        </div>

        {/* Podaci o podnosiocu */}

        <h4 className="my-3 ">Podaci o podnosiocu</h4>

        <div className="my-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 ">
          <div>
            <label htmlFor="imePrezime">Ime i prezime</label>
            <input type="text" id="imePrezime" aria-describedby="Ime i prezime" value={novaReklamacija.imePrezime} onChange={handleChange} maxLength={190} required />
          </div>
          <div>
            <label htmlFor="adresa">Adresa</label>
            <input type="text" id="adresa" aria-describedby="Adresa" value={novaReklamacija.adresa || ""} onChange={handleChange} maxLength={190} />
          </div>
          <div>
            <label htmlFor="telefon">Telefon</label>
            <input type="tel" id="telefon" value={novaReklamacija.telefon} onChange={handleChange} required minLength={6} maxLength={20} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" autoComplete="on" aria-describedby="Email" value={novaReklamacija.email || ""} onChange={handleChange} maxLength={190} />
          </div>
        </div>

        {/* Podaci o reklamaciji */}

        <h4 className="my-3 ">Opis reklamacije</h4>

        <div className="my-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 ">
          <div>
            <label htmlFor="datumKupovine">Datum kupovine</label>
            <div>
              <DatePicker
                id="datumKupovine"
                locale="sr-Latn"
                autoComplete="off"
                selected={novaReklamacija.datumKupovine}
                onChange={(date) =>
                  setNovaReklamacija((prev) => ({
                    ...prev,
                    datumKupovine: date,
                  }))
                }
                dateFormat="dd - MM - yyyy"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="brojRacuna">Broj računa</label>
            <input type="text" id="brojRacuna" aria-describedby="Broj računa" value={novaReklamacija.brojRacuna || ""} onChange={handleChange} maxLength={190} required />
          </div>
          <div>
            <label htmlFor="nazivProizvoda">Naziv proizvoda</label>
            <input type="text" id="nazivProizvoda" aria-describedby="Naziv proizvoda" value={novaReklamacija.nazivProizvoda || ""} onChange={handleChange} maxLength={190} required />
          </div>
        </div>
        <div className="my-3 grid grid-cols-1 gap-2">
          <div className="mb-3">
            <label htmlFor="opisReklamacije">Opis reklamacije</label>
            <textarea id="opisReklamacije" aria-describedby="Opis reklamacije" value={novaReklamacija.opisReklamacije || ""} onChange={handleChange} maxLength={512} required />
          </div>
        </div>
        <div className="my-3 grid grid-cols-1 gap-2">
          <div>
            <label htmlFor="komentar">Komentar</label>
            <input type="text" id="komentar" aria-describedby="Komentar" value={novaReklamacija.komentar || ""} onChange={handleChange} maxLength={512} />
          </div>
        </div>

        <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

        <div className="float-end mb-3 mt-3 flex gap-2">
          <button type="button" className="button button-gray" onClick={handleClose}>
            Odustani
          </button>
          <button type="submit" className="button button-sky">
            Sačuvaj
          </button>
        </div>
      </form>

      {/* Modal and Spinner component */}

      {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda unosa nacrta Nove reklamacije" question={`Da li ste sigurni da želite da sačuvate nacrt Nove reklamacije za kupca ${novaReklamacija.imePrezime}?`} />}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default NovaReklamacija;
