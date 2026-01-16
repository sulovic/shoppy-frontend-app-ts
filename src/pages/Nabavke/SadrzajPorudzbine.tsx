import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { handleCustomErrors } from "../../services/errorHandler";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";

const SadrzajPorudzbine = ({ porudzbina, setShowSadrzaj }: { porudzbina: Porudzbina; setShowSadrzaj: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const prazanSadrzaj = {
    proizvod: {
      id: 0,
      naziv: "",
      SKU: "",
    },
    kolicina: 0,
    cena: 0,
  };
  const [editedPorudzbina, setEditedPorudzbina] = useState<Porudzbina>(porudzbina);
  const [proizvodi, setProizvodi] = useState<NabavkeProizvod[]>([]);
  const [newSadrzaj, setNewSadrzaj] = useState(prazanSadrzaj);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const porudzbineService = dataServiceBuilder<Porudzbina>(axiosPrivate, authUser, "nabavke/porudzbine");
  const proizvodiService = dataServiceBuilder<NabavkeProizvod>(axiosPrivate, authUser, "nabavke/proizvodi");

  const fetchProizvodi = async () => {
    setShowSpinner(true);
    try {
      const response = await proizvodiService.getAllResources(null);
      setProizvodi(response?.data.data);
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchProizvodi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let ukupnaKolicina = 0;
  let ukupnaVrednost = 0;
  editedPorudzbina.sadrzaj?.forEach((row) => {
    ukupnaKolicina += row?.kolicina;
    ukupnaVrednost += row?.kolicina * row?.cena;
  });

  const handleCancel = () => {
    setShowSadrzaj(false);
  };

  const handleChangeNewSadrzaj = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    let parsedValue;

    if (id === "proizvod") {
      parsedValue = proizvodi.find((item) => item.naziv === value);
    } else {
      parsedValue = Math.max(0, parseFloat(value));
    }

    setNewSadrzaj((prev) => {
      return {
        ...prev,
        [id]: parsedValue,
      };
    });
  };

  const handleAddNewSadrzaj = () => {
    console.log(newSadrzaj);
    if (!newSadrzaj.proizvod || !newSadrzaj.kolicina || !newSadrzaj.cena) {
      toast.warn("Popunite sva polja!", {
        position: "top-center",
      });
      return;
    }
    setEditedPorudzbina((prev) => ({
      ...prev,
      sadrzaj: [...(prev.sadrzaj || []), newSadrzaj],
    }));
    setNewSadrzaj(prazanSadrzaj);
  };

  const handleDeleteProizvod = (row: Porudzbina["sadrzaj"][number]) => {
    setEditedPorudzbina((prev) => ({
      ...prev,
      sadrzaj: prev.sadrzaj?.filter((item) => item.id !== row.id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending ", editedPorudzbina);
    setShowSpinner(true);
    try {
      const response = await porudzbineService.updateResource(editedPorudzbina.id, editedPorudzbina);
      const savedEditedPorudzbina = response.data.data;
      toast.success(`Porudžbina ${savedEditedPorudzbina?.proFaktura} je uspešno sačuvana! `, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
              <form onSubmit={handleSubmit}>
                <div className="w-full sm:mt-0">
                  <h3>Sadržaj kontejnera</h3>
                  <div className="my-4 h-0.5 bg-zinc-400"></div>

                  <div className="grid grid-cols-1">
                    <div className=" overflow-x-auto">
                      <table className=" mt-4 w-full   text-center text-sm text-zinc-500 rtl:text-right  dark:text-zinc-400">
                        <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                          <tr>
                            <th className="px-2 py-3">Naziv proizvoda</th>
                            <th className="px-2 py-3">SKU</th>
                            <th className="px-2 py-3">Količina</th>
                            <th className="px-2 py-3">Cena</th>
                            <th className="px-2 py-3">Vrednost</th>
                            <th className="px-2 py-3">Obriši</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editedPorudzbina.sadrzaj ? (
                            editedPorudzbina.sadrzaj.map((row) => (
                              <tr key={row.id} className="border-b bg-white text-center hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                                <td>{row?.proizvod?.naziv}</td>
                                <td>{row?.proizvod?.SKU}</td>
                                <td>{row?.kolicina}</td>
                                <td>{row?.cena}</td>
                                <td>{(row?.kolicina * row?.cena).toFixed(2)}</td>
                                <td className="text-center">
                                  <button type="button" className="button button-red" aria-label="Delete" onClick={() => handleDeleteProizvod(row)}>
                                    Obriši
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-b bg-white text-center hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                              <td colSpan={6}>Nije unet sadržaj za ovu porudžbinu...</td>
                            </tr>
                          )}
                          <tr className=" bg-zinc-200 font-bold uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                            <td>UKUPNO:</td>
                            <td></td>
                            <td>{ukupnaKolicina}</td>
                            <td></td>
                            <td>{ukupnaVrednost.toFixed(2)}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="my-4 h-0.5 bg-zinc-400"></div>

                    <h4>Dodaj nove proizvode: </h4>
                    <div className="grid grid-cols-2 items-end gap-4 md:grid-cols-4">
                      <div>
                        <label htmlFor="proizvodId">Naziv proizvoda</label>
                        <select id="proizvod" aria-describedby="Naziv proizvoda" value={newSadrzaj?.proizvod.naziv} onChange={handleChangeNewSadrzaj}>
                          <option value="">Odaberite proizvod</option>
                          {proizvodi?.length &&
                            proizvodi.map((proizvod) => (
                              <option key={proizvod.id} value={proizvod.naziv}>
                                {proizvod.SKU} - {proizvod.naziv}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="kolicina">Količina</label>
                        <input type="number" step="1" id="kolicina" aria-describedby="Kolicina proizvoda" value={newSadrzaj?.kolicina} onChange={handleChangeNewSadrzaj} />
                      </div>
                      <div>
                        <label htmlFor="cena">Cena</label>
                        <input type="number" step="0.001" id="cena" aria-describedby="Cena" value={newSadrzaj?.cena} onChange={handleChangeNewSadrzaj} />
                      </div>
                      <div className="flex w-full justify-end">
                        <button type="button" className="button button-sky" onClick={handleAddNewSadrzaj}>
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Modal Buttons */}
                  <div className="my-4 h-0.5 bg-zinc-400"></div>

                  <div className="flex flex-row-reverse gap-2">
                    <button type="button" className="button button-gray" onClick={handleCancel}>
                      Zatvori
                    </button>
                    <button type="submit" className="button button-sky">
                      Sacuvaj
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showSpinner && <Spinner />}

      {/* {showDeleteModal && <Modal onOK={handleDeleteOK} onCancel={handleDeleteCancel} title="Potvrda brisanja proizvoda" question={`Da li ste sigurni da želite da obrišete proizvod?`} />} */}
    </div>
  );
};

export default SadrzajPorudzbine;
