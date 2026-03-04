import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";

export const useCreateTeamMemberMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await fetch("/api/team-members", {
                method: "POST",
                body: formData,
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
