import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { apiFetch } from "@/lib/clientApi";

export const useUpdateTestimonialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const res = await apiFetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to update testimonial");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["testimonials", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["testimonials"],
      });
    },
  });
};
