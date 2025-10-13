import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SadrzajPorudzbine = ({ id, setShowSadrzaj }: any) => {
  const [sadrzaj, setSadrzaj] = useState<any>(null);
  const [newProizvod, setNewProizvod] = useState({ porudzbinaId: id, proizvodId: "", kolicina: 0, cena: 0 });
  const [proizvodi, setProizvodi] = useState<any>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedRowDelete, setSelectedRowDelete] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchSadrzaj = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.get(`nabavke/sadrzaj?porudzbinaId=${id}`);
      setSadrzaj(response?.data);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  const fetchProizvodi = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(`nabavke/proizvodi?sortBy=SKU&sortOrder=asc`);
      setProizvodi(response?.data);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchSadrzaj();
    fetchProizvodi();
  }, []);

  let ukupnaKolicina = 0;
  let ukupnaVrednost = 0;
  sadrzaj?.forEach((row: any) => {
    ukupnaKolicina += row?.kolicina;
    ukupnaVrednost += row?.kolicina * row?.cena;
  });

  const handleCancel = () => {
    setShowSadrzaj(false);
  };

  const handleChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setNewProizvod((prev) => ({
      ...prev,
      [e.target.id]: isNaN(value) ? "" : value,
    }));
  };

  const handleDelete = (row: any) => {
    setSelectedRowDelete(row);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setShowSpinner(false);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`nabavke/sadrzaj/${selectedRowDelete?.id}`);
      toast.success("Proizvod je uspešno obrisan!", {
        position: toast.POSITION.TOP_CENTER,
      });
      fetchSadrzaj();
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowDeleteModal(false);
      setShowSpinner(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setShowSpinner(true);

    try {
      await axiosPrivate.post("nabavke/sadrzaj", newProizvod);
      toast.success(`Proizvod je uspešno dodat!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      fetchSadrzaj();
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setNewProizvod({ porudzbinaId: id, proizvodId: "", kolicina: 0, cena: 0 });
      setShowSpinner(false);
    }
  };

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
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
                        {sadrzaj ? (
                          sadrzaj.map((row: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                              <td key={`proizvod_${index}`}>{row?.proizvod?.naziv}</td>
                              <td key={`sku_${index}`}>{row?.proizvod?.SKU}</td>
                              <td key={`kolicina_${index}`}>{row?.kolicina}</td>
                              <td key={`cena_${index}`}>{row?.cena}</td>
                              <td key={`vrednost_${index}`}>{(row?.kolicina * row?.cena).toFixed(2)}</td>
                              <td key={`delete_${index}`} className="text-center">
                                <button
                                  type="button"
                                  className="button button-red"
                                  aria-label="Delete"
                                  onClick={() => handleDelete(row)}>
                                  Obriši
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
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
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 items-end gap-4 md:grid-cols-4">
                      <div>
                        <label htmlFor="proizvodId">Naziv proizvoda</label>
                        <select
                          id="proizvodId"
                          aria-describedby="Naziv proizvoda"
                          value={newProizvod?.proizvodId}
                          onChange={handleChange}
                          required>
                          <option value="">Odaberite proizvod</option>
                          {proizvodi?.length &&
                            proizvodi.map((proiz: any, index: number) => (
                              <option key={`proiz_${index}`} value={proiz?.id}>
                                {proiz?.SKU} - {proiz?.naziv}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="kolicina">Količina</label>
                        <input
                          min="1"
                          type="number"
                          step="1"
                          id="kolicina"
                          aria-describedby="Kolicina proizvoda"
                          value={newProizvod?.kolicina}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cena">Cena</label>
                        <input
                          min="0.001"
                          type="number"
                          step="0.001"
                          id="cena"
                          aria-describedby="Cena"
                          value={newProizvod?.cena}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="flex w-full justify-end">
                        <button type="submit" className="button button-sky">
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                {/* Modal Buttons */}
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                <div className="flex flex-row-reverse gap-2">
                  <button type="button" className="button button-gray" onClick={handleCancel}>
                    Zatvori
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSpinner && <Spinner />}

      {showDeleteModal && (
        <Modal
          onOK={handleDeleteOK}
          onCancel={handleDeleteCancel}
          title="Potvrda brisanja proizvoda"
          question={`Da li ste sigurni da želite da obrišete proizvod?`}
        />
      )}
    </div>
  );
};

export default SadrzajPorudzbine;
