import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ModalEditJCI from "../../components/Otpad/ModalEditJCI";
import Modal from "../../components/Modal";
import { useAuth } from "../../hooks/useAuth";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";

const EvidencijaJCI: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [tableData, setTableData] = useState<JciPodaci[] | null>(null);
  const [updateData, setUpdateData] = useState<JciPodaci | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { zemlja: "*", operacija: "*", godina: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "id" });
  const filtersOptions: FiltersOptions = {
    zemlja: ["SRBIJA", "CRNA_GORA"],
    operacija: ["UVOZ", "IZVOZ"],
    godina: Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 7 + i).toString()),
  };
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const jciService = dataServiceBuilder<JciPodaci>(axiosPrivate, authUser, "otpad/jci");

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const [response, jciCount] = await Promise.all([jciService.getAllResources(queryParams), jciService.getAllResourcesCount(queryParams)]);
      setTableData(response.data.data);
      setQueryParams({ ...queryParams, count: jciCount.data.count });
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

  const handleEdit = (row: JciPodaci) => {
    setUpdateData(row);
    setShowModalEdit(true);
  };

  const handleDelete = (row: JciPodaci) => {
    setUpdateData(row);
    setShowModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      if (!updateData) return;
      const response = await jciService.deleteResource(updateData?.id);
      const deletedJci = response.data.data;
      toast.success(`JCI broj ${deletedJci.brojJci} je uspešno obrisana!`, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setUpdateData(null);
      setShowModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleCancel = () => {
    setUpdateData(null);
    setShowModal(false);
    setShowSpinner(false);
  };

  return (
    <div className="mb-4">
      <h3 className="my-4">Evidencija unetih JCI</h3>
      <div className="grid grid-cols-1 justify-end gap-4 md:flex">
        <div className="flex justify-end gap-4">
          <button type="button" className="button button-sky" aria-label="Nova JCI" onClick={() => navigate("/otpad/nova-jci")}>
            Dodaj novu JCI
          </button>
        </div>
      </div>
      <div className="my-4 flex gap-4 justify-end">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>

      {tableData?.length
        ? tableData.map((row: JciPodaci) => {
            return (
              <div key={row.id}>
                <div className="my-3 grid grid-cols-1 rounded-xl bg-gray-100 p-2 shadow-sm dark:bg-gray-800 ">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    <div>
                      <h5>Podaci o JCI:</h5>
                    </div>

                    <p className="font-semibold text-sky-500 hover:text-sky-400">{row?.brojJci}</p>
                    <p>{row?.datum && format(row?.datum, "dd.MM.yyyy")}</p>
                    <p>
                      {row?.zemlja} - {row?.operacija}
                    </p>
                  </div>
                  <div className="my-2 h-0.5 bg-zinc-400"></div>

                  <div className="grid grid-cols-1">
                    <h5 className="pb-2">Artikli na JCI:</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {row &&
                      row?.jciProizvodi.map((proizvod, index) => {
                        return (
                          <div key={`proizvod_${index}`} className="flex flex-col items-center align-middle">
                            <p>{proizvod?.proizvod?.proizvod}</p>
                            <p>{proizvod?.kolicina}</p>
                          </div>
                        );
                      })}
                  </div>
                  <div className="my-2 h-0.5 bg-zinc-400"></div>
                  <div className="flex justify-end gap-2 p-2">
                    <button className="button button-green" onClick={() => handleEdit(row)}>
                      Izmeni
                    </button>
                    <button className="button button-red" disabled={!authUser?.superAdmin} onClick={() => handleDelete(row)}>
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        : !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema evidentiranih JCI...</h4>}

      <div className="flex justify-end gap-4 mb-4">
        <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>

      {showSpinner && <Spinner />}
      {showModal && <Modal onOK={handleDeleteOK} onCancel={handleCancel} title="Potvrda brisanja JCI" question={`Da li ste sigurni da želite da obrišete JCI: ${updateData?.brojJci}?`} />}
      {updateData && showModalEdit && <ModalEditJCI row={updateData} setShowModalEdit={setShowModalEdit} fetchData={fetchData} />}
    </div>
  );
};
export default EvidencijaJCI;
