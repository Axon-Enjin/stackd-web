import { useQuery } from "@tanstack/react-query";

export function usePaginatedTestimonialsQuery(
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  const query = useQuery({
    queryKey: ["testimonials", pageNumber, pageSize],
    queryFn: async () => {
      // Note: Make sure the query params match what your Next.js API route expects
      const response = await fetch(
        `/api/testimonials?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      return response.json();
    },
  });

  return query;
}