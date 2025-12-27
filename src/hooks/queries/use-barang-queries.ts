import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvBarangAPI } from "@/lib/api";

// 1. Hook untuk Tabel Utama (Pagination & Search)
export const useBarangList = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["barang-list", page, search],
    queryFn: () => InvBarangAPI.getList(page, perPage, search),
    placeholderData: (prev) => prev,
  });
};

// 2. Hook untuk Dropdown / Select (Data banyak sekaligus)
export const useBarangOptions = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["barang-opt", page, limit],
    queryFn: () => InvBarangAPI.getList(page, limit),
  });
};

/* =======================
   MUTATIONS
   Ditambahkan invalidasi barang-opt
======================= */

export const useCreateBarang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvBarangAPI.create(payload),
    onSuccess: () => {
      // Refresh tabel dan refresh dropdown
      queryClient.invalidateQueries({ queryKey: ["barang-list"] });
      queryClient.invalidateQueries({ queryKey: ["barang-opt"] });
    },
  });
};

export const useUpdateBarang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      InvBarangAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-list"] });
      queryClient.invalidateQueries({ queryKey: ["barang-opt"] });
    },
  });
};

export const useDeleteBarang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvBarangAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-list"] });
      queryClient.invalidateQueries({ queryKey: ["barang-opt"] });
    },
  });
};