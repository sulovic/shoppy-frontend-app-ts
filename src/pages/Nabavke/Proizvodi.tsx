import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import ModalEditProizvod from "./ModalEditProizvod";
import { useAuth } from "../../hooks/useAuth";

const NabavkeProizvodi = () => {
  const [tableData, setTableData] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedProizvod, setSelectedProizvod] = useState({});
  const [updateData, setUpdateData] = useState(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(`nabavke/proizvodi?sortBy=naziv&sortOrder=asc`);
      setTableData(response?.data);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setUpdateData(row);
    setShowModalEdit(true);
  };

  const handleDelete = (row) => {
    setSelectedProizvod(row);
    setShowModal(true);
  };

  const handleDeleteOK = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.delete(`nabavke/proizvodi/${selectedProizvod?.id}`);
      toast.success(`Proizvod ${selectedProizvod?.naziv} je uspešno obrisan!`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
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
    setSelectedProizvod({});
    setShowModal(false);
    setShowSpinner(false);
  };

  return (
    <>
      <h3 className="mt-4">Proizvodi</h3>
      <div className="flex justify-end px-3">
        <button type="button" className="button button-sky " aria-label="Nov proizvod" onClick={() => navigate("/nabavke/nov-proizvod")}>
          Dodaj novi proizvod
        </button>
      </div>
      {tableData ? (
        <>
          <div>
            <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
              <div className="table-responsive p-3">
                <table className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
                  <thead className="text-s bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    <tr>
                      <th className="px-6 py-3">SKU</th>
                      <th className="px-6 py-3">Naziv proizvoda</th>
                      <th className="px-6 py-3">Izmeni</th>
                      <th className="px-6 py-3">Obriši</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index} className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        <td key={`SKU_${index}`}>{row?.SKU}</td>
                        <td key={`naziv_${index}`}>{row?.naziv}</td>
                        <td key={`edit_${index}`} className="text-center">
                          <button type="button" className="button button-sky float-left" aria-label="EditUser" onClick={() => handleEdit(row)}>
                            Izmeni
                          </button>
                        </td>
                        <td key={`delete_${index}`} className="text-center">
                          <button type="button" className="button button-red float-left" aria-label="Delete" disabled={!authUser?.superAdmin} onClick={() => handleDelete(row)}>
                            Obriši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {showModal && <Modal onOK={handleDeleteOK} onCancel={handleCancel} title="Potvrda brisanja vrste otpada" question={`Da li ste sigurni da želite da obrišete vrstu otpada: ${selectedProizvod?.naziv}?`} />}

                {updateData && showModalEdit && <ModalEditProizvod setShowModalEdit={setShowModalEdit} updateData={updateData} setUpdateData={setUpdateData} fetchData={fetchData} />}
              </div>
            </div>
          </div>
        </>
      ) : (
        !showSpinner && <div className="p-3">Nema podataka o proizvodima...</div>
      )}
      {showSpinner && <Spinner />}
    </>
  );
};
export default NabavkeProizvodi;
