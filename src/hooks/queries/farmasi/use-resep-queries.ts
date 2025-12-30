import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FarResepAPI } from "@/lib/api";

// Fetch List Resep
export const useResepList = () => {
  return useQuery({
    queryKey: ["far-resep-list"],
    queryFn: () => FarResepAPI.getList(),
    placeholderData: (prev) => prev,
  });
};

// Fetch Detail Resep berdasarkan ID
export const useResepDetail = (id: string) => {
  return useQuery({
    queryKey: ["far-resep-detail", id],
    queryFn: () => FarResepAPI.getDetail(id),
    enabled: !!id, // Hanya jalan jika ID tersedia
  });
};

export const useApproveResep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      FarResepAPI.approve(id, payload),
    onSuccess: (_, variables) => {
      // Refresh list dan detail agar data sinkron setelah di-approve
      queryClient.invalidateQueries({ queryKey: ["far-resep-list"] });
      queryClient.invalidateQueries({ queryKey: ["far-resep-detail", variables.id] });
    },
  });
};