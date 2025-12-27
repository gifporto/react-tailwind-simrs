import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvUnitAPI } from "@/lib/api";

export const useUnitList = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["satuan-list", page, perPage, search],
    queryFn: () => InvUnitAPI.getList(),
    placeholderData: (prev) => prev,
  });
};

export const useUnitOptions = (page = 1, limit = 200) => {
  return useQuery({
    queryKey: ["satuan-opt", page, limit],
    queryFn: () => InvUnitAPI.getList(),
    staleTime: 1000 * 60 * 30,
  });
};

/* =======================
   MUTATIONS
======================= */

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvUnitAPI.create(payload),
    onSuccess: () => {
      // Refresh cache tabel dan cache dropdown
      queryClient.invalidateQueries({ queryKey: ["satuan-list"] });
      queryClient.invalidateQueries({ queryKey: ["satuan-opt"] });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      InvUnitAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuan-list"] });
      queryClient.invalidateQueries({ queryKey: ["satuan-opt"] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvUnitAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuan-list"] });
      queryClient.invalidateQueries({ queryKey: ["satuan-opt"] });
    },
  });
};