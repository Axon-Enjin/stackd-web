import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { useSupabaseAuthContext } from "@/providers/SupabaseAuthProvider";

export const useCreateTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  const supabaseAuthContext = useSupabaseAuthContext();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/team-members", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${supabaseAuthContext.supabaseAccessToken}`,
        },
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to create team member");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};
