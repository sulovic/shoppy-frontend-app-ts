import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import ReklamacijeTable from "../../components/Reklamacije/ReklamacijeTable";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

const PrijemReklamacija = () => {
  const [tableData, setTableData] = useState<Reklamacija[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const { authUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const reklamacijeService = dataServiceBuilder<Reklamacija>(axiosPrivate, authUser, "reklamacije");
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: { statusReklamacije: "PRIJEM" }, search: "", page: 1, limit: 20, sortOrder: "desc", sortBy: "datumPrijema" });
  const filtersOptions: FiltersOptions = {
    zemljaReklamacije: ["SRBIJA", "CRNA_GORA"],
    // statusReklamacije: ["PRIJEM", "OBRADA", "OPRAVDANA", "NEOPRAVDANA", "DODATNI_ROK"],
  };

  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const [response, reklamacijeCount] = await Promise.all([reklamacijeService.getAllResources(queryParams), reklamacijeService.getAllResourcesCount(queryParams)]);
      setTableData(response.data.data);
      setQueryParams({ ...queryParams, count: reklamacijeCount.data.count });
    } catch (error) {
      handleCustomErrors(error as string);
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
      <h3 className="mt-4">Reklamacije u prijemu</h3>
      <div className="mb-4 flex justify-end">
        <button type="button" className="button button-sky " aria-label="Nova Reklamacija" onClick={() => navigate("/reklamacije/nova-reklamacija")}>
          Nova reklamacija
        </button>
      </div>
      <div className="mb-4 flex gap-4 justify-end">
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
      {showSpinner ? <Spinner /> : tableData.length ? <ReklamacijeTable tableData={tableData} fetchData={fetchData} /> : <h4 className="my-4 text-zinc-600 ">Nema reklamacija koje su u prijemu...</h4>}
      <div className="flex justify-end gap-4 mb-4">
        <Pagination queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
    </>
  );
};

export default PrijemReklamacija;
