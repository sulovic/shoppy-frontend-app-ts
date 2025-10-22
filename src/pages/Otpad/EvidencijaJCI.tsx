import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ModalEditJCI from "./ModalEditJCI";
import Modal from "../../components/Modal";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../components/Pagination";

const EvidencijaJCI: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [filter, setFilter] = useState<any>({ zemlja: "" });
  const [updateData, setUpdateData] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [pagination, setPagination] = useState<any>({ limit: 20, page: 1, count: 0 });
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(`otpad/evidencija?sortBy=datum&sortOrder=desc${filter?.zemlja !== "" ? `&zemlja=${filter?.zemlja}` : ""}&page=${pagination.page}&limit=${pagination.limit}`);
      setTableData(response?.data?.data);
      setPagination({ ...pagination, count: response?.data?.count });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [filter, pagination.page, pagination.limit]);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setPagination({ ...pagination, page: 1 });
  };

  const handleEdit = (row: any) => {
    setUpdateData(row);
    setShowModalEdit(true);
  };

  const handleDelete = (row: any) => {
    setUpdateData(row);
    setShowModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`otpad/evidencija/${updateData?.id}`);
      toast.success(`JCI broj ${updateData?.brojJci} je uspešno obrisana!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
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
          <label htmlFor="zemlja">Zemlja: </label>
          <form>
            <select id="zemlja" aria-label="Odaberi zemlju" required value={filter?.zemlja} onChange={handleChangeFilter}>
              <option value="">Sve zemlje</option>
              <option value="SRBIJA">Srbija</option>
              <option value="CRNAGORA">Crna Gora</option>
            </select>
          </form>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" className="button button-sky" aria-label="Nova JCI" onClick={() => navigate("/otpad/nova-jci")}>
            Dodaj novu JCI
          </button>
        </div>
      </div>

      {tableData?.length
        ? tableData.map((row: any, index: number) => {
            return (
              <div key={index}>
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
                      row?.jciProizvodi.map((proizvod: any, indexrs: number) => {
                        return (
                          <div key={`proizvod_${index}_${indexrs}`} className="flex flex-col items-center align-middle">
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
      {!showSpinner && <Pagination pagination={pagination} setPagination={setPagination} />}

      {showSpinner && <Spinner />}
      {showModal && <Modal onOK={handleDeleteOK} onCancel={handleCancel} title="Potvrda brisanja JCI" question={`Da li ste sigurni da želite da obrišete JCI: ${updateData?.brojJci}?`} />}
      {updateData && showModalEdit && <ModalEditJCI setShowModalEdit={setShowModalEdit} updateData={updateData} setUpdateData={setUpdateData} fetchData={fetchData} />}
    </div>
  );
};
export default EvidencijaJCI;
