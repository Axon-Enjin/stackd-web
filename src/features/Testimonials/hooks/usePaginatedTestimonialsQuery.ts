import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/lib/clientApi";

export function usePaginatedTestimonialsQuery(
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: ["testimonials", pageNumber, pageSize],
    queryFn: async () => {
      const response = await apiFetch(
        `/api/testimonials?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      return response.json();
    },
    placeholderData: keepPreviousData,
  });
}