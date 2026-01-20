import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvSupplierAPI } from "@/lib/api";

// Hook untuk Tabel Utama (Pagination & Search)
export const useSupplierList = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["supplier-list", page, search],
    queryFn: () => InvSupplierAPI.getList(page, perPage, search),
    placeholderData: (prev) => prev,
  });
};

// Hook untuk Dropdown / Select (Options)
export const useSupplierOptions = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["supplier-opt", page, limit],
    queryFn: () => InvSupplierAPI.getList(page, limit),
  });
};

/* =======================
   MUTATIONS
======================= */

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvSupplierAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-list"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-opt"] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      InvSupplierAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-list"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-opt"] });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvSupplierAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-list"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-opt"] });
    },
  });
};
