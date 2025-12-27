import { useQuery } from "@tanstack/react-query";
import { InvBatchAPI } from "@/lib/api";

export const useBatchOptions = (page = 1, limit = 500) => {
  return useQuery({
    queryKey: ["batch-opt", page, limit],
    queryFn: () => InvBatchAPI.getList(page, limit),
  });
};