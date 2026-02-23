"use client";

import React from "react";
import { usePaginatedResourceQuery } from "../hooks/useResourceListQuery";

export const ListResources = () => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = usePaginatedResourceQuery(
    pagination.pageNumber,
    pagination.pageSize,
  );

  return (
    <>
      <div className="flex flex-col gap-2 border-2">
        {isLoading && <div>loading</div>}
        {isError && <div>{error.message}</div>}

        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </>
  );
};
