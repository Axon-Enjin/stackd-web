import { useQuery } from "@tanstack/react-query";
import { sampleResourceRow } from "../SampleFeature.types";

export const useResourceQuery = (resourceId: string | null) => {
  const query = useQuery<sampleResourceRow>({
    queryKey: ["test_resources", resourceId],
    queryFn: async () => {
      const response = await fetch(`/api/testResource/${resourceId}`);
      return response.json();
    },
    enabled: !!resourceId,
  });

  return query;
};
