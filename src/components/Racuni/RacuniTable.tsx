import { format } from "date-fns";
import smsTextGenerator from "../../services/FiscalReceiptSMSGenerator";
import useRacuniApi from "../../hooks/useRacuniApi";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";

const tableHeaders = ["Datum", "Ime i prezime", "Datum SMS", "Slanje SMS", "Telefon", "Adresa", "Pošiljka", "Broj računa", "Link računa", "Izmena"];

const RacuniTable = ({ tableData, setTableData }: { tableData: FiscalReceipt[]; setTableData: React.Dispatch<React.SetStateAction<FiscalReceipt[]>> }) => {
  const { authUser } = useAuth();
  const axiosPrivate = useRacuniApi();
  const racuniAdminService = dataServiceBuilder<Pick<FiscalReceipt, "receiptNumber" | "dateSent">>(axiosPrivate, authUser, "racuni/racuni-admin");

  const handleSendSms = async (racun: FiscalReceipt) => {
    try {
      const {
        data: { data: updatedRacun },
      } = await racuniAdminService.updateResource(racun.receiptNumber, {
        receiptNumber: racun.receiptNumber,
        dateSent: new Date(),
      });
      setTableData((prev) => prev.map((r) => (r.receiptNumber === updatedRacun.receiptNumber ? { ...r, dateSent: updatedRacun.dateSent } : r)));
    } catch (error) {
      handleCustomErrors(error as string);
    }
  };

  return (
    <>
      <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="table-responsive">
          <table className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
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
              {tableData.map((row: FiscalReceipt) => {
                const smsText = smsTextGenerator(row);
                return (
                  <tr key={row.receiptNumber} className="border-b bg-white hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                    <td>{row.receiptIssueDate ? format(new Date(row.receiptIssueDate), "dd.MM.yyyy") : ""}</td>
                    <td>{row.nameSurname}</td>

                    <td className={`whitespace-nowrap px-6 py-4 font-medium text-zinc-600 dark:text-white ${row.dateSent ? `bg-green-300` : `bg-red-300 `}`}>{row.dateSent ? format(new Date(row.dateSent), "dd.MM.yyyy") : "Nije poslat"}</td>
                    <td className="px-6! py-4!">
                      <span>
                        <a onClick={() => handleSendSms(row)} className="button button-sky" href={`sms:${row.phoneNumber}?body=${encodeURIComponent(smsText)}`}>
                          {row.dateSent ? "Ponovi SMS" : "Pošalji SMS"}
                        </a>
                      </span>
                    </td>
                    <td>{row.phoneNumber}</td>
                    <td>
                      {row.country === "SRBIJA" ? "RS: " : "MNE: "} {row.address}
                    </td>
                    <td>{row.shipmentNumber}</td>
                    <td>{row.receiptNumber}</td>
                    <td>
                      <a href={row.externalLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                        Otvori link
                      </a>
                    </td>
                    <td>
                      <div className="flex gap-4">
                        <button type="button" className="button button-sky" onClick={() => console.log("Izmeni")}>
                          Izmeni
                        </button>
                        {authUser && authUser.roleId > 5000 && (
                          <button type="button" className="button button-red" disabled={authUser.roleId < 5000} onClick={() => console.log("Obriši")}>
                            Obriši
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RacuniTable;
