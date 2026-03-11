import { useQuery } from "@tanstack/react-query";

export type TestimonialItem = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  body: string;
  rankingIndex: number;
};

export function useAllTestimonialsQuery() {
  return useQuery<TestimonialItem[]>({
    queryKey: ["testimonials", "all"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials?all=true");
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      const json = await response.json();
      return json.data as TestimonialItem[];
    },
  });
}
