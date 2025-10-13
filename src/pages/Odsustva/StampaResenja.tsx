import React, { useState, useEffect } from "react";
import moment from "moment";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import Kalendar from "./KalendarComponent/Kalendar";
import Pagination from "../../components/Pagination";

const StampaResenja: React.FC = () => {
  const [svaOdsustva, setSvaOdsustva] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ limit: 10, page: 1, count: 0 });
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchOdustva = async () => {
    setShowSpinner(true);
    try {
      const responseSvaOdustva = await axiosPrivate.get(
        `odsustva/evidencija?vrstaOdsustva=GODISNJI_ODMOR&sortBy=start&sortOrder=desc&page=${pagination.page}&limit=${pagination.limit}`,
      );
      setSvaOdsustva(responseSvaOdustva?.data?.data);
      setPagination({ ...pagination, count: responseSvaOdustva?.data?.count });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju proizvoda: ${error} `, { position: toast.POSITION.TOP_CENTER });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => { fetchOdustva(); }, [pagination.page, pagination.limit]);

  return (
    <>
      <div className="my-3 mt-4 flex h-full w-full items-center justify-center gap-2">
        <div className="grid w-full grid-cols-1 justify-center gap-8 xl:grid-cols-2">
          <Kalendar odsustva={svaOdsustva} />

          <div className="my-4 overflow-x-auto">
            <h4>Uneta odsustva</h4>

            <table className=" mt-4 w-full  text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
              <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                <tr>
                  <th className="px-2 py-3">Početak</th>
                  <th className="px-2 py-3">Kraj</th>
                  <th className="px-2 py-3">Vrsta</th>
                  <th className="px-2 py-3">Broj dana</th>
                  <th className="px-2 py-3">Odobreno</th>
                  <th className="px-2 py-3">Štampa</th>
                </tr>
              </thead>
              <tbody>
                {svaOdsustva?.length ? (
                  svaOdsustva.map((row, index) => (
                    <tr key={index} className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      <td key={`start_${index}`}>{row?.start ? moment(row?.start).format("DD-MM-YYYY") : ""}</td>
                      <td key={`end_${index}`}>{row?.end ? moment(row?.end).format("DD-MM-YYYY") : ""}</td>
                      <td key={`vrstaOdsustva_${index}`}>{row?.vrstaOdsustva}</td>
                      <td key={`brojDana_${index}`}>{row?.brojDana}</td>
                      <td key={`odobreno_${index}`}>
                        <input type="checkbox" checked={row?.odobreno} disabled className="h-4 w-4 appearance-auto rounded border-zinc-300 bg-zinc-100 p-2 text-zinc-600 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-zinc-600" />
                      </td>
                      <td key={`delete_${index}`} className="text-center">
                        <button type="button" className="button button-sky" disabled={row?.vrstaOdsustva !== "GODISNJI_ODMOR" || !row?.odobreno} aria-label="Odštampaj" onClick={() => window.open(`/odsustva/resenje-odmor/${row?.id}`, "_blank")}>
                          Odštampaj
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                    <td colSpan={6}>Nemate unetih zahteva za odsustvo...</td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showSpinner && <Pagination pagination={pagination} setPagination={setPagination} />}
          </div>
        </div>
      </div>
      {showSpinner && <Spinner />}
    </>
  );
};

export default StampaResenja;
