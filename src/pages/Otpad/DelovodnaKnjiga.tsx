import React, { useState, useEffect, useRef } from "react";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useAuth } from "../../hooks/useAuth";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";

type DelovodnikData = {
  brojJci: string;
  datum: Date;
  operacija: string;
  ukupno: number;
  vrstaOtpada: string;
  zemlja: string;
};

const DelovodnaKnjiga: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [tableData, setTableData] = useState<DelovodnikData[]>([]);
  const [vrsteOtpada, setVrsteOtpada] = useState<VrstaOtpada[] | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { zemlja: "*", operacija: "*", vrstaOtpada: "*", godina: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "id" });
  const filtersOptions: FiltersOptions = {
    zemlja: ["SRBIJA", "CRNA_GORA"],
    operacija: ["UVOZ", "IZVOZ"],
    vrstaOtpada: vrsteOtpada?.map((vrsta) => vrsta.vrstaOtpada) || [],
    godina: Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 8 + i).toString()),
  };
  const { authUser } = useAuth();
  const vrsteOtpadaService = dataServiceBuilder<VrstaOtpada>(axiosPrivate, authUser, "otpad/vrste-otpada");
  const delovodnikService = dataServiceBuilder<DelovodnikData>(axiosPrivate, authUser, "otpad/delovodnik");

  const fetchVrsteOtpada = async () => {
    setShowSpinner(true);
    try {
      const response = await vrsteOtpadaService.getAllResources(null);
      setVrsteOtpada(response?.data.data);
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchVrsteOtpada();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await delovodnikService.getAllResources(queryParams);
      setTableData(response?.data?.data);
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.filters, queryParams.search, queryParams.page, queryParams.limit, queryParams.sortOrder, queryParams.sortBy]);

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

      <div className="flex justify-end gap-4">
        <DownloadTableExcel filename="Delovodna knjiga" sheet="Delovodna knjiga" currentTableRef={tableRef.current}>
          <button className="button button-sky"> Izvezi u Excel </button>
        </DownloadTableExcel>
      </div>
      <div className="my-4 flex gap-4 justify-end">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
      {showSpinner ? (
        <Spinner />
      ) : tableData?.length ? (
        <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="table-responsive">
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
                      <tr key={index} className="border-b bg-white hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                        <td className="text-start">{row?.datum && new Date(row.datum).toLocaleDateString("default", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
                        <td></td>
                        <td>{row?.operacija === "UVOZ" && row?.ukupno.toFixed(2)}</td>
                        <td>{row?.operacija === "UVOZ" ? row?.brojJci : ""}</td>
                        <td></td>
                        <td>{row?.operacija === "IZVOZ" && -row?.ukupno.toFixed(2)}</td>
                        <td>{row?.operacija === "IZVOZ" ? row?.brojJci : ""}</td>
                        <td>
                          {row?.operacija === "UVOZ" && row?.ukupno.toFixed(2)}
                          {row?.operacija === "IZVOZ" && -row?.ukupno.toFixed(2)}
                        </td>
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
          <div className="flex justify-end gap-4 my-4">
            <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
          </div>
        </div>
      ) : (
        <h4 className="my-4 text-zinc-600 ">Nema evidentiranih JCI...</h4>
      )}
    </>
  );
};

export default DelovodnaKnjiga;
