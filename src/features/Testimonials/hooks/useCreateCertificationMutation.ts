import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCertificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // We expect FormData because of the image upload
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/certifications", {
        method: "POST",
        body: formData, 
        // Note: Do NOT set Content-Type header manually when using FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create certification");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate the list query to show the new data immediately
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
};