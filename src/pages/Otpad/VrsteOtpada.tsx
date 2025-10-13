import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ModalEditVrstaOtpada from "./ModalEditVrstaOtpada";
import Modal from "../../components/Modal";
import { useAuth } from "../../Context/AuthContext";

const VrsteOtpada: React.FC = () => {
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedVrstaOtpada, setSelectedVrstaOtpada] = useState<any>({});
  const [updateData, setUpdateData] = useState<any | null>(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(`otpad/vrste-otpada`);
      setTableData(response?.data);
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

  const handleEdit = (row: any) => {
    setUpdateData(row);
    setShowModalEdit(true);
  };

  const handleDelete = (row: any) => {
    setSelectedVrstaOtpada(row);
    setShowModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`otpad/vrste-otpada/${selectedVrstaOtpada?.id}`);
      toast.success(`Vrsta otpada ${selectedVrstaOtpada?.vrstaOtpada} je uspešno obrisana!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error: any) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleCancel = () => {
    setSelectedVrstaOtpada({});
    setShowModal(false);
    setShowSpinner(false);
  };

  return (
    <>
      <h3 className="mt-4">Vrste otpada</h3>
      <div className="flex justify-end px-3">
        <button
          type="button"
          className="button button-sky "
          aria-label="Nova vrsta otpada"
          onClick={() => navigate("/otpad/nova-vrsta-otpada")}>
          Dodaj novu vrstu otpada
        </button>
      </div>
      {tableData?.length ? (
        <>
          <div>
            <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
              <div className="table-responsive p-3">
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
                    {tableData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        <td key={`id${index}`}>{index + 1}</td>
                        <td key={`vrstaOtpada_${index}`}>{row?.vrstaOtpada}</td>
                        <td key={`edit_${index}`} className="text-center">
                          <button
                            type="button"
                            className="button button-sky float-left"
                            aria-label="EditUser"
                            onClick={() => handleEdit(row)}>
                            Izmeni
                          </button>
                        </td>
                        <td key={`delete_${index}`} className="text-center">
                          <button
                            type="button"
                            className="button button-red float-left"
                            aria-label="Delete"
                            disabled={!authUser?.superAdmin}
                            onClick={() => handleDelete(row)}>
                            Obriši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {showModal && (
                  <Modal
                    onOK={handleDeleteOK}
                    onCancel={handleCancel}
                    title="Potvrda brisanja vrste otpada"
                    question={`Da li ste sigurni da želite da obrišete vrstu otpada: ${selectedVrstaOtpada?.vrstaOtpada}?`}
                  />
                )}

                {updateData && showModalEdit && (
                  <ModalEditVrstaOtpada
                    setShowModalEdit={setShowModalEdit}
                    updateData={updateData}
                    setUpdateData={setUpdateData}
                    fetchData={fetchData}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        !showSpinner && <div className="p-3">Nemate podataka o vrstama otpada...</div>
      )}
      {showSpinner && <Spinner />}
    </>
  );
};
export default VrsteOtpada;
