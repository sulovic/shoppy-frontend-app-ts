import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Modal from "../../components/Modal";
import { useRef } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ReklamacijaSchema } from "../../schemas/schemas";

const SlanjeSMS = () => {
  const [tableData, setTableData] = useState<Reklamacija[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const { authUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { statusReklamacije: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "datumPrijema" });

  const reklamacijeService = dataServiceBuilder<Reklamacija>(axiosPrivate, authUser, "reklamacije");

  const [showModal, setShowModal] = useState(false);
  const [reklamacija, setReklamacija] = useState<Reklamacija | null>(null);
  const [smsText, setSmsText] = useState<string | null>(null);
  const tableHeaders = ["Pregled reklamacije", "Pošalji SMS", "SMS je poslat", "Datum prijema", "Ime i prezime", "Naziv proizvoda", "Zemlja reklamacije", "Status reklamacije"];
  const filtersOptions: FiltersOptions = {
    zemljaReklamacije: ["SRBIJA", "CRNA_GORA"],
    // statusReklamacije: ["PRIJEM", "OBRADA", "OPRAVDANA", "NEOPRAVDANA", "DODATNI_ROK"],
  };
  const tableRef = useRef<HTMLTableElement | null>(null);

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

  const handleSendSms = (row: Reklamacija) => {
    setReklamacija(row);
    switch (row?.statusReklamacije) {
      case "OBRADA":
        setSmsText(`Reklamacija ${row?.brojReklamacije} za kupca ${row?.imePrezime} je PRIMLJENA. Status reklamacije možete pratiti na linku ${import.meta.env.REACT_APP_BASE_URL}/reklamacije/pregled-reklamacije/${row?.brojReklamacije}`);
        break;
      case "OPRAVDANA":
        setSmsText(
          `Reklamacija ${row?.brojReklamacije} za kupca ${row?.imePrezime} je OPRAVDANA. Odgovor na reklamaciju možete pogledati na linku ${import.meta.env.REACT_APP_BASE_URL}/reklamacije/pregled-reklamacije/${row?.brojReklamacije}`,
        );
        break;
      case "NEOPRAVDANA":
        setSmsText(
          `Reklamacija ${row?.brojReklamacije} za kupca ${row?.imePrezime} je NEOPRAVDANA. Odgovor na reklamaciju možete pogledati na linku ${import.meta.env.REACT_APP_BASE_URL}/reklamacije/pregled-reklamacije/${row?.brojReklamacije}`,
        );
        break;
      default:
        setSmsText("");
    }
    setShowModal(true);
  };

  const handleSendSmsOK = async () => {
    setShowSpinner(true);

    const smsSentReklamacija = { ...reklamacija!, brojReklamacije: reklamacija!.brojReklamacije!, sms_sent: true };

    try {
      const parsedReklamacija = ReklamacijaSchema.parse(smsSentReklamacija);
      const response = await reklamacijeService.updateResource(Number(parsedReklamacija.brojReklamacije), parsedReklamacija);
      const updatedReklamacija = response.data.data;
      toast.success(`SMS za reklamaciju ${updatedReklamacija?.imePrezime} - ${updatedReklamacija?.brojReklamacije} je uspešno poslat!`, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
    setReklamacija(null);
    setSmsText(null);
    setShowModal(false);
    fetchData();
  };

  const handleSendSmsCancel = () => {
    setReklamacija(null);
    setSmsText(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="mb-4">
        <h3 className="mt-4">Reklamacije - Slanje SMS poruka</h3>

        <div className="mb-4 flex gap-4 justify-end">
          <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
          <Search queryParams={queryParams} setQueryParams={setQueryParams} />
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
                      <a className="font-medium text-sky-500 no-underline  hover:cursor-pointer hover:text-sky-400" href={`/reklamacije/pregled-reklamacije/${row?.brojReklamacije}`} target="blank" rel="noreferrer noopener">
                        {row?.brojReklamacije}
                      </a>
                    </td>
                    <td>
                      <button type="button" className="button button-sky" disabled={row?.statusReklamacije === "PRIJEM"} onClick={() => handleSendSms(row)}>
                        Pošalji SMS
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" checked={row?.smsSent} disabled className="scale-150" />
                    </td>
                    <td>{row?.datumPrijema && format(new Date(row?.datumPrijema), "dd.MM.yyyy")}</td>
                    <td>{row?.imePrezime}</td>
                    <td>{row?.nazivProizvoda}</td>
                    <td>{row?.zemljaReklamacije}</td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 font-medium text-zinc-600 dark:text-white ${row?.statusReklamacije === "OPRAVDANA" ? `bg-green-300` : row?.statusReklamacije === "NEOPRAVDANA" ? `bg-red-300` : `bg-zinc-300`}`}
                    >
                      {row?.statusReklamacije}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h4 className="my-4 text-zinc-600 ">Nema evidentiranih reklamacija...</h4>
        )}
        <div className="flex justify-end gap-4 mb-4">
          <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
        </div>
      </div>
      {showModal && (
        <Modal
          onOK={handleSendSmsOK}
          onCancel={handleSendSmsCancel}
          title="Slanje SMS poruke"
          question={
            <span>
              <a className="text-sky-600" href={`sms:${reklamacija?.telefon}?body=${smsText}`}>
                Kliknite OVDE da generišete SMS poruku.
              </a>
              <p> Kada pošaljete SMS potvrdite na OK. </p>
            </span>
          }
        />
      )}
    </>
  );
};

export default SlanjeSMS;
