import { TablesInsert } from "@/types/supabase.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sampleResourceInsertDTO } from "../SampleFeature.types";

export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient();

  // MUST return the result of useMutation
  return useMutation({
    mutationFn: async (dto: sampleResourceInsertDTO) => {
      const res = await fetch("/api/testResource", {
        method: "POST",
        body: JSON.stringify(dto),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Fetch doesn't throw on 404/500, so we do it manually for TanStack Query
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create resource");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate the list query to show the new data immediately
      queryClient.invalidateQueries({ queryKey: ["test_resources"] });
    },
  });
};
