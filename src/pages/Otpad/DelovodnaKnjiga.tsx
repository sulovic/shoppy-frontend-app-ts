import React, { useState, useEffect, useRef } from "react";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { DownloadTableExcel } from "react-export-table-to-excel";

const DelovodnaKnjiga: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [filter, setFilter] = useState<any>({ zemlja: "*", godina: new Date().getFullYear(), vrstaOtpada: "*" });
  const [vrsteOtpada, setVrsteOtpada] = useState<any[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const tableRef = useRef<any>(null);

  const fetchVrsteOtpada = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(`otpad/vrste-otpada`);
      setVrsteOtpada(response?.data);
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchVrsteOtpada();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(
        `otpad/delovodnik?zemlja=${filter?.zemlja}&vrstaOtpada=${filter?.vrstaOtpada}&godina=${filter?.godina}`,
      );
      setTableData(response?.data);
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  let sumUvezenaKolicina = 0;
  let sumIzvezenaKolicina = 0;
  let sumBrojUkupnoPlasirano = 0;

  tableData.forEach((row) => {
    if (row.operacija === "UVOZ") {
      sumUvezenaKolicina += row?.ukupno;
      sumBrojUkupnoPlasirano += row?.ukupno;
    } else if (row.operacija === "IZVOZ") {
      sumIzvezenaKolicina -= row?.ukupno;
      sumBrojUkupnoPlasirano -= row?.ukupno;
    }
  });

  sumUvezenaKolicina = parseFloat(sumUvezenaKolicina.toFixed(2));
  sumIzvezenaKolicina = parseFloat(sumIzvezenaKolicina.toFixed(2));
  sumBrojUkupnoPlasirano = parseFloat(sumBrojUkupnoPlasirano.toFixed(2));

  return (
    <>
      <h3 className="mt-4">Delovodna knjiga</h3>

      <div className="grid grid-cols-1 justify-end gap-4  md:flex">
        <div className="flex justify-end gap-4">
          <label htmlFor="zemlja">Zemlja: </label>
          <select id="zemlja" aria-label="Odaberi zemlju" required value={filter?.zemlja} onChange={handleChangeFilter}>
            <option value="*">Sve zemlje</option>
            <option value="SRBIJA">Srbija</option>
            <option value="CRNAGORA">Crna Gora</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <label htmlFor="godina">Godina: </label>
          <select id="godina" aria-label="Odaberi godinu" required value={filter?.godina} onChange={handleChangeFilter}>
            {[...Array(7).keys()].map((i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <label htmlFor="vrstaOtpada">Vrsta otpada: </label>
          <form>
            <select id="vrstaOtpada" aria-label="Odaberi vrstu otpada" required value={filter?.vrstaOtpada} onChange={handleChangeFilter}>
              <option value="*">Sve vrste otpada</option>
              {vrsteOtpada.length > 0 &&
                vrsteOtpada.map((id, index) => {
                  return (
                    <option key={index} value={id?.vrstaOtpada}>
                      {id?.vrstaOtpada}
                    </option>
                  );
                })}
            </select>
          </form>
        </div>
        <div className="flex justify-end gap-4">
          <DownloadTableExcel filename="Delovodna knjiga" sheet="Delovodna knjiga" currentTableRef={tableRef.current}>
            <button className="button button-sky"> Izvezi u Excel </button>
          </DownloadTableExcel>
        </div>
      </div>
      {tableData?.length ? (
        <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="table-responsive p-3">
            <table ref={tableRef} className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
              <thead className="bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                <tr>
                  <th colSpan={8} className="px-6 py-3 text-center">
                    DNEVNA EVIDENCIJA O PROIZVODNJI, UVOZU I IZVOZU PROIZVODA
                  </th>
                </tr>

                <tr>
                  <th className="px-6 py-3">Datum</th>
                  <th className="px-6 py-3">Proizvedena količina u (u kg)</th>
                  <th className="px-6 py-3">Uvezena količina (u kg)</th>
                  <th className="px-6 py-3">Broj uvozne JCI liste</th>
                  <th className="px-6 py-3">Ukupna vrednost PDV* RSD</th>
                  <th className="px-6 py-3">Izvezena količina (u kg)</th>
                  <th className="px-6 py-3">Broj izvozne JCI liste</th>
                  <th className="px-6 py-3">Ukupno plasirano na tržište RS (u kg)</th>
                </tr>
              </thead>

              <tbody className="text-end">
                {tableData.map(
                  (row, index) =>
                    row.ukupno > 0 && (
                      <tr key={index} className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        <td className="text-start">{row?.datum && new Date(row.datum).toLocaleDateString("default", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
                        <td></td>
                        <td>{row?.operacija === "UVOZ" && row?.ukupno.toFixed(2)}</td>
                        <td>{row?.operacija === "UVOZ" ? row?.brojJci : ""}</td>
                        <td></td>
                        <td>{row?.operacija === "IZVOZ" && -row?.ukupno.toFixed(2)}</td>
                        <td>{row?.operacija === "IZVOZ" ? row?.brojJci : ""}</td>
                        <td>{row?.operacija === "UVOZ" && row?.ukupno.toFixed(2)}{row?.operacija === "IZVOZ" && -row?.ukupno.toFixed(2)}</td>
                      </tr>
                    ),
                )}
                <tr className=" bg-zinc-200 font-bold uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  <td>UKUPNO:</td>
                  <td></td>
                  <td>{sumUvezenaKolicina.toFixed(2)}</td>
                  <td></td>
                  <td></td>
                  <td>{sumIzvezenaKolicina.toFixed(2)}</td>
                  <td></td>
                  <td>{sumBrojUkupnoPlasirano.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema evidentiranih JCI...</h4>
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default DelovodnaKnjiga;
