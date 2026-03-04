import { useQuery, keepPreviousData } from "@tanstack/react-query";

export function usePaginatedTeamMembersQuery(
    pageNumber: number = 1,
    pageSize: number = 10,
) {
    return useQuery({
        queryKey: ["team-members", pageNumber, pageSize],
        queryFn: async () => {
            const response = await fetch(
                `/api/team-members?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch team members");
            }
            return response.json();
        },
        placeholderData: keepPreviousData,
    });
}
