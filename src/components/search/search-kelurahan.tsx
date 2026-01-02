import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchKelurahanProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchKelurahan = React.forwardRef<
  HTMLButtonElement,
  SearchKelurahanProps
>(
  (
    { value, onChange, placeholder = "Pilih data...", className, disabled },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();

    // 1. Infinite Query untuk List
    const {
      data: listData,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading: isLoadingList,
    } = useInfiniteQuery({
      queryKey: ["kelurahan", "list", debouncedSearch],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await api.get("/master/kelurahans", {
          params: { search: debouncedSearch, page: pageParam },
        });
        return res.data;
      },
      getNextPageParam: (lastPage) => {
        const { current_page, total_pages } = lastPage.meta.pagination;
        return current_page < total_pages ? current_page + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: open,
    });

    const allOptions = listData?.pages.flatMap((page) => page.data) || [];

    // 2. Detail Query dengan Caching Pintar
    const { data: detailResponse, isLoading: isLoadingInitial } = useQuery({
      queryKey: ["kelurahan", "detail", value],
      queryFn: async () => {
        const res = await api.get(`/master/kelurahans/${value}`);
        return res.data; // Ini return object dengan data: { id_kel, desk_kel }
      },
      enabled: !!value,
      staleTime: Infinity,
      // INI KUNCINYA: Cek apakah data sudah ada di cache list, jika ada jangan fetch.
      initialData: () => {
        // Cari di semua halaman infinite query
        const existingData = allOptions.find((item) => item.id_kel === value);
        if (existingData) {
          return { data: existingData }; // Bungkus sesuai struktur respons API detail
        }
        return undefined;
      },
    });

    // Helper untuk mendapatkan label
    const displayLabel = React.useMemo(() => {
      if (!value) return placeholder;
      // Prioritaskan data detail (baik dari cache atau fetch awal)
      if (detailResponse?.data) return detailResponse.data.desk_kel;
      return placeholder;
    }, [value, detailResponse, placeholder]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref} // Pasang ref di sini
            variant="outline"
            role="combobox"
            // Gabungkan className default dengan className dari props (untuk error border)
            className={cn("w-full justify-between font-normal", className)}
            disabled={disabled || isLoadingInitial}
          >
            <span className="truncate">
              {isLoadingInitial && !detailResponse ? "Memuat..." : displayLabel}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Cari kelurahan..."
              onValueChange={setSearchTerm}
            />
            <CommandList
              onScroll={(e) => {
                const target = e.currentTarget;
                if (
                  target.scrollHeight - target.scrollTop <=
                  target.clientHeight + 10
                ) {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }
              }}
            >
              {isLoadingList && allOptions.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
                </div>
              )}

              {!isLoadingList && allOptions.length === 0 && (
                <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
              )}

              <CommandGroup>
                {allOptions.map((item) => (
                  <CommandItem
                    key={item.id_kel}
                    value={item.id_kel}
                    onSelect={() => {
                      // Update cache manual agar query detail langsung mengenali data ini
                      queryClient.setQueryData(
                        ["kelurahan", "detail", item.id_kel],
                        {
                          data: item,
                        }
                      );
                      onChange(item.id_kel === value ? "" : item.id_kel);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id_kel ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.desk_kel}
                  </CommandItem>
                ))}
              </CommandGroup>

              {isFetchingNextPage && (
                <div className="flex justify-center p-2 border-t">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

SearchKelurahan.displayName = "SearchKelurahan";
