import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { handleCustomErrors } from "../../services/errorHandler";
import dataServiceBuilder from "../../services/dataService";
import Filters from "../../components/Filters";

export type PregledData = {
  [key: string]: { NACRT: number; PROIZVODNJA: number; TRANZIT: number; PRIMLJENA: number };
};

const Pregled = () => {
  const [tableData, setTableData] = useState<PregledData | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const porudzbineService = dataServiceBuilder<Porudzbina>(axiosPrivate, authUser, "nabavke/porudzbine");
  const proizvodiService = dataServiceBuilder<NabavkeProizvod>(axiosPrivate, authUser, "nabavke/proizvodi");
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { status: "*", zemlja: "*" }, page: 1, limit: 20, sortOrder: "desc", sortBy: "id" });

  const filtersOptions: FiltersOptions = {
    zemlja: ["SRBIJA", "CRNA_GORA"],
    status: ["NACRT", "PROIZVODNJA", "TRANZIT", "PRIMLJENA"],
  };

  const fetchData = async () => {
    setShowSpinner(true);

    try {
      const [
        {
          data: { data: porudzbine },
        },
        {
          data: { data: proizvodi },
        },
      ] = await Promise.all([porudzbineService.getAllResources(queryParams), proizvodiService.getAllResources(null)]);

      const allPorudzbineData: PregledData = {};
      proizvodi.forEach((proizvod) => {
        allPorudzbineData[proizvod.naziv] = {
          NACRT: 0,
          PROIZVODNJA: 0,
          TRANZIT: 0,
          PRIMLJENA: 0,
        };
        porudzbine.forEach((porudzbina) => {
          porudzbina.sadrzaj.forEach((sadrzaj) => {
            if (sadrzaj.proizvod.naziv == proizvod.naziv) {
              allPorudzbineData[proizvod.naziv][porudzbina.status] += sadrzaj.kolicina;
            }
          });
        });
      });

      setTableData(allPorudzbineData);
    } catch (error) {
      handleCustomErrors(error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.filters, queryParams.search, queryParams.page, queryParams.limit, queryParams.sortOrder, queryParams.sortBy]);

  return (
    <>
      <h3 className="my-4 ">Pregled porudžbina po proizvodima</h3>
      <div className="my-4 flex gap-4 justify-end">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>

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
                sum > 0 && (
                  <tr className="text-center" key={key}>
                    <td className="text-start">{key}</td>
                    <td>{nacrt}</td>
                    <td>{proizvodnja}</td>
                    <td>{tranzit}</td>
                    <td>{primljena}</td>
                    <td>{sum}</td>
                  </tr>
                )
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
};

export default Pregled;
