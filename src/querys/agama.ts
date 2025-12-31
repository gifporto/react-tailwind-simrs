import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useAgamas() {
  return useQuery({
    queryKey: ["agamas"],
    queryFn: () => api.get("master/agamas"),
    select: (data) => data.data,
  });
}
