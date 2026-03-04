import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";

export const useUpdateCertificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await fetch(`/api/certifications/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to update certification");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["certifications", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["certifications"],
      });
    },
  });
};