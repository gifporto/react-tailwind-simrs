import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ObatAPI } from "@/lib/api";

export const useObatList = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ["obats", page, limit, search],
    queryFn: () => ObatAPI.getList(page, limit, search),
  });
};

export const useCreateObat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => ObatAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obats"] });
    },
  });
};