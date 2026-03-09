import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { useSupabaseAuthContext } from "@/providers/SupabaseAuthProvider";

export const useDeleteTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  const supabaseAuthContext = useSupabaseAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/team-members/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
        },
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to delete team member");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};
