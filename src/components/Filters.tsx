const Filters = ({ filtersOptions, queryParams, setQueryParams }: { filtersOptions: FiltersOptions; queryParams: QueryParams; setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>> }) => {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {/* Filters */}
      {Object.keys(filtersOptions).map((filterKey) => (
        <div key={filterKey}>
          <select
            name={filterKey}
            area-label={filterKey}
            value={queryParams.filters![filterKey]}
            onChange={(e) => {
              setQueryParams({
                ...queryParams,
                filters: { ...queryParams.filters, [filterKey]: e.target.value },
              });
            }}
          >
            <option value="*">Obriši filter</option>
            {filtersOptions[filterKey].map((filterValue) => (
              <option key={filterValue} value={filterValue}>
                {filterValue}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default Filters;
