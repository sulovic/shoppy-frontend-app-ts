const Pagination = ({ pagination, setPagination }: PaginationProps) => {
  return (
    <div className="flex mt-4 justify-end">
      <div className="flex gap-4 justify-end content-center">
        <button type="button" className="button button-sky" aria-label="Previous Page" disabled={pagination.page === 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}>
          Prethodna
        </button>
        <h5 className="content-center">{pagination.count > 0 ? `Strana: ${pagination.page} od ${Math.ceil(pagination.count / pagination.limit)}` : `Nema podataka`}</h5>
        <button
          type="button"
          className="button button-sky"
          aria-label="Next Page"
          disabled={pagination?.page === Math.ceil(pagination.count / pagination.limit) || pagination.count === 0}
          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        >
          Sledeća
        </button>
      </div>
    </div>
  );
};

export default Pagination;
