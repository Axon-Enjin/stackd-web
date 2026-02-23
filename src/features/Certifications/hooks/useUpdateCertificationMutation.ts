import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCertificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await fetch(`/api/certifications/${id}`, {
        method: "PATCH",
        body: formData,
        // Note: Do NOT set Content-Type header manually when using FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update certification");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      // 1. Invalidate the specific item query
      queryClient.invalidateQueries({ 
        queryKey: ["certifications", variables.id] 
      });
      
      // 2. Invalidate the list query to reflect changes in the table/list
      queryClient.invalidateQueries({ 
        queryKey: ["certifications"] 
      });
    },
  });
};