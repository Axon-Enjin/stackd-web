import { useQuery } from "@tanstack/react-query";
// Import your specific type here, e.g., TestimonialProps

export const useTestimonialQuery = (testimonialId: string | null) => {
  const query = useQuery({
    queryKey: ["testimonials", testimonialId],
    queryFn: async () => {
      const response = await fetch(`/api/testimonials/${testimonialId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch testimonial");
      }
      return response.json();
    },
    enabled: !!testimonialId, // Only fetch if we have an ID
  });

  return query;
};