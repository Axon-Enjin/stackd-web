import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sampleResourceInsertDTO } from "../SampleFeature.types";

// Assuming your DTO or a wrapper includes the ID for the update
export const useUpdateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...dto }: sampleResourceInsertDTO & { id: string }) => {
      const res = await fetch(`/api/testResource/${id}`, {
        method: "PATCH", // Use PATCH for partial updates
        body: JSON.stringify(dto),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update resource");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      // 1. Invalidate the specific item query
      queryClient.invalidateQueries({ 
        queryKey: ["test_resources", variables.id] 
      });
      
      // 2. Invalidate the list query to reflect changes in the table/list
      queryClient.invalidateQueries({ 
        queryKey: ["test_resources"] 
      });
    },
  });
};