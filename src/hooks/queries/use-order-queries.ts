import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvOrderAPI } from "@/lib/api";

export const useOrderList = (page: number, perPage: number) => {
    return useQuery({
        // Sertakan page dalam queryKey agar cache dibedakan per halaman
        queryKey: ["order-list", page, perPage],
        queryFn: () => InvOrderAPI.getList(),
        placeholderData: (prev) => prev,
    });
};
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => InvOrderAPI.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["order-list"] });
            // Invalidate stok karena pembelian menambah stok barang
            queryClient.invalidateQueries({ queryKey: ["stok"] });
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            InvOrderAPI.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["order-list"] });
        },
    });
};

export const useApproveOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => InvOrderAPI.approve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["order-list"] });
            // Stok biasanya bertambah saat approval, maka invalidate stok
            queryClient.invalidateQueries({ queryKey: ["stok"] });
        },
    });
};

export const useRejectOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => InvOrderAPI.reject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["order-list"] });
        },
    });
};

