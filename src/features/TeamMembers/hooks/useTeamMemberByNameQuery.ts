import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/clientApi";

export function useTeamMemberByNameQuery(name: string) {
    return useQuery({
        queryKey: ["team-members", "name", name],
        queryFn: async () => {
            const response = await apiFetch(`/api/team-members?name=${name}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error("Failed to fetch team member");
            }
            const result = await response.json();
            return result.data;
        },
        enabled: !!name,
    });
}
