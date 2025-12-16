import { format } from "date-fns";
import { useState } from "react";
import HandleFiles from "./HandleFiles";
import ReklamacijeActions from "./ReklamacijeActions";

const ReklamacijeTable = ({ tableData, fetchData }: { tableData: Reklamacija[]; fetchData: () => void }) => {
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const [selectedRowFiles, setSelectedRowFiles] = useState<Reklamacija | null>(null);

  const handleShowFiles = (row: Reklamacija) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  return (
    <>
      <div>
        {tableData.map((row, index) => (
          <div key={index} className="my-2 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
              <div>
                <h5>Podaci o reklamaciji:</h5>
              </div>

              <p className="font-medium text-sky-500 hover:cursor-pointer hover:text-sky-400">{row.brojReklamacije}</p>
              <p>{row.statusReklamacije}</p>
              <p>{row.zemljaReklamacije}</p>
              <div>
                <h5>Podaci o kupcu:</h5>
              </div>
              <p>{row.imePrezime}</p>
              <p>{row.telefon}</p>
              <p>{row.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
              <div>
                <h5>Podaci o kupovini:</h5>
              </div>
              <p> {row?.datumKupovine && format(row?.datumKupovine, "dd.MM.yyyy")}</p>
              <p>{row?.brojRacuna}</p>
              <p>{row?.nazivProizvoda}</p>
              <div>
                <h5>Opis reklamacije:</h5>
              </div>
              <p className="col-span-2 sm:col-span-3">
                {row?.datumPrijema && format(row?.datumPrijema, "dd.MM.yyyy")} - {row?.opisReklamacije}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
              <div>
                <h5>Komentar:</h5>
              </div>
              <p className="col-span-2 sm:col-span-3">{row?.komentar}</p>
              <div>
                <h5>Opis odluke:</h5>
              </div>
              <p className="col-span-2 sm:col-span-3">
                {row?.datumOdgovora && format(row?.datumOdgovora, "dd.MM.yyyy")} - {row?.opisOdluke}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
              <div className="col-span-2 content-center sm:col-span-4">
                <button className="button button-sky" onClick={() => handleShowFiles(row)}>
                  Rad sa datotekama - prikačeno {row.files ? row.files.length : "0"}
                </button>
              </div>
              <ReklamacijeActions row={row} fetchData={fetchData} />
            </div>
          </div>
        ))}
      </div>
      {showHandleFiles && <HandleFiles url="reklamacije" id={selectedRowFiles!.idReklamacije!} data={selectedRowFiles!} fetchData={fetchData} setShowHandleFiles={setShowHandleFiles} />}
    </>
  );
};

export default ReklamacijeTable;
