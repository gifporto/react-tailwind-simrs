import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvConsumeAPI } from "@/lib/api";

// Hook untuk List Consumable Items (Non-Obat)
export const useConsumableList = (
  page: number,
  perPage: number,
  search: string,
  jenis?: string,
  idGudang?: number
) => {
  return useQuery({
    queryKey: ["consume-list", page, search, jenis, idGudang],
    queryFn: () => InvConsumeAPI.getConsumableList(page, perPage, search, jenis, idGudang),
    placeholderData: (prev) => prev,
  });
};

// Hook untuk Consumption History
export const useConsumeHistory = (
  page: number,
  perPage: number,
  params?: {
    search?: string;
    startDate?: string;
    endDate?: string;
    idGudang?: number;
    idBarang?: number;
  }
) => {
  return useQuery({
    queryKey: ["consume-history", page, params],
    queryFn: () => InvConsumeAPI.getHistory(page, perPage, params),
    placeholderData: (prev) => prev,
  });
};

// Hook untuk Check Stock Availability
export const useCheckStock = (idBarang: number, idGudang?: number) => {
  return useQuery({
    queryKey: ["check-stock", idBarang, idGudang],
    queryFn: () => InvConsumeAPI.checkStock(idBarang, idGudang),
    enabled: !!idBarang,
  });
};

/* =======================
   MUTATIONS
======================= */

// Create Consumption
export const useCreateConsume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => InvConsumeAPI.createConsume(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consume-list"] });
      queryClient.invalidateQueries({ queryKey: ["consume-history"] });
      queryClient.invalidateQueries({ queryKey: ["check-stock"] });
    },
  });
};
