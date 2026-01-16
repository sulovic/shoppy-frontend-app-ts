import { useEffect, useState } from "react";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import ModalEditPorudzbina from "./ModalEditPorudzbina";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import HandleFiles from "../../components/HandleFiles";
import { useNavigate } from "react-router-dom";
import SadrzajPorudzbine from "../../components/Nabavke/SadrzajPorudzbine";
import { useAuth } from "../../hooks/useAuth";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";

const AktivnePorudzbine = () => {
  const [tableData, setTableData] = useState<Porudzbina[] | null>(null);
  const [selectedRowFiles, setSelectedRowFiles] = useState<Porudzbina | null>(null);
  const [selectedRowSadrzaj, setSelectedRowSadrzaj] = useState<Porudzbina | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHandleFiles, setShowHandleFiles] = useState(false);
  const [showSadrzaj, setShowSadrzaj] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [updateData, setUpdateData] = useState<Porudzbina | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const porudzbineService = dataServiceBuilder<Porudzbina>(axiosPrivate, authUser, "nabavke/porudzbine");
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { status: "*", zemlja: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "id" });
  const filtersOptions: FiltersOptions = {
    zemlja: ["SRBIJA", "CRNA_GORA"],
    status: ["NACRT", "PROIZVODNJA", "TRANZIT", "PRIMLJENA"],
  };

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await porudzbineService.getAllResources(queryParams);
      setTableData(response?.data.data);
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.filters, queryParams.search, queryParams.page, queryParams.limit, queryParams.sortOrder, queryParams.sortBy]);

  const handleEdit = (row: Porudzbina) => {
    setUpdateData(row);
    setShowEditModal(true);
  };
  const handleDelete = (row: Porudzbina) => {
    setUpdateData(row);
    setShowDeleteModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      if (!updateData) return;
      await axiosPrivate.delete(`nabavke/porudzbine/${updateData?.id}`);

      if (updateData?.files && updateData?.files.length > 0) {
        await axiosPrivate.delete(`uploads/nabavke/porudzbine`, {
          data: { files: updateData?.files },
        });
      }

      toast.success("Porudžebina je uspešno obrisana!", {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowDeleteModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setShowSpinner(false);
  };

  const handleShowFiles = (row: Porudzbina) => {
    setSelectedRowFiles(row);
    setShowHandleFiles(true);
  };

  const handleShowSadrzaj = (row: Porudzbina) => {
    setSelectedRowSadrzaj(row);
    setShowSadrzaj(true);
  };

  return (
    <>
      <h3 className="my-4 ">Pregled aktivnih porudžebina</h3>
      <div className="mb-4 flex justify-end">
        <button type="button" className="button button-sky " aria-label="Nova porudžebina" onClick={() => navigate("/nabavke/nova-porudzbina")}>
          Nova porudžbina
        </button>
      </div>
      <div className="mb-4 flex gap-4 justify-end">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
      {tableData ? (
        <div>
          {tableData.map((row, index) => (
            <div key={index} className="my-3 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
              <div>
                <h5>Podaci o porudžbini:</h5>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                  <h5>Pro/Faktura:</h5>
                  <p key={`proFaktura_${index}`}>{row?.proFaktura}</p>
                  <h5>Dobavljač:</h5>
                  <p key={`dobavljac_${index}`}>{row?.dobavljac}</p>
                  <h5>Zemlja:</h5>
                  <p key={`zemlja_${index}`}>{row?.zemlja}</p>
                  <h5>Status:</h5>
                  <p key={`status_${index}`}>{row?.status}</p>
                </div>
              </div>

              <div className="mt-4">
                <h5>Podaci o kontejneru:</h5>
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                  <h5>Broj kontejnera:</h5>
                  <p key={`brojKontejnera_${index}`}>{row?.brojKontejnera}</p>
                  <h5>Špediter:</h5>
                  <p key={`spediter_${index}`}>{row?.spediter}</p>
                  <h5>Datum porudžebine:</h5>
                  <p key={`datumPorudzbine_${index}`}>{row?.datumPorudzbine && format(row?.datumPorudzbine, "dd.MM.yyyy")}</p>
                  <h5>Datum polaska:</h5>
                  <p key={`datumPolaska_${index}`}>{row?.datumPolaska && format(row?.datumPolaska, "dd.MM.yyyy")}</p>
                  <h5>Datum prijema:</h5>
                  <p key={`datumPrijema_${index}`}>{row?.datumPrijema && format(row?.datumPrijema, "dd.MM.yyyy")}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
                <h5>Komentar:</h5>
                <p className="xl:grid-span-7 md:col-span-3" key={`komentar_${index}`}>
                  {row?.komentar}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                <div className="content-center sm:col-span-2">
                  <button key={`datoteke_list_${index}`} className="button button-sky" onClick={() => handleShowFiles(row)}>
                    Rad sa datotekama - prikačeno {row.files ? row?.files.length : "0"}
                  </button>
                </div>
                <div className="content-center sm:col-span-2">
                  <button key={`sadrzaj_${index}`} className="button button-sky" onClick={() => handleShowSadrzaj(row)}>
                    Sadržaj kontejnera - {row.sadrzaj ? row.sadrzaj.reduce((a, b) => a + b.kolicina, 0) : 0} kom
                  </button>
                </div>

                <div className="col-span-2 grid grid-cols-1 content-end items-end gap-2 sm:col-span-4 sm:grid-cols-2">
                  <h5 className="sm:col-span-2">Akcije:</h5>
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <button type="button" className="button button-sky" aria-label="Izmeni" onClick={() => handleEdit(row)}>
                      Izmeni
                    </button>
                    <button type="button" className="button button-red" aria-label="Obriši" disabled={!authUser?.superAdmin} onClick={() => handleDelete(row)}>
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nemate aktivne porudžbine...</h4>
      )}
      <div className="flex justify-end gap-4 mb-4">
        <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
      {selectedRowFiles && showHandleFiles && <HandleFiles url="nabavke/porudzbine" id={selectedRowFiles.id} dataWithFiles={selectedRowFiles} fetchData={fetchData} setShowHandleFiles={setShowHandleFiles} />}
      {selectedRowSadrzaj && showSadrzaj && <SadrzajPorudzbine porudzbina={selectedRowSadrzaj} setShowSadrzaj={setShowSadrzaj} fetchData={fetchData} />}
      {showSpinner && <Spinner />}
      {showDeleteModal && <Modal onOK={handleDeleteOK} onCancel={handleDeleteCancel} title="Potvrda brisanja porudžebine" question={`Da li ste sigurni da želite da obrišete porudžebinu: ${updateData?.id}?`} />}

      {updateData && showEditModal && <ModalEditPorudzbina setShowEditModal={setShowEditModal} updateData={updateData} setUpdateData={setUpdateData} fetchData={fetchData} />}
    </>
  );
};

export default AktivnePorudzbine;
