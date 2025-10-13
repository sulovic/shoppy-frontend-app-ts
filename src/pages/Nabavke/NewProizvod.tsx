import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

const NewNabavkaProizvod = () => {
  const [newProizvod, setNewProizvod] = useState({
    SKU: "",
    naziv: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.post("nabavke/proizvodi", newProizvod);
      toast.success(`Proizvod ${response?.data?.naziv} je uspešno dodat!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/nabavke/proizvodi");
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške: ${error} `, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setNewProizvod(null);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/nabavke/proizvodi");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setNewProizvod((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
        <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm md:w-1/2 dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-4 ">Dodavanje novog proizvoda</h3>

            <h4 className="my-3">Podaci o proizvodu</h4>

            <div>
              <div className="mb-3">
                <label htmlFor="SKU">SKU</label>
                <input
                  type="text"
                  id="SKU"
                  aria-describedby="SKU"
                  value={newProizvod?.SKU}
                  onChange={handleChange}
                  maxLength={64}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="naziv">Naziv proizvoda</label>
                <input
                  type="text"
                  id="naziv"
                  aria-describedby="Naziv proizvoda"
                  value={newProizvod?.naziv}
                  onChange={handleChange}
                  maxLength={64}
                  required
                />
              </div>
              <div className="float-end mb-3 mt-3 flex gap-2">
                <button type="submit" className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky">
                  Dodaj novi proizvod
                </button>
              </div>
            </div>
          </form>
        </div>

        {showModal && (
          <Modal
            onOK={handleOK}
            onCancel={handleCancel}
            title="Potvrda dodavanja novog proizvoda"
            question={`Da li ste sigurni da želite da dodate novi proizvod: ${newProizvod?.naziv}`}
          />
        )}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewNabavkaProizvod;
