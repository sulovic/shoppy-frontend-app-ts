import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

type FiskalniRacunData = {
  id: number;
  telefon: string;
  SMStekst: string;
  sent: boolean;
};

const Racuni = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [tableData, setTableData] = useState<FiskalniRacunData[]>([]);

  const AppName = "Slanje računa";

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await axios.get(`https://script.google.com/macros/s/AKfycbw7lZqeSyS73FmzsNFyhTiTQUVTgdUvnB-50OrYtjU-1JyqCBh3GIe0q3AXSYPXL6Ju1Q/exec`);
      if (response.data) {
        setTableData(response.data);
      }
    } catch {
      toast.warning(`Greška pri preuzimanju podataka`, { position: "top-center" });
    } finally {
      setShowSpinner(false);
    }
  };

  const updateSentSMSStatus = (id: number) => {
    const updatedData = tableData.map((item) => (item.id === id ? { ...item, sent: true } : item));
    setTableData(updatedData);
  };

  const handleSentSMS = (row: FiskalniRacunData) => {
    updateSentSMSStatus(row?.id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar AppName={AppName} Links={[]} />
      <div className="mx-2 md:mx-4">
        <h3>Aplikacija za SMS slanje računa</h3>
        <div className="mb-4 flex justify-end">
          <button type="button" className="button button-sky" aria-label="Osveži podatke" onClick={() => fetchData()}>
            Osveži podatke
          </button>
        </div>
        {tableData?.length
          ? tableData.map((row, index: number) => (
              <div key={index} className="my-3 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
                <h5 key={`racun_${index}`}>Podaci o računu:</h5>
                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                  <p key={`telefon_${index}`} className="font-medium text-sky-500 ">
                    Tel: {row?.telefon}
                  </p>
                  <p className="md:col-span-3" key={`SMStekst_${index}`}>
                    {row?.SMStekst}
                  </p>
                </div>
                <div key={`akcije_button_${index}`} className=" flex items-end justify-end gap-2">
                  <button type="button" className="button button-sky" aria-label="Pošalji SMS" disabled={row?.sent} onClick={() => handleSentSMS(row)}>
                    {row?.sent ? "SMS Poslat" : <a href={`sms:${row?.telefon}?body=${row?.SMStekst}`}>Pošalji SMS</a>}
                  </button>
                </div>
              </div>
            ))
          : !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>}
      </div>

      {showSpinner && <Spinner />}
    </>
  );
};

export default Racuni;
