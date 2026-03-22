import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";
import { apiFetch } from "@/lib/clientApi";

export const useDeleteCertificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to delete certification");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};