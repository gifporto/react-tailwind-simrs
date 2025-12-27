import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvStockAPI } from "@/lib/api";

export const useStockMonitoring = (type: string, page: number, perPage: number, search: string) => {
    const fetchMap: Record<string, any> = {
        list: () => InvStockAPI.getList(page, perPage, search),
        summary: () => InvStockAPI.getSummary(page, perPage, search),
        warehouse: () => InvStockAPI.getSummaryWarehouse(page, perPage, search),
        batch: () => InvStockAPI.getSummaryBatch(page, perPage, search),
        alerts: () => InvStockAPI.getAlert(page, perPage, search),
    };

    return useQuery({
        queryKey: ["stok", type, page, search],
        queryFn: fetchMap[type] || fetchMap.summary,
        placeholderData: (prev) => prev,
    });
};

export const useUpdateStock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => InvStockAPI.create(payload),
        onSuccess: () => {
            // Invalidate semua yang berhubungan dengan stok
            queryClient.invalidateQueries({ queryKey: ["stok"] });
        },
    });
};