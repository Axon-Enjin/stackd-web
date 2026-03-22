import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/lib/clientApi";

export function usePaginatedCertificationsQuery(
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: ["certifications", pageNumber, pageSize],
    queryFn: async () => {
      const response = await apiFetch(
        `/api/certifications?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }
      return response.json();
    },
    placeholderData: keepPreviousData,
  });
}