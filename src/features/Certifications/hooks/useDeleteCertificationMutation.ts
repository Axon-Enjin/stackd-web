import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { useSupabaseAuthContext } from "@/providers/SupabaseAuthProvider";

export const useDeleteCertificationMutation = () => {
  const queryClient = useQueryClient();
    const supabaseAuthContext = useSupabaseAuthContext(); 

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
        }
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to delete certification");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};