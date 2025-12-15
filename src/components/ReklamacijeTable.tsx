import { format } from "date-fns";

const ReklamacijeTable = ({
  tableData,
  handleEdit,
  handleDelete,
  handleShowFiles,
  handleForward,
}: {
  tableData: Reklamacija[];
  handleEdit: (row: Reklamacija) => void;
  handleDelete: (row: Reklamacija) => void;
  handleShowFiles: (row: Reklamacija) => void;
  handleForward: (row: Reklamacija) => void;
}) => {
  return (
    <div>
      {tableData.map((row, index) => (
        <div key={index} className="my-2 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
            <div>
              <h5 key={`reklamacija_${index}`}>Podaci o reklamaciji:</h5>
            </div>

            <p key={`brojReklamacije_${index}`} className="font-medium text-sky-500 hover:cursor-pointer hover:text-sky-400" onClick={() => handleEdit(row)}>
              {row.brojReklamacije}
            </p>
            <p key={`statusReklamacije_${index}`}>{row.statusReklamacije}</p>
            <p key={`zemljaReklamacije_${index}`}>{row.zemljaReklamacije}</p>
            <div>
              <h5 key={`kupac_${index}`}>Podaci o kupcu:</h5>
            </div>
            <p key={`imePrezime_${index}`}>{row.imePrezime}</p>
            <p key={`telefon_${index}`}>{row.telefon}</p>
            <p key={`email_${index}`}>{row.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            <div>
              <h5 key={`proizvod_${index}`}>Podaci o kupovini:</h5>
            </div>
            <p key={`datumKupovine_${index}`}>{row?.datumKupovine && format(row?.datumKupovine, "dd.MM.yyyy")}</p>
            <p key={`brojRacuna_${index}`}>{row?.brojRacuna}</p>
            <p key={`nazivProizvoda_${index}`}>{row?.nazivProizvoda}</p>
            <div>
              <h5 key={`opis_${index}`}>Opis reklamacije:</h5>
            </div>
            <p key={`opisReklamacije_${index}`} className="col-span-2 sm:col-span-3">
              {row?.datumPrijema && format(row?.datumPrijema, "dd.MM.yyyy")} - {row?.opisReklamacije}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            <div>
              <h5 key={`komentar_${index}`}>Komentar:</h5>
            </div>
            <p key={`komentar_id_${index}`} className="col-span-2 sm:col-span-3">
              {row?.komentar}
            </p>
            <div>
              <h5 key={`odluka_${index}`}>Opis odluke:</h5>
            </div>
            <p key={`opisOdluke_${index}`} className="col-span-2 sm:col-span-3">
              {row?.datumOdgovora && format(row?.datumOdgovora, "dd.MM.yyyy")} - {row?.opisOdluke}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
            <div className="col-span-2 content-center sm:col-span-4">
              <button key={`datoteke_list_${index}`} className="button button-sky" onClick={() => handleShowFiles(row)}>
                Rad sa datotekama - prikačeno {row.files ? row.files.length : "0"}
              </button>
            </div>

            <div className="col-span-2 grid grid-cols-1 content-end items-end gap-2 sm:col-span-4 sm:grid-cols-2">
              <h5 className="sm:col-span-2">Akcije:</h5>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button type="button" className="button button-red" aria-label="Delete" onClick={() => handleDelete(row)}>
                  Obriši
                </button>
                <button type="button" className="button button-sky" aria-label="Forward" onClick={() => handleForward(row)}>
                  Zavedi i prebaci u obradu
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReklamacijeTable;
