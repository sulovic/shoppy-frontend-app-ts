import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";

const SlanjeSMS: React.FC = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [filter, setFilter] = useState<any>({ zemlja_reklamacije: "" });
  const [showModal, setShowModal] = useState(false);
  const [reklamacija, setReklamacija] = useState<any>(null);
  const [smsText, setSmsText] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>({ limit: 20, page: 1, count: 0 });
  const axiosPrivate = useAxiosPrivate();
  const tableHeaders = [
    "Pregled reklamacije",
    "Pošalji SMS",
    "SMS je poslat",
    "Datum prijema",
    "Ime i prezime",
    "Naziv proizvoda",
    "Zemlja reklamacije",
    "Status reklamacije",
  ];
  const tableRef = useRef<HTMLTableElement | null>(null);

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.get(
        `reklamacije?sortBy=datum_prijema&sortOrder=desc${filter?.zemlja_reklamacije !== "" ? `&zemlja_reklamacije=${filter?.zemlja_reklamacije}` : ""}&page=${pagination.page}&limit=${pagination.limit}`,
      );
      setTableData(response?.data?.data || []);
      setPagination({ ...pagination, count: response?.data?.count });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pagination.page, pagination.limit]);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev: any) => ({ ...prev, [e.target.id]: e.target.value }));
    setPagination({ ...pagination, page: 1 });
  };

  const handleSendSms = (row: any) => {
    setReklamacija(row);
    switch (row?.status_reklamacije) {
      case "OBRADA":
        setSmsText(
          `Reklamacija ${row?.broj_reklamacije} za kupca ${row?.ime_prezime} je PRIMLJENA. Status reklamacije možete pratiti na linku ${process.env.REACT_APP_BASE_URL}/reklamacije/pregled-reklamacije/${row?.broj_reklamacije}`,
        );
        break;
      case "OPRAVDANA":
        setSmsText(
          `Reklamacija ${row?.broj_reklamacije} za kupca ${row?.ime_prezime} je OPRAVDANA. Odgovor na reklamaciju možete pogledati na linku ${process.env.REACT_APP_BASE_URL}/reklamacije/pregled-reklamacije/${row?.broj_reklamacije}`,
        );
        break;
      case "NEOPRAVDANA":
        setSmsText(
          `Reklamacija ${row?.broj_reklamacije} za kupca ${row?.ime_prezime} je NEOPRAVDANA. Odgovor na reklamaciju možete pogledati na linku ${process.env.REACT_APP_BASE_URL}/reklamacije/pregled-reklamacije/${row?.broj_reklamacije}`,
        );
        break;
      default:
        setSmsText("");
    }
    setShowModal(true);
  };

  const handleSendSmsOK = async () => {
    const updatedReklamacija = { ...reklamacija, sms_sent: true };

    try {
      setShowSpinner(true);
      await axiosPrivate.put(`reklamacije/${updatedReklamacija?.broj_reklamacije}`, updatedReklamacija);
      toast.success(`SMS za reklamaciju ${reklamacija?.ime_prezime} - ${reklamacija?.broj_reklamacije} je uspešno poslat!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške...`, {
        position: toast.POSITION.TOP_CENTER,
      });
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

        <div className="grid grid-cols-1 justify-end gap-4 md:flex">
          <div className=" flex justify-end gap-4">
            <label htmlFor="zemlja_reklamacije">Zemlja reklamacije: </label>
            <form>
              <select id="zemlja_reklamacije" aria-label="Odaberi zemlju" required value={filter?.zemlja_reklamacije} onChange={handleChangeFilter}>
                <option value="">Sve zemlje</option>
                <option value="SRBIJA">Srbija</option>
                <option value="CRNAGORA">Crna Gora</option>
              </select>
            </form>
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
                  <tr key={index} className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                    <td key={`broj_reklamacije_${index}`}>
                      <a className="font-medium text-sky-500 no-underline  hover:cursor-pointer hover:text-sky-400" href={`/reklamacije/pregled-reklamacije/${row?.broj_reklamacije}`} target="blank" rel="noreferrer noopener">
                        {row?.broj_reklamacije}
                      </a>
                    </td>
                    <td>
                      <button type="button" className="button button-sky" disabled={row?.status_reklamacije === "PRIJEM"} onClick={() => handleSendSms(row)}>
                        Pošalji SMS
                      </button>
                    </td>
                    <td key={`files_${index}`}>
                      <input type="checkbox" checked={Boolean(row?.sms_sent)} disabled className="h-4 w-4 appearance-auto rounded border-zinc-300 bg-zinc-100 p-2 text-zinc-600 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-zinc-600" />
                    </td>
                    <td key={`datum_prijema_${index}`}>{row?.datum_prijema && format(new Date(row?.datum_prijema), "dd.MM.yyyy")}</td>
                    <td key={`ime_prezime_${index}`}>{row?.ime_prezime}</td>
                    <td key={`naziv_poizvoda_${index}`}>{row?.naziv_poizvoda}</td>
                    <td key={`zemlja_reklamacije_${index}`}>{row?.zemlja_reklamacije}</td>
                    <td className={`whitespace-nowrap px-6 py-4 font-medium text-zinc-600 dark:text-white ${row?.status_reklamacije === "OPRAVDANA" ? `bg-green-300` : row?.status_reklamacije === "NEOPRAVDANA" ? `bg-red-300` : `bg-zinc-300`}`} key={`status_reklamacije_${index}`}>
                      {row?.status_reklamacije}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>
        )}
        {!showSpinner && <Pagination pagination={pagination} setPagination={setPagination} />}
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
              </a>{" "}
              <br /> Kada pošaljete SMS potvrdite na OK.
            </span>
          }
        />
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default SlanjeSMS;
