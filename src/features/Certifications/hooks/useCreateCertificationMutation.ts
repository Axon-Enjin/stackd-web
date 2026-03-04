import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractApiError } from "@/lib/apiError";

export const useCreateCertificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/certifications", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw await extractApiError(res, "Failed to create certification");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};