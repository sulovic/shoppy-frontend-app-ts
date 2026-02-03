import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ModalEditVrstaOtpada from "../../components/Otpad/ModalEditVrstaOtpada";
import Modal from "../../components/Modal";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

const VrsteOtpada: React.FC = () => {
  const [tableData, setTableData] = useState<VrstaOtpada[] | null>();
  const [count, setCount] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [updateData, setUpdateData] = useState<VrstaOtpada | null>(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const [queryParams, setQueryParams] = useState<QueryParams>({ page: 1, limit: 20, sortOrder: "desc", sortBy: "id" });
  const vrsteOtpadaService = dataServiceBuilder<VrstaOtpada>(axiosPrivate, authUser, "otpad/vrste-otpada");

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const [response, vrsteOtpdaCount] = await Promise.all([vrsteOtpadaService.getAllResources(queryParams), vrsteOtpadaService.getAllResourcesCount(queryParams)]);
      setCount(vrsteOtpdaCount.data.count);
      setTableData(response.data.data);
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);
  const handleEdit = (row: VrstaOtpada) => {
    setUpdateData(row);
    setShowModalEdit(true);
  };

  const handleDelete = (row: VrstaOtpada) => {
    setUpdateData(row);
    setShowModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      if (!updateData) return;
      const response = await vrsteOtpadaService.deleteResource(updateData.id);
      const deletedVrstaOtpada = response.data.data;

      toast.success(`Vrsta otpada ${deletedVrstaOtpada.vrstaOtpada} je uspešno obrisana!`, {
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
    <>
      <h3 className="mt-4">Vrste otpada</h3>
      <div className="flex justify-end px-3">
        <button type="button" className="button button-sky " aria-label="Nova vrsta otpada" onClick={() => navigate("/otpad/nova-vrsta-otpada")}>
          Dodaj novu vrstu otpada
        </button>
      </div>
      <div className="mt-4 flex justify-end">
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
      {showSpinner ? (
        <Spinner />
      ) : tableData?.length ? (
        <>
          <div>
            <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
              <div className="table-responsive ">
                <table className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                  <thead className="text-s bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    <tr>
                      <th className="px-6 py-3">Redni broj</th>
                      <th className="px-6 py-3">Vrsta otpada</th>
                      <th className="px-6 py-3">Izmeni</th>
                      <th className="px-6 py-3">Obriši</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id} className="border-b bg-white hover:bg-zinc-100! dark:border-zinc-700 dark:bg-zinc-800">
                        <td>{row?.id}</td>
                        <td>{row?.vrstaOtpada}</td>
                        <td className="text-center">
                          <button type="button" className="button button-sky float-left" aria-label="EditUser" onClick={() => handleEdit(row)}>
                            Izmeni
                          </button>
                        </td>
                        <td className="text-center">
                          <button type="button" className="button button-red float-left" aria-label="Delete" disabled={!authUser?.superAdmin} onClick={() => handleDelete(row)}>
                            Obriši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-4 my-4">
                <Pagination queryParams={queryParams} setQueryParams={setQueryParams} count={count} />
              </div>
            </div>
          </div>
          {showModal && <Modal onOK={handleDeleteOK} onCancel={handleCancel} title="Potvrda brisanja vrste otpada" question={`Da li ste sigurni da želite da obrišete vrstu otpada: ${updateData?.vrstaOtpada}?`} />}

          {updateData && showModalEdit && <ModalEditVrstaOtpada row={updateData} setShowModalEdit={setShowModalEdit} fetchData={fetchData} />}
        </>
      ) : (
        <div className="p-3">Nemate podataka o vrstama otpada...</div>
      )}
    </>
  );
};
export default VrsteOtpada;
