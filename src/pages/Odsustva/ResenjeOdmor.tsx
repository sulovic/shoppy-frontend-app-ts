import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import moment from "moment";

const ResenjeOdmor: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [odsustvo, setOdsustvo] = useState<any>(null);
  const location = useLocation();
  const id = location.pathname.replace("/odsustva/resenje-odmor/", "");
  const axiosPrivate = useAxiosPrivate();

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await axiosPrivate.get(`odsustva/evidencija/${id}`);
      setOdsustvo(response?.data);
    } catch (error) {
      toast.warning(`Ne postoiji odsustvo sa brojem ${id}`, {
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

  return (
    <>
      <div className=" min-h-full bg-white p-4 text-justify dark:bg-gray-900">
        <div className=" p-4 sm:p-6 sm:pb-4 ">
          <div className="sm:flex sm:items-start">
            <div className="w-full sm:mt-0">
              <div>
                <p>Poslodavac:</p>
                <p>Business Solution Plus doo Niš</p>
                <p>Zdravke Vučković 79A, 18000 Niš</p>
                <p>MB: 20714093 PIB: 106960688</p>
              </div>

              <div className="my-6">
                <p>
                  {`Na osnovu zahteva zaposlenog ${odsustvo?.user} od ${
                    odsustvo?.start ? moment(odsustvo?.start).subtract(21, "days").format("DD.MM.YYYY") : ""
                  } godine a u skladu sa Zakonom o radu ("Službeni
                    glasnik Republike Srbije" br. 24/05, 61/05, 54/09,
                    32/13,75/14,13/2017 - odluka US, 113/2017 i 95/2018)
                    poslodavac donosi:`}
                </p>
              </div>

              <h5 className="text-center">REŠENJE O KORIŠĆENJU GODIŠNJEG ODMORA</h5>
              <div className="my-6">
                <p>
                  {`Prema planu korišćenja godišnjeg odmora zaposlenom ${odsustvo?.user} određuje se korišćenje godišnjeg odmora u trajanju od ${odsustvo?.brojDana} radnih dana.`}
                </p>
                <p>
                  {`Zaposleni će godišnji odmor u trajanju od ${odsustvo?.brojDana} radnih dana koristiti u periodu od ${odsustvo?.start ? moment(odsustvo?.start).format("DD.MM.YYYY") : ""}  godine do ${odsustvo?.end ? moment(odsustvo?.end).format("DD.MM.YYYY") : ""}  godine.`}
                </p>
                <p>Za vreme korišćenja godišnjeg odmora zaposleni ima pravo na naknadu zarade u skladu sa Zakonom.</p>
              </div>

              <h5 className="text-center">OBRAZLOŽENJE</h5>
              <div className="my-6">
                <p>
                  Na osnovu člana 68. do člana 75. Zakona o radu "(Službeni glasnik Republike Srbije" br. 24/05, 61/05,
                  54/09, 32/13,75/14,13/2017 - odluka US, 113/2017 i 95/2018) Ugovorom o radu poslodavac je utvrdio
                  kriterijume i dužinu godišnjeg odmora, te je doneto rešenje kao u dispozitivu.
                </p>
                <p>Rešenje je konačno.</p>
                <p>Pouka o pravnom leku:</p>
                <p>
                  Protiv ovog rešenja Zaposleni može pokrenuti spor pred Osnovnim sudom u Nišu u roku od 90 dana od dana
                  dostavljanja rešenja.
                </p>
                <p>Rešenje je sačinjeno u 2 primerka od kojih svaka strana zadržava po 1 primerak.</p>
              </div>

              <div className="my-6 grid grid-cols-2">
                <div className="text-start">
                  <p className="mb-6">ZAPOSLENI</p>
                  <p>______________________</p>
                  <p>{odsustvo?.user}</p>
                </div>
                <div className="text-end">
                  <p className="mb-6">POSLODAVAC</p>
                  <p>______________________</p>
                  <p>{odsustvo?.odobrioUser}, direktor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSpinner && <Spinner />}
    </>
  );
};

export default ResenjeOdmor;
