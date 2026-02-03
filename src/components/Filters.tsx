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
              const value = e.target.value;
              setQueryParams((prev) => {
                const filters = prev.filters ?? {};
                if (filters[filterKey] === value) return prev;
                return {
                  ...prev,
                  filters: { ...filters, [filterKey]: value },
                  page: 1,
                };
              });
            }}
          >
            <option value="*">{filterKey.toUpperCase()}</option>
            {filtersOptions[filterKey].map((filterValue) => (
              <option key={filterValue} value={filterValue} aria-label={filterValue}>
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
