import { useState } from "react";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useRacuniApi from "../../hooks/useRacuniApi";
import { useAuth } from "../../hooks/useAuth";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";

const SlanjeSMS = () => {
  const [racuni, setRacuni] = useState<UploadFRResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useRacuniApi();
  const { authUser } = useAuth();
  const bulkRacuniService = dataServiceBuilder<UploadFRResult>(axiosPrivate, authUser, "racuni/bulk-pull");
  const racuniAdminService = dataServiceBuilder<Pick<FiscalReceipt, "receiptNumber" | "dateSent">>(axiosPrivate, authUser, "racuni/racuni-admin");

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response: { data: { data: UploadFRResult[] } } = await bulkRacuniService.getAllResources(null);
      console.log(response);
      setRacuni(response.data.data);
      toast.success("Fiskalni računi preuzeti", { position: "top-center", autoClose: 1000 });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleSendSMS = () => {
    setShowModal(true);
  };

  const handleSendSMSCancel = () => {
    setShowModal(false);
  };

  const handleSendSMSOK = () => {
    console.log("SMS poslat");
  };

  console.log(racuni);

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
          {racuni.map((racun) => (
            <div key={racun.receiptNumber} className="my-4 items-center justify-between rounded-md border border-zinc-300 p-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <p>Kupac: {racun.nameSurname}</p>
                <p>Zemlja: {racun.country}</p>
                <p>Status: {racun.status}</p>
                <p>Pošiljka: {racun.shipmentNumber}</p>
                <p>Račun: {racun.receiptNumber}</p>
                <p>Datum: {format(new Date(racun.receiptIssueDate), "dd.MM.yyyy.")}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="my-4 flex items-center justify-between rounded-md border border-zinc-300 p-2 text-zinc-600 ">
          <h4>Nema Fiskalnih računa za slanje...</h4>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4 ">
        <button type="button" className="button button-sky" aria-label="Izmeni" onClick={() => fetchData()}>
          Preuzmi račune
        </button>
        <button type="button" className="button button-red" aria-label="Obriši" disabled={racuni.length === 0} onClick={() => handleSendSMS()}>
          Pošalji SMS
        </button>
      </div>
      {showModal && <Modal onOK={handleSendSMSOK} onCancel={handleSendSMSCancel} title="Potvrda slanja SMS" question={`Da li ste sigurni da želite da pošaljete SMS poruke za preuzete račune?`} />}
    </>
  );
};

export default SlanjeSMS;
