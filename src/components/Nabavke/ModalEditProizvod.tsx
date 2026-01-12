import React, { useState } from "react";
import Modal from "../Modal";
import Spinner from "../Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { NabavkeProizvodSchema } from "../../schemas/schemas";

const ModalEditProizvod = ({ row, setShowModalEdit, fetchData }: { row: NabavkeProizvod; setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>; fetchData: () => void }) => {
  const [updateData, setUpdateData] = useState<NabavkeProizvod>(row);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const proizvodiService = dataServiceBuilder<NabavkeProizvod>(axiosPrivate, authUser, "nabavke/proizvodi");

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
      const parsedProizvod = NabavkeProizvodSchema.parse(updateData);
      const response = await proizvodiService.updateResource(parsedProizvod.id, parsedProizvod);
      const updatedProizvod = response.data.data;
      toast.success(`Proizvod ${updatedProizvod?.naziv} je uspešno sačuvan!`, {
        position: "top-center",
      });
      navigate("/nabavke/proizvodi");
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSaveModal(true);
      setShowModalEdit(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="relative z-10">
      <form onSubmit={(e) => handleSave(e)}>
        <div className="fixed inset-0 bg-gray-900/80 ">
          <div className="fixed inset-0 z-10 overflow-y-auto">
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

                <div className="flex justify-end gap-2">
                  <button type="button" className="button button-gray" aria-describedby="Cancel" onClick={handleCancel}>
                    Odustani
                  </button>
                  <button type="submit" className="button button-sky" aria-describedby="Submit" disabled={showSpinner}>
                    {showSpinner ? "Čuvanje..." : "Sačuvaj"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showSpinner && <Spinner />}
        {showSaveModal && <Modal onOK={handleSaveOk} onCancel={handleCancelModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />}
      </form>
    </div>
  );
};

export default ModalEditProizvod;
