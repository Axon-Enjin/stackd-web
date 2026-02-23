import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCertificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete certification");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate the list so the deleted item disappears from the UI
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};