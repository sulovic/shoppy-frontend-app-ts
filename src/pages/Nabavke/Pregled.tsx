import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";

function Pregled() {
  const [tableData, setTableData] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const authUser = useAuth();

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const response = await axiosPrivate.get(`nabavke/sadrzaj`);
      const groupedData = response.data.reduce((acc, item) => {
        const naziv = item.proizvod.naziv;
        const status = item.porudzbina.status;

        if (!acc[naziv]) {
          acc[naziv] = {};
        }

        if (!acc[naziv][status]) {
          acc[naziv][status] = 0;
        }

        acc[naziv][status] += item.kolicina;
        return acc;
      }, {} as Record<string, Record<string, number>>);
      setTableData(groupedData);
    } catch (error) {
      toast.error(`UPS!!! Došlo je do greške pri preuzimanju podataka: ${error} `, {
        position: "",
      });
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h3 className="my-4 ">Pregled porudžbina po proizvodima</h3>
      {tableData ? (
        <table className="w-full text-left text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
          <thead className="text-s bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">Naziv proizvoda</th>
              <th className="px-6 py-3">Nacrt</th>
              <th className="px-6 py-3">Proizvodnja</th>
              <th className="px-6 py-3">Traznit</th>
              <th className="px-6 py-3">Primljeno</th>
              <th className="px-6 py-3">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tableData).map(([key, value]) => {
              const nacrt = value?.NACRT ?? 0;
              const proizvodnja = value?.PROIZVODNJA ?? 0;
              const tranzit = value?.TRANZIT ?? 0;
              const primljena = value?.PRIMLJENA ?? 0;
              const sum = nacrt + proizvodnja + tranzit + primljena;

              return (
                <tr className="text-center" key={key}>
                  <td className="text-start">{key}</td>
                  <td>{nacrt}</td>
                  <td>{proizvodnja}</td>
                  <td>{tranzit}</td>
                  <td>{primljena}</td>
                  <td>{sum}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !showSpinner && <h4 className="my-4 text-zinc-600 ">Nema podataka o porudžbinama...</h4>
      )}
      {showSpinner && <Spinner />}
    </>
  );
}

export default Pregled;
