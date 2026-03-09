import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { useSupabaseAuthContext } from "@/providers/SupabaseAuthProvider";

export const useUpdateTestimonialMutation = () => {
  const queryClient = useQueryClient();
  const supabaseAuthContext = useSupabaseAuthContext();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
        },
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
