import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const PregledReklamacije: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [reklamacija, setReklamacija] = useState<Reklamacija | null>(null);
  const location = useLocation();
  const id = location.pathname.replace("/reklamacije/pregled-reklamacije/", "");
  const url = `${import.meta.env.VITE_APP_API_BASE_URL}/public/reklamacije/${id}`;
  const podaciProdavcaSrbija = (
    <>
      <p>Naziv prodavca: Business Solution Plus DOO Niš</p>
      <p>Adresa: Zdravke Vučković 79A, Niš</p>
      <p>MB 20714093 - PIB 106960688</p>
      <p>Kontakt: 063-277-596 / www.shoppy.rs / podrska@shoppy.rs</p>
    </>
  );
  const podaciProdavcaCrnaGora = (
    <>
      <p>Naziv prodavca: Business Solution Plus DOO Niš</p>
      <p>Dio stranog Društva Podgorica</p>
      <p>Adresa: Bulevar Serdara Jola Piletića 32/1, Podgorica</p>
      <p>MB 60015227 - Poreski broj 03557090</p>
      <p>Kontakt: 068-204-888 / www.shoppy-online.me / podrska@shoppy.rs</p>
    </>
  );

  const rokZaResavanjeSrbija = (
    <>
      <p>Rok za rešavanje reklamacije ukoliko je reklamacija opravdana: Zakonski rok od 15 dana od dana prijema, odnosno 30 dana za tehničku robu i nameštaj, od dana podnošenja reklamacije.</p>
    </>
  );
  const rokZaResavanjeCrnaGora = (
    <>
      <p>Rok za rešavanje reklamacije ukoliko je reklamacija opravdana: Zakonski rok od 15 dana od dana prijema.</p>
    </>
  );

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response: { data: { data: Reklamacija | null } } = await axios.get(url);
      if (response?.data) {
        setReklamacija(response?.data.data);
      }
    } catch {
      toast.warning(`Ne postoiji reklamacija sa brojem ${id}`, {
        position: "top-center",
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className=" min-h-full  bg-white p-4 text-center dark:bg-gray-900">
        {reklamacija ? (
          <>
            <h3 className="my-4">Shoppy Online evidencija reklamacija</h3>
            <div className="relative transform overflow-hidden rounded-2xl bg-gray-50 text-left shadow-xl transition-all dark:bg-gray-800">
              <div className=" p-4 sm:p-6 sm:pb-4 ">
                <div className="sm:flex sm:items-start">
                  <div className="w-full sm:mt-0">
                    <h3>Pregled reklamacije {id}</h3>
                    <div className="my-4 h-0.5 bg-zinc-400"></div>

                    <div className="grid grid-cols-1">
                      <h4>Podaci o prodavcu</h4>

                      {reklamacija.zemljaReklamacije === "CRNA_GORA" ? podaciProdavcaCrnaGora : podaciProdavcaSrbija}

                      <h4>Podaci o reklamaciji</h4>

                      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <label htmlFor="broj_reklamacije">Broj reklamacije</label>
                          <input value={reklamacija.brojReklamacije} type="text" id="broj_reklamacije" aria-describedby="Broj reklamacije" disabled />
                        </div>
                        <div>
                          <label htmlFor="datum_prijema">Datum prijema</label>
                          <div>
                            <DatePicker id="datum_prijema" locale="sr-Latn" selected={reklamacija.datumPrijema} dateFormat="dd-MM-yyyy" aria-describedby="Datum prijema" disabled />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="tatus_reklamacije">Status reklamacije</label>
                          <input value={reklamacija.statusReklamacije} type="text" id="status_reklamacije" aria-describedby="Status reklamacije" disabled />
                        </div>
                        <div>
                          <label htmlFor="odgovorna_osoba">Odgovorna osoba</label>
                          <input value={reklamacija.odgovornaOsoba || ""} type="text" id="odgovorna_osoba" aria-describedby="Odgovorna osoba" disabled />
                        </div>
                      </div>

                      <h4>Podaci o podnosiocu</h4>

                      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                        <div>
                          <label htmlFor="ime_prezime">Ime i prezime</label>
                          <input type="text" id="ime_prezime" aria-describedby="Ime i prezime" value={reklamacija.imePrezime} disabled />
                        </div>
                        <div>
                          <label htmlFor="adresa">Adresa</label>
                          <input type="text" id="adresa" aria-describedby="Adresa" value={reklamacija.adresa || ""} disabled />
                        </div>
                        <div>
                          <label htmlFor="telefon">Telefon</label>
                          <input type="text" id="telefon" aria-describedby="Telefon" value={reklamacija.telefon || ""} disabled />
                        </div>
                        <div>
                          <label htmlFor="email">Email</label>
                          <input type="email" id="email" aria-describedby="Email" value={reklamacija.email || ""} disabled />
                        </div>
                      </div>

                      <h4>Opis reklamacije</h4>

                      <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                        <div>
                          <label htmlFor="datum_kupovine">Datum kupovine</label>
                          <div>
                            <DatePicker id="datum_kupovine" locale="sr-Latn" selected={reklamacija.datumKupovine} aria-describedby="Datum kupovine" dateFormat="dd-MM-yyyy" disabled />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="broj_racuna">Broj računa</label>
                          <input type="text" id="broj_racuna" aria-describedby="Broj računa" value={reklamacija.brojRacuna || ""} disabled />
                        </div>
                        <div>
                          <label htmlFor="naziv_poizvoda">Naziv proizvoda</label>
                          <input type="text" id="naziv_poizvoda" aria-describedby="Naziv proizvoda" value={reklamacija.nazivProizvoda || ""} disabled />
                        </div>
                      </div>

                      <div className="mb-2 grid grid-cols-1 gap-2">
                        <div className="mb-2">
                          <label htmlFor="opis_reklamacije">Opis reklamacije</label>
                          <textarea className="min-h-48 md:min-h-32" id="opis_reklamacije" aria-describedby="Opis reklamacije" value={reklamacija.opisReklamacije || ""} disabled />
                        </div>
                      </div>
                    </div>

                    {(reklamacija.statusReklamacije === "OPRAVDANA" || reklamacija.statusReklamacije === "NEOPRAVDANA") && (
                      <>
                        <h4>Odluka o reklamaciji</h4>

                        <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
                          <div className="mb-3">
                            <label htmlFor="datum_odgovora">Datum odluke</label>
                            <div className="md:col-span-1">
                              <DatePicker id="datum_odgovora" locale="sr-Latn" selected={reklamacija.datumOdgovora && new Date(reklamacija.datumOdgovora)} dateFormat="dd-MM-yyyy" disabled />
                            </div>
                          </div>
                          <div className="md:col-span-3">
                            <label htmlFor="opis_odluke">Opis odluke o reklamaciji</label>
                            <textarea className="min-h-48 md:min-h-32" id="opis_odluke" aria-describedby="Odluka o reklamaciji" value={reklamacija.opisOdluke || ""} disabled />
                          </div>
                        </div>
                      </>
                    )}

                    <p>Rok za odgovor na izjavljenu reklamaciju: Zakonski rok od 8 dana od dana prijema.</p>

                    {reklamacija.zemljaReklamacije === "CRNA_GORA" ? rokZaResavanjeCrnaGora : rokZaResavanjeSrbija}

                    <p></p>
                    <p>
                      Ukoliko prodavac odbije reklamaciju, dužan je da potrošača obavesti o mogućnosti rešavanja spora vansudskim putem i o nadleženim telima za vansudsko rešavanje potrošačkih sporova. Listu tela za vansudsko rešavanje
                      sporova možete pronaći na web sajtu nadležnog ministarstva.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          !showSpinner && <h4 className="my-4 text-zinc-600 ">{`Ne postoji reklamacija sa brojem ${id}`}</h4>
        )}
      </div>
      {showSpinner && <Spinner />}
    </>
  );
};

export default PregledReklamacije;
