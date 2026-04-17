import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import dataServiceBuilder from "../../services/dataService";
import { handleCustomErrors } from "../../services/errorHandler";
import RacuniTable from "../../components/Racuni/RacuniTable";
import { useAuth } from "../../hooks/useAuth";
import Filters from "../../components/Filters";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import useRacuniApi from "../../hooks/useRacuniApi";
import DatePicker from "react-datepicker";

const PregledRacuna = () => {
  const [tableData, setTableData] = useState<FiscalReceipt[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [count, setCount] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const { authUser } = useAuth();
  const axiosPrivate = useRacuniApi();
  const racuniService = dataServiceBuilder<FiscalReceipt>(axiosPrivate, authUser, "racuni/racuni-admin");
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<QueryParams>({ filters: {}, page: 1, limit: 20, sortOrder: "desc", sortBy: "receiptIssueDate" });
  const filtersOptions: FiltersOptions = {
    country: ["SRBIJA", "CRNA_GORA"],
  };
  const fetchData = async () => {
    setShowSpinner(true);
    try {
      const response = await racuniService.getAllResources(queryParams);
      console.log(response);
      setTableData(response.data.data);
      setCount(response.data.count);
    } catch (error) {
      handleCustomErrors(error as string);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  return (
    <>
      <h3 className="mt-4">Pregled Fiskalnih računa</h3>
      {authUser && authUser.roleId > 6000 && (
        <div className="mb-4 flex justify-end">
          <button type="button" className="button button-sky " aria-label="Nova Reklamacija" onClick={() => navigate("/racuni/nov-racun")}>
            Ručno dodavanje računa
          </button>
        </div>
      )}
      <div className="mb-4 flex gap-4 justify-end">
        <DatePicker
          selected={date}
          onChange={(d) => {
            setDate(d);
            setQueryParams({ ...queryParams, filters: { ...queryParams.filters, receiptIssueDate: d ? d.toISOString().slice(0, 10) : "" } });
          }}
          dateFormat="dd.MM.yyyy"
        />
        <Filters filtersOptions={filtersOptions} queryParams={queryParams} setQueryParams={setQueryParams} />
        <Search queryParams={queryParams} setQueryParams={setQueryParams} />
      </div>
      {showSpinner ? <Spinner /> : tableData.length ? <RacuniTable tableData={tableData} setTableData={setTableData} /> : <h4 className="my-4 text-zinc-600 ">Nema računa za prikaz...</h4>}
      <div className="flex justify-end gap-4 mb-4">
        <Pagination queryParams={queryParams} setQueryParams={setQueryParams} count={count} />
      </div>
    </>
  );
};

export default PregledRacuna;
