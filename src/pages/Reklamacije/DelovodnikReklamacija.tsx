import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { handleCustomErrors } from "../../services/errorHandler";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import HandleFiles from "../../components/HandleFiles";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

const DelovodnikReklamacija: React.FC = () => {
  const [tableData, setTableData] = useState<Reklamacija[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedRowFiles, setSelectedRowFiles] = useState<Reklamacija | null>(null);
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const reklamacijeService = dataServiceBuilder<Reklamacija>(axiosPrivate, authUser, "reklamacije");
  const tableHeaders = [
    "Broj reklamacije",
    "Zemlja reklamacije",
    "Status reklamacije",
    "Datum prijema",
    "Odgovorna osoba",
    "Ime i prezime",
    "Adresa",
    "Telefon",
    "Email",
    "Datum kupovine",
    "Broj računa",
    "Naziv proizvoda",
    "Opis reklamacije",
    "Datum odgovora",
    "Opis odluke",
    "Komentar",
    "Datoteke",
    "SMS je poslat",
  ];
  const tableRef = useRef<HTMLTableElement | null>(null);

  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { statusReklamacije: "*", zemljaReklamacije: "*", godina: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "datumPrijema" });
  const filtersOptions: FiltersOptions = {
    zemljaReklamacije: ["SRBIJA", "CRNA_GORA"],
    statusReklamacije: ["PRIJEM", "OBRADA", "OPRAVDANA", "NEOPRAVDANA", "DODATNI_ROK"],
    godina: Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 8 + i).toString()),
  };

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const [response, reklamacijeCount] = await Promise.all([reklamacijeService.getAllResources(queryParams), reklamacijeService.getAllResourcesCount(queryParams)]);
      setTableData(response.data.data);
      setQueryParams({ ...queryParams, count: reklamacijeCount.data.count });
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

  const handleShowFiles = (row: Reklamacija) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  return (
    <>
      <h3 className="mt-4 ">Reklamacije - Delovodna knjiga</h3>

      <div className="mb-4 flex gap-4 justify-end">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>

      <div className="grid grid-cols-1 justify-end gap-4 md:flex">
        <div className=" flex justify-end gap-4">
          <DownloadTableExcel filename="Delovodnik reklamacija" sheet="Delovodna knjiga" currentTableRef={tableRef.current}>
            <button className="button button-sky"> Izvezi u Excel </button>
          </DownloadTableExcel>
        </div>
      </div>

      {showSpinner ? (
        <Spinner />
      ) : tableData.length ? (
        <div className="relative my-4 overflow-x-auto border-2 p-3 shadow-lg shadow-slate-700 sm:rounded-lg">
          <table ref={tableRef} className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
            <thead className="text-s bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
              <tr>
                {tableHeaders.map((tableKey, index) => (
                  <th className="px-6 py-3" key={index}>
                    {tableKey}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableData.map((row) => (
                <tr key={row.brojReklamacije} className="border-b bg-white hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                  <td>
                    <a className="font-medium text-sky-500 no-underline  hover:cursor-pointer hover:text-sky-400" href={`/reklamacije/pregled-reklamacije/${row.brojReklamacije}`} target="blank" rel="noreferrer noopener">
                      {row.brojReklamacije}
                    </a>
                  </td>
                  <td>{row.zemljaReklamacije}</td>
                  <td className={`whitespace-nowrap px-6 py-4 font-medium text-zinc-600 dark:text-white ${row.statusReklamacije === "OPRAVDANA" ? `bg-green-300` : row.statusReklamacije === "NEOPRAVDANA" ? `bg-red-300` : `bg-zinc-300`}`}>
                    {row.statusReklamacije}
                  </td>
                  <td>{row.datumPrijema && format(new Date(row.datumPrijema), "dd.MM.yyyy")}</td>
                  <td>{row.odgovornaOsoba}</td>
                  <td>{row.imePrezime}</td>
                  <td>{row.adresa}</td>
                  <td>{row.telefon}</td>
                  <td>{row.email}</td>
                  <td>{row.datumKupovine && format(new Date(row.datumKupovine), "dd.MM.yyyy")}</td>
                  <td>{row.brojRacuna}</td>
                  <td>{row.nazivProizvoda}</td>
                  <td
                    style={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.opisReklamacije}
                  </td>
                  <td>{row.datumOdgovora && format(new Date(row.datumOdgovora), "dd.MM.yyyy")}</td>
                  <td
                    style={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.opisOdluke}
                  </td>
                  <td
                    style={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.komentar}
                  </td>
                  <td>
                    <button className="button button-sky" onClick={() => handleShowFiles(row)}>
                      Rad sa datotekama - prikačeno {row.files ? row.files.length : "0"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={row.smsSent} disabled className="scale-150" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-4 mb-4">
            <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
          </div>
        </div>
      ) : (
        <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>
      )}
      {showHandleFiles && <HandleFiles url="reklamacije" id={selectedRowFiles!.idReklamacije!} dataWithFiles={selectedRowFiles!} fetchData={fetchData} setShowHandleFiles={setShowHandleFiles} />}
    </>
  );
};

export default DelovodnikReklamacija;
