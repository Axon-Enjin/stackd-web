import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { useSupabaseAuthContext } from "@/providers/SupabaseAuthProvider";

export const useCreateTestimonialMutation = () => {
  const queryClient = useQueryClient();
  const supabaseAuthContext = useSupabaseAuthContext();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
        },
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
