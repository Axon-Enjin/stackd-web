import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";

export const useCreateTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to create testimonial");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};