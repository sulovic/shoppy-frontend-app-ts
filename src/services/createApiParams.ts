const createApiParams = (queryParams: QueryParams | null) => {
  if (!queryParams) {
    return "";
  }

  if (queryParams.page && queryParams.limit) {
    var apiParams: string = `?page=${queryParams.page}&limit=${queryParams.limit}`;
  } else {
    var apiParams: string = "?";
  }

  if (queryParams.sortBy && queryParams.sortOrder) {
    apiParams += `&sortBy=${queryParams.sortBy}&sortOrder=${queryParams.sortOrder}`;
  }

  if (queryParams.search) {
    apiParams += `&search=${queryParams.search}`;
  }

  if (queryParams.filters) {
    apiParams += `&`;
    for (const [key, value] of Object.entries(queryParams.filters)) {
      apiParams += `filters[${key}]=${value}&`;
    }
  }

  return apiParams;
};

export default createApiParams;
