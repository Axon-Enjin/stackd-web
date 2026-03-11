import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toTeamSlug } from "@/lib/utils";

export function usePaginatedTeamMembersQuery(
    pageNumber: number = 1,
    pageSize: number = 10,
) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["team-members", pageNumber, pageSize],
        queryFn: async () => {
            const response = await fetch(
                `/api/team-members?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch team members");
            }

            const result = await response.json();

            // Cache each member individually so the detail view or any hook requesting a single member by ID gets an instant cache hit
            if (result?.data && Array.isArray(result.data)) {
                result.data.forEach((member: any) => {
                    // Cache by ID
                    queryClient.setQueryData(["team-members", member.id], {
                        message: "GET teamMember (cached from list)",
                        data: member
                    });

                    // Cache by Name/Slug
                    const slug = toTeamSlug(member.firstName, member.lastName);
                    queryClient.setQueryData(["team-members", "name", slug], member);
                });
            }

            return result;
        },
        placeholderData: keepPreviousData,
    });
}
