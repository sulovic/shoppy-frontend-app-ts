const Pagination = ({ queryParams, setQueryParams, count }: { queryParams: QueryParams; setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>; count: number }) => {
  const { page = 1, limit = 20 } = queryParams;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / limit));
  const limitOptions = [10, 20, 50, 100];

  return (
    <div className="flex justify-end gap-4">
      <div className="flex gap-4 items-center">
        <button
          type="button"
          className="button button-sky"
          aria-label="Previous Page"
          disabled={page <= 1}
          onClick={() =>
            setQueryParams((prev) => ({
              ...prev,
              page: Math.max(1, prev.page - 1),
            }))
          }
        >
          Prethodna
        </button>

        <h5>{(count ?? 0) > 0 ? `Strana: ${page} od ${totalPages}` : "Nema podataka"}</h5>

        <button
          type="button"
          className="button button-sky"
          aria-label="Next Page"
          disabled={page >= totalPages || count === 0}
          onClick={() =>
            setQueryParams((prev) => ({
              ...prev,
              page: Math.min(totalPages, prev.page + 1),
            }))
          }
        >
          Sledeća
        </button>
      </div>
      <div>
        <select name="limit" value={limit} aria-label="Limit per page" onChange={(e) => setQueryParams((prev) => ({ ...prev, page: 1, limit: Number(e.target.value) }))}>
          {limitOptions.map((limitOption) => (
            <option key={limitOption} value={limitOption} aria-label={limitOption.toString()}>
              {limitOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
