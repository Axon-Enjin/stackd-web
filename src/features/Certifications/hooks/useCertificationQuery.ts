import { useQuery } from "@tanstack/react-query";
// Import your specific type here, e.g., CertificationProps

export const useCertificationQuery = (certificationId: string | null) => {
  const query = useQuery({
    queryKey: ["certifications", certificationId],
    queryFn: async () => {
      const response = await fetch(`/api/certifications/${certificationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch certification");
      }
      return response.json();
    },
    enabled: !!certificationId, // Only fetch if we have an ID
  });

  return query;
};