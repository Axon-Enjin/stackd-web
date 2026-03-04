import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";

export const useDeleteTeamMemberMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/team-members/${id}`, {
                method: "DELETE",
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
