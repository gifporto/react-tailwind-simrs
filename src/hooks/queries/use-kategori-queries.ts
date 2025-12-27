import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvKategoriAPI } from "@/lib/api";

// 1. Hook untuk Tabel Utama (Pagination & Search)
export const useKategoriList = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["inv-kategori-list", page, search],
    queryFn: () => InvKategoriAPI.getList(page, perPage, search),
    placeholderData: (prev) => prev,
  });
};

// 2. Hook untuk Dropdown / Select (Options)
export const useKategoriOptions = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["kategori-opt", page, limit],
    queryFn: () => InvKategoriAPI.getList(page, limit),
  });
};

/* =======================
   MUTATIONS
======================= */

export const useCreateKategori = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvKategoriAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inv-kategori-list"] });
      queryClient.invalidateQueries({ queryKey: ["kategori-opt"] });
    },
  });
};

export const useUpdateKategori = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      InvKategoriAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inv-kategori-list"] });
      queryClient.invalidateQueries({ queryKey: ["kategori-opt"] });
    },
  });
};

export const useDeleteKategori = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvKategoriAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inv-kategori-list"] });
      queryClient.invalidateQueries({ queryKey: ["kategori-opt"] });
    },
  });
};