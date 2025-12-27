import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvMutasiAPI } from "@/lib/api";

export const useMutasiList = (page: number, perPage: number, search: string) => {
    return useQuery({
        queryKey: ["mutasi-list", page, search],
        queryFn: () => InvMutasiAPI.getList(page, perPage, search),
        placeholderData: (prev) => prev,
    });
};

export const useCreateMutasi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => InvMutasiAPI.create(payload),
        onSuccess: () => {
            // Invalidate mutasi list agar tabel refresh
            queryClient.invalidateQueries({ queryKey: ["mutasi-list"] });
            // Juga invalidate stok karena mutasi merubah jumlah stok
            queryClient.invalidateQueries({ queryKey: ["stok"] });
        },
    });
};