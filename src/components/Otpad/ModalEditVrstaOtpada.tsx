import React, { useState } from "react";
import Modal from "../Modal";
import Spinner from "../Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { VrstaOtpadaSchema } from "../../schemas/schemas";

const ModalEditVrstaOtpdada = ({ row, setShowModalEdit, fetchData }: { row: VrstaOtpada; setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>; fetchData: () => void }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [updateData, setUpdateData] = useState<VrstaOtpada>(row);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const vrsteOtpadaService = dataServiceBuilder<VrstaOtpada>(axiosPrivate, authUser, "otpad/vrste-otpada");

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
      const parsedVrstaOtpada = VrstaOtpadaSchema.parse(updateData);
      const response = await vrsteOtpadaService.updateResource(parsedVrstaOtpada.id, parsedVrstaOtpada);
      const updatedVrstaOtpada = response.data.data;
      toast.success(`Vrsta otpada ${updatedVrstaOtpada.vrstaOtpada} je uspešno sačuvana!`, {
        position: "top-center",
      });
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSaveModal(true);
      setShowModalEdit(false);
      setShowSpinner(false);
      fetchData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData((prev: VrstaOtpada) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      {updateData && (
        <div className="relative z-10">
          <form onSubmit={(e) => handleSave(e)}>
            <div className="fixed inset-0 bg-gray-900/80 ">
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all sm:p-8 dark:bg-gray-800">
                    <div className="w-full sm:mt-0">
                      <h4>Izmena vrste otpada</h4>
                      <div className="my-4 h-0.5 bg-zinc-400"></div>
                      <div className="grid grid-cols-1">
                        <h4>Podaci o vrsti otpada</h4>
                        <div>
                          <div className="col-lg-12 mb-3">
                            <label htmlFor="vrstaOtpada">Vrsta otpada</label>
                            <input value={updateData?.vrstaOtpada} type="text" id="vrstaOtpada" aria-describedby="Vrsta otpada" required onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                      <div className="my-4 h-0.5 bg-zinc-400"></div>
                    </div>
                    <div className="flex flex-row-reverse gap-2">
                      <button type="submit" className="button button-sky" aria-describedby="Submit">
                        Sačuvaj
                      </button>
                      <button type="button" className="button button-gray" aria-describedby="Cancel" onClick={handleCancel}>
                        Odustani
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {showSpinner && <Spinner />}
          {showSaveModal && <Modal onOK={handleSaveOk} onCancel={handleCancelModal} title="Sačuvati izmene" question="Da li ste sigurni da želite da sačuvate izmene koje ste uneli?" />}
        </div>
      )}
    </>
  );
};

export default ModalEditVrstaOtpdada;
