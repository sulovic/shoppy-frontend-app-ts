import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import moment from "moment";
import Kalendar from "./KalendarComponent/Kalendar";

const OdobravanjeOdsustva: React.FC = () => {
  const [odsustvaZaOdobrenje, setOdsustvaZaOdobrenje] = useState<any[]>([]);
  const [odsustva, setOdsustva] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOdsustvo, setSelectedOdsustvo] = useState<any>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const fetchOdustva = async () => {
    setShowSpinner(true);

    try {
      const responseOdustva = await axiosPrivate.get(`odsustva/evidencija`);
      setOdsustva(responseOdustva?.data?.data || []);
      const responseOdustvaZaOdobrenje = await axiosPrivate.get(`odsustva/evidencija?odobreno=false&sortBy=start&sortOrder=desc`);
      setOdsustvaZaOdobrenje(responseOdustvaZaOdobrenje?.data?.data || []);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju proizvoda: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchOdustva();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = (odsustvo: any) => {
    setSelectedOdsustvo(odsustvo);
    setShowModal(true);
  };
  const handleApproveOK = async () => {
    setShowSpinner(true);
    const updateData = {
      ...selectedOdsustvo,
      odobreno: true,
      odobrioUser: "Ivan Mitić",
    };
    try {
      await axiosPrivate.put(`odsustva/evidencija/${updateData?.id}`, updateData);
      toast.success(`Zahtev za odsustvo: ${updateData?.user} - ${updateData?.vrstaOdsustva} - ${updateData?.brojDana} dana je odobreno!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
      fetchOdustva();
    }
  };

  const handleApproveCancel = () => {
    setSelectedOdsustvo(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="my-3 mt-4 flex h-full w-full items-center justify-center gap-2">
        <div className="grid w-full grid-cols-1 justify-center gap-8 px-4 xl:grid-cols-2">
          <Kalendar odsustva={odsustva} />

          <div className="max-w-full flex-grow rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm  dark:bg-gray-800">
            <div className=" my-4 overflow-x-auto">
              <h4>Odsustva za odobravanje:</h4>

              <table className=" mt-4 w-full  text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                  <tr>
                    <th className="px-2 py-3">Zaposleni</th>
                    <th className="px-2 py-3">Početak</th>
                    <th className="px-2 py-3">Kraj</th>
                    <th className="px-2 py-3">Vrsta</th>
                    <th className="px-2 py-3">Broj dana</th>
                    <th className="px-2 py-3">Odobri</th>
                  </tr>
                </thead>
                <tbody>
                  {odsustvaZaOdobrenje?.length ? (
                    odsustvaZaOdobrenje.map((row, index) => (
                      <tr key={index} className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        <td key={`zaposleni_${index}`}>{row?.user}</td>
                        <td key={`start_${index}`}>{row?.start ? moment(row?.start).format("DD-MM-YYYY") : ""}</td>
                        <td key={`end_${index}`}>{row?.end ? moment(row?.end).format("DD-MM-YYYY") : ""}</td>
                        <td key={`vrstaOdsustva_${index}`}>{row?.vrstaOdsustva}</td>
                        <td key={`brojDana_${index}`}>{row?.brojDana}</td>

                        <td key={`delete_${index}`} className="text-center">
                          <button type="button" className="button button-green" aria-label="Delete" onClick={() => handleApprove(row)}>
                            Odobri
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b bg-white text-center hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      <td colSpan={6}>Nema odsustva koja čekaju odobrenje...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal onOK={handleApproveOK} onCancel={handleApproveCancel} title="Potvrda odobrenja unetog odsustva" question={`Da li ste sigurni da želite da odobrite uneto odsustvo: ${selectedOdsustvo?.user} - ${selectedOdsustvo?.vrstaOdsustva} - ${selectedOdsustvo?.brojDana} dana?`} />
      )}
      {showSpinner && <Spinner />}
    </>
  );
};

export default OdobravanjeOdsustva;
