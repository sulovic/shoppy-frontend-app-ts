import React, { useState } from "react";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ModalEditProizvod: React.FC<any> = ({ setShowModalEdit, updateData, setUpdateData, fetchData }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleCancelModal = () => {
    setShowSaveModal(false);
    setShowSpinner(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const handleCancel = () => {
    setShowModalEdit(false);
    setShowSpinner(false);
  };

  const handleSaveOk = async () => {
    setShowSpinner(true);
    try {
      await axiosPrivate.put(`nabavke/proizvodi/${updateData?.id}`, updateData);
      toast.success(`Proizvod ${updateData?.naziv} je uspešno sačuvan!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/nabavke/proizvodi");
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowSaveModal(true);
      setShowModalEdit(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData((prev: any) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="relative z-10">
      <form onSubmit={(e) => handleSave(e)}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
              <div className="w-full sm:mt-0">
                <h4>Izmena proizvoda</h4>
                <div className="my-4 h-0.5 bg-zinc-400"></div>

                <div className="grid grid-cols-1">
                  <h4>Podaci o proizvodu</h4>

                  <div>
                    <div className="col-lg-12 mb-3">
                      <label htmlFor="SKU">SKU</label>
                      <input type="text" id="SKU" aria-describedby="SKU" value={updateData?.SKU} onChange={handleChange} maxLength={64} required />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label htmlFor="naziv">Naziv proizvoda</label>
                      <input type="text" id="naziv" aria-describedby="Naziv proizvoda" value={updateData?.naziv} onChange={handleChange} maxLength={64} required />
                    </div>
                  </div>
                </div>
                <div className="my-4 h-0.5 bg-zinc-400"></div>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <button type="submit" className="button button-sky">Sačuvaj</button>
                <button type="button" className="button button-gray" onClick={handleCancel}>Odustani</button>
              </div>
            </div>
          </div>
        </div>
        {showSpinner && <Spinner />}
        {showSaveModal && (
          <Modal onOK={handleSaveOk} onCancel={handleCancelModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />
        )}
      </form>
    </div>
  );
};

export default ModalEditProizvod;
