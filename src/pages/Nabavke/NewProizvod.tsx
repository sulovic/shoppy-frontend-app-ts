import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import { useAuth } from "../../hooks/useAuth";
import { NabavkeProizvodSchema } from "../../schemas/schemas";

const NewNabavkaProizvod = () => {
  const newProizvod: Omit<NabavkeProizvod, "id"> = {
    naziv: "",
    SKU: "",
  };
  const [proizvod, setProizvod] = useState<Omit<NabavkeProizvod, "id">>(newProizvod);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const proizvodiService = dataServiceBuilder<Omit<NabavkeProizvod, "id">>(axiosPrivate, authUser, "nabavke/proizvodi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleOK = async () => {
    setShowSpinner(true);

    try {
      const parsedProizvod = NabavkeProizvodSchema.omit({ id: true }).parse(proizvod);
      const response = await proizvodiService.createResource(parsedProizvod);
      const createdProizvod = response.data.data;
      toast.success(`Proizvod ${createdProizvod.naziv} je uspešno dodat!`, {
        position: "top-center",
      });
      navigate("/nabavke/proizvodi");
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowModal(false);
      setShowSpinner(false);
    }
  };

  const handleClose = () => {
    setProizvod(newProizvod);
    setShowModal(false);
    setShowSpinner(false);
    navigate("/nabavke/proizvodi");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProizvod((prev) => ({
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
                <input type="text" id="SKU" aria-describedby="SKU" value={proizvod?.SKU} onChange={handleChange} maxLength={64} required />
              </div>
              <div className="mb-3">
                <label htmlFor="naziv">Naziv proizvoda</label>
                <input type="text" id="naziv" aria-describedby="Naziv proizvoda" value={proizvod?.naziv} onChange={handleChange} maxLength={64} required />
              </div>
              <div className="float-end mb-3 mt-3 flex gap-2">
                <button type="button" className="button button-gray" onClick={handleClose}>
                  Odustani
                </button>
                <button type="submit" className="button button-sky" disabled={showSpinner}>
                  {showSpinner ? "Dodavanje..." : "Dodaj"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {showModal && <Modal onOK={handleOK} onCancel={handleCancel} title="Potvrda dodavanja novog proizvoda" question={`Da li ste sigurni da želite da dodate novi proizvod: ${proizvod?.naziv}`} />}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
};

export default NewNabavkaProizvod;
