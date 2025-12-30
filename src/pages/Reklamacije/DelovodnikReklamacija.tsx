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

  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { statusReklamacije: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "datumPrijema" });
  const filtersOptions: FiltersOptions = {
    zemljaReklamacije: ["SRBIJA", "CRNA_GORA"],
    statusReklamacije: ["PRIJEM", "OBRADA", "OPRAVDANA", "NEOPRAVDANA", "DODATNI_ROK"],
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

      {tableData.length ? (
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
              {tableData.map((row, index) => (
                <tr key={index} className="border-b bg-white hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                  <td key={`broj_reklamacije_${index}`}>
                    <a
                      key={`broj_reklamacije_${index}`}
                      className="font-medium text-sky-500 no-underline  hover:cursor-pointer hover:text-sky-400"
                      href={`/reklamacije/pregled-reklamacije/${row.brojReklamacije}`}
                      target="blank"
                      rel="noreferrer noopener"
                    >
                      {row.brojReklamacije}
                    </a>
                  </td>
                  <td key={`zemlja_reklamacije_${index}`}>{row.zemljaReklamacije}</td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 font-medium text-zinc-600 dark:text-white ${row.statusReklamacije === "OPRAVDANA" ? `bg-green-300` : row.statusReklamacije === "NEOPRAVDANA" ? `bg-red-300` : `bg-zinc-300`}`}
                    key={`status_reklamacije_${index}`}
                  >
                    {row.statusReklamacije}
                  </td>
                  <td key={`datum_prijema_${index}`}>{row.datumPrijema && format(new Date(row.datumPrijema), "dd.MM.yyyy")}</td>
                  <td key={`odgovorna_osoba_${index}`}>{row.odgovornaOsoba}</td>
                  <td key={`ime_prezime_${index}`}>{row.imePrezime}</td>
                  <td key={`adresa_${index}`}>{row.adresa}</td>
                  <td key={`telefon_${index}`}>{row.telefon}</td>
                  <td key={`email_${index}`}>{row.email}</td>
                  <td key={`datum_kupovine_${index}`}>{row.datumKupovine && format(new Date(row.datumKupovine), "dd.MM.yyyy")}</td>
                  <td key={`broj_racuna_${index}`}>{row.brojRacuna}</td>
                  <td key={`naziv_poizvoda_${index}`}>{row.nazivProizvoda}</td>
                  <td
                    key={`opis_reklamacije_${index}`}
                    style={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.opisReklamacije}
                  </td>
                  <td key={`datum_odgovora_${index}`}>{row.datumOdgovora && format(new Date(row.datumOdgovora), "dd.MM.yyyy")}</td>
                  <td
                    key={`opis_odluke_${index}`}
                    style={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.opisOdluke}
                  </td>
                  <td
                    key={`komentar_${index}`}
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
                  <td key={`files_${index}`}>
                    <input
                      type="checkbox"
                      checked={Boolean(row.smsSent)}
                      disabled
                      className="h-4 w-4 appearance-auto rounded border-zinc-300 bg-zinc-100 p-2 text-zinc-600 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-zinc-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>
      )}

      {showSpinner && <Spinner />}

      {showHandleFiles && <HandleFiles url="reklamacije" id={selectedRowFiles!.idReklamacije!} dataWithFiles={selectedRowFiles!} fetchData={fetchData} setShowHandleFiles={setShowHandleFiles} />}
    </>
  );
};

export default DelovodnikReklamacija;
