import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { sampleResourceRow } from "../SampleFeature.types";

export function usePaginatedResourceQuery(
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  const query = useQuery ({
    queryKey: ["test_resources", pageNumber, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `/api/testResource?page=${pageNumber}&pageSize=${pageSize}`,
      );
      return response.json();
    },
  });

  return query
}
