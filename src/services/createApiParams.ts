const createApiParams = (queryParams: QueryParams | null) => {
  if (!queryParams) {
    return "";
  }

  let apiParams: string = "";

  if (queryParams.page && queryParams.limit) {
    apiParams = `?page=${queryParams.page}&limit=${queryParams.limit}`;
  } else {
    apiParams = "?";
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
      if (value === "*") {
        continue;
      }
      apiParams += `filters[${key}]=${value}&`;
    }
  }

  return apiParams;
};

export default createApiParams;
