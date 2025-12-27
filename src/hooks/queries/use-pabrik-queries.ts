import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvPabrikAPI } from "@/lib/api";

// Hook untuk Tabel Utama (Pagination & Search)
export const usePabrikList = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["pabrik-list", page, search],
    queryFn: () => InvPabrikAPI.getList(page, perPage, search),
    placeholderData: (prev) => prev,
  });
};

// Hook untuk Dropdown / Select (Options)
export const usePabrikOptions = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["pabrik-opt", page, limit],
    queryFn: () => InvPabrikAPI.getList(page, limit),
  });
};

/* =======================
   MUTATIONS
======================= */

export const useCreatePabrik = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvPabrikAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pabrik-list"] });
      queryClient.invalidateQueries({ queryKey: ["pabrik-opt"] });
    },
  });
};

export const useUpdatePabrik = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      InvPabrikAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pabrik-list"] });
      queryClient.invalidateQueries({ queryKey: ["pabrik-opt"] });
    },
  });
};

export const useDeletePabrik = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvPabrikAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pabrik-list"] });
      queryClient.invalidateQueries({ queryKey: ["pabrik-opt"] });
    },
  });
};