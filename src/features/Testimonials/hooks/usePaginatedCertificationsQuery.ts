import { useQuery } from "@tanstack/react-query";

export function usePaginatedCertificationsQuery(
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  const query = useQuery({
    queryKey: ["certifications", pageNumber, pageSize],
    queryFn: async () => {
      // Note: Make sure the query params match what your Next.js API route expects
      const response = await fetch(
        `/api/certifications?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }
      return response.json();
    },
  });

  return query;
}