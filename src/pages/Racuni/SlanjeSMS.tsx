import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useRacuniApi from "../../hooks/useRacuniApi";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import smsTextGenerator from "../../services/FiscalReceiptSMSGenerator";

const SlanjeSMS = () => {
  const [racuni, setRacuni] = useState<UploadFRResult[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useRacuniApi();
  const { authUser } = useAuth();
  const bulkRacuniService = dataServiceBuilder<UploadFRResult>(axiosPrivate, authUser, "racuni/bulk-pull");
  const racuniAdminService = dataServiceBuilder<Pick<FiscalReceipt, "receiptNumber" | "dateSent">>(axiosPrivate, authUser, "racuni/racuni-admin");

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response: { data: { data: UploadFRResult[] } } = await bulkRacuniService.getAllResources(null);
      setRacuni(response.data.data);
      console.log(response.data.data);
      toast.success("Fiskalni računi preuzeti", { position: "top-center", autoClose: 1000 });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleSmsSent = async (racun: UploadFRResult) => {
    try {
      await racuniAdminService.updateResource(racun.receiptNumber, {
        receiptNumber: racun.receiptNumber,
        dateSent: new Date(),
      });
      setRacuni((prev) => prev.map((r) => (r.receiptNumber === racun.receiptNumber ? { ...r, dateSent: new Date() } : r)));
    } catch (error) {
      handleCustomErrors(error as string);
    }
  };

  return (
    <>
      <h3 className="mt-4 ">Slanje Fiskalnih računa na SMS</h3>
      {showSpinner ? (
        <>
          <Spinner />
          <div className="my-4 flex items-center justify-between rounded-md border border-zinc-300 p-2 text-zinc-600">
            <h4>Preuzimam fiskalne račune...</h4>
          </div>
        </>
      ) : racuni.length ? (
        <>
          {racuni.map((racun) => {
            const smsText = smsTextGenerator(racun);
            return (
              <div key={racun.receiptNumber} className="my-4 items-center justify-between rounded-md border border-zinc-300 p-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <p>Kupac: {racun.nameSurname}</p>
                  <p>Zemlja: {racun.country}</p>
                  <p>Račun: {racun.receiptNumber}</p>
                  <p>Pošiljka: {racun.shipmentNumber}</p>
                  <p>Datum: {racun.receiptIssueDate ? format(new Date(racun.receiptIssueDate), "dd.MM.yyyy.") : "-"}</p>
                  {racun.status == "error" ? (
                    <p className="whitespace-nowrap text-center px-6 py-4 font-medium text-gray-800! bg-red-300">GREŠKA!: {racun.message || "Nepoznata greška"}</p>
                  ) : racun.dateSent ? (
                    <span>
                      <a onClick={() => handleSmsSent(racun)} className="button button-sky" href={`sms:${racun.phoneNumber}?body=${encodeURIComponent(smsText)}`}>
                        Pošalji ponovo
                      </a>
                    </span>
                  ) : (
                    <span>
                      <a onClick={() => handleSmsSent(racun)} className="button button-sky" href={`sms:${racun.phoneNumber}?body=${encodeURIComponent(smsText)}`}>
                        Pošalji poruku
                      </a>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="my-4 flex items-center justify-between rounded-md border border-zinc-300 p-2 text-zinc-600 ">
          <h4>Nema Fiskalnih računa za slanje...</h4>
        </div>
      )}

      <div className="flex flex-row-reverse gap-4 mt-4 ">
        <button type="button" className="button button-sky" aria-label="Izmeni" onClick={() => fetchData()}>
          Preuzmi račune
        </button>
      </div>
    </>
  );
};

export default SlanjeSMS;
