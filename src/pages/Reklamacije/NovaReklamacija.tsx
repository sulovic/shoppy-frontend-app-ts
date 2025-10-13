import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

const NovaReklamacija: React.FC = () => {
  const broj_reklamacije = Math.floor(Math.random() * 8999999 + 100000).toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getFullYear().toString();
  const praznaReklamacija = {
    ime_prezime: "",
    broj_reklamacije: broj_reklamacije,
    odgovorna_osoba: "Ivan Mitić, Direktor",
    status_reklamacije: "PRIJEM",
    datum_prijema: null,
    zemlja_reklamacije: "",
    adresa: "",
    telefon: "",
    email: "",
    datum_kupovine: null,
    broj_racuna: "",
    naziv_poizvoda: "",
    opis_reklamacije: "",
    komentar: "",
  };
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [novaReklamacija, setNovaReklamacija] = useState<any>(praznaReklamacija);
  const axiosPrivate = useAxiosPrivate();

  const handleClose = (e: any) => {
    e.preventDefault();
    setNovaReklamacija(null);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/reklamacije/prijem-reklamacija");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      await axiosPrivate.post(`reklamacije`, novaReklamacija);
      toast.success(`Reklamacija ${novaReklamacija?.broj_reklamacije} je uspešno sačuvana!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      setNovaReklamacija(praznaReklamacija);
      navigate("/reklamacije/prijem-reklamacija");
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    setNovaReklamacija((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.value,
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
            <label htmlFor="broj_reklamacije">Broj reklamacije</label>
            <input value={novaReklamacija?.broj_reklamacije} type="text" id="broj_reklamacije" aria-describedby=" Broj reklamacije" disabled />
          </div>
          <div>
            <label htmlFor="datum_prijema">Datum prijema</label>
            <div>
              <DatePicker
                id="datum_prijema"
                locale="sr-Latn"
                autoComplete="off"
                selected={novaReklamacija?.datum_prijema}
                onChange={(date: any) =>
                  setNovaReklamacija((prev: any) => ({
                    ...prev,
                    datum_prijema: date,
                  }))
                }
                dateFormat="dd - MM - yyyy"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="zemlja_reklamacije">Zemlja reklamacije</label>
            <select id="zemlja_reklamacije" aria-label="Odaberi zemlju" required value={novaReklamacija?.zemlja_reklamacije} onChange={handleChange}>
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
            <label htmlFor="ime_prezime">Ime i prezime</label>
            <input type="text" id="ime_prezime" aria-describedby="Ime i prezime" value={novaReklamacija?.ime_prezime} onChange={handleChange} maxLength={190} required />
          </div>
          <div>
            <label htmlFor="adresa">Adresa</label>
            <input type="text" id="adresa" aria-describedby="Adresa" value={novaReklamacija?.adresa} onChange={handleChange} maxLength={190} />
          </div>
          <div>
            <label htmlFor="telefon">Telefon</label>
            <input type="text" id="telefon" aria-describedby="Telefon" value={novaReklamacija?.telefon} onChange={handleChange} maxLength={190} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" autoComplete="on" aria-describedby="Email" value={novaReklamacija?.email} onChange={handleChange} maxLength={190} />
          </div>
        </div>

        {/* Podaci o reklamaciji */}

        <h4 className="my-3 ">Opis reklamacije</h4>

        <div className="my-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 ">
          <div>
            <label htmlFor="datum_kupovine">Datum kupovine</label>
            <div>
              <DatePicker
                id="datum_kupovine"
                locale="sr-Latn"
                autoComplete="off"
                selected={novaReklamacija?.datum_kupovine}
                onChange={(date) =>
                  setNovaReklamacija((prev) => ({
                    ...prev,
                    datum_kupovine: date,
                  }))
                }
                dateFormat="dd - MM - yyyy"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="broj_racuna">Broj računa</label>
            <input type="text" id="broj_racuna" aria-describedby="Broj računa" value={novaReklamacija?.broj_racuna} onChange={handleChange} maxLength={190} required />
          </div>
          <div>
            <label htmlFor="naziv_poizvoda">Naziv proizvoda</label>
            <input type="text" id="naziv_poizvoda" aria-describedby="Naziv proizvoda" value={novaReklamacija?.naziv_poizvoda} onChange={handleChange} maxLength={190} required />
          </div>
        </div>
        <div className="my-3 grid grid-cols-1 gap-2">
          <div className="mb-3">
            <label htmlFor="opis_reklamacije">Opis reklamacije</label>
            <textarea type="text" id="opis_reklamacije" aria-describedby="Opis reklamacije" value={novaReklamacija?.opis_reklamacije} onChange={handleChange} maxLength={512} required />
          </div>
        </div>
        <div className="my-3 grid grid-cols-1 gap-2">
          <div>
            <label htmlFor="komentar">Komentar</label>
            <input type="text" id="komentar" aria-describedby="Komentar" value={novaReklamacija?.komentar} onChange={handleChange} maxLength={512} />
          </div>
        </div>

        <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

        <div className="float-end mb-3 mt-3 flex gap-2">
          <button type="submit" className="button button-gray" onClick={handleClose}>
            Odustani
          </button>
          <button type="submit" className="button button-sky">
            Sačuvaj
          </button>
        </div>
      </form>

      {/* Modal and Spinner component */}

      {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda unosa nacrta Nove reklamacije" question={`Da li ste sigurni da želite da sačuvate nacrt Nove reklamacije za kupca ${novaReklamacija?.ime_prezime}?`} />}
      {showSpinner && <Spinner />}
    </div>
  );
};

export default NovaReklamacija;
