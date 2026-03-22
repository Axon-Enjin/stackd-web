import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { apiFetch } from "@/lib/clientApi";

export const useDeleteTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to delete testimonial");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};
