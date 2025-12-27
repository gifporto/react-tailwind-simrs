import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvGudangAPI } from "@/lib/api";

// Fetch List dengan Pagination dan Search
export const useGudangList = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["gudang-list", page, search],
    queryFn: () => InvGudangAPI.getList(page, perPage, search),
    placeholderData: (prev) => prev,
  });
};

// Hook untuk Dropdown (Data banyak sekaligus)
export const useGudangOptions = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["inv-gudang-opt", page, limit],
    queryFn: () => InvGudangAPI.getList(page, limit),
  });
};

// Mutation: Create
export const useCreateGudang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvGudangAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gudang-list"] });
      queryClient.invalidateQueries({ queryKey: ["inv-gudang-opt"] });
    },
  });
};

// Mutation: Update
export const useUpdateGudang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      InvGudangAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gudang-list"] });
      queryClient.invalidateQueries({ queryKey: ["inv-gudang-opt"] });
    },
  });
};

// Mutation: Delete
export const useDeleteGudang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvGudangAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gudang-list"] });
      queryClient.invalidateQueries({ queryKey: ["inv-gudang-opt"] });
    },
  });
};