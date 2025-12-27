import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
  setPage: (page: number) => void;
}

export function CustomPagination({
  page,
  perPage,
  total,
  lastPage,
  setPage,
}: CustomPaginationProps) {
  
  // Fungsi untuk menentukan angka mana saja yang muncul (Logika Ellipsis)
  const getPaginationItems = () => {
    const items = [];
    const siblingCount = 1; // Jumlah angka di sekitar halaman aktif

    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 || // Halaman pertama selalu muncul
        i === lastPage || // Halaman terakhir selalu muncul
        (i >= page - siblingCount && i <= page + siblingCount) // Angka di sekitar page aktif
      ) {
        items.push(i);
      } else if (
        i === page - siblingCount - 1 ||
        i === page + siblingCount + 1
      ) {
        items.push("ellipsis");
      }
    }

    // Menghapus ellipsis ganda yang berurutan
    return items.filter((item, index, arr) => 
      item !== "ellipsis" || arr[index - 1] !== "ellipsis"
    );
  };

  const paginationRange = getPaginationItems();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      {/* Label Informasi Data */}
      <p className="text-xs text-muted-foreground">
        Menampilkan <span className="font-medium">{(page - 1) * perPage + 1}</span> -{" "}
        {Math.min(page * perPage, total)} dari {total} data
      </p>

      {/* Navigasi Paginasi Shadcn */}
      <Pagination>
        <PaginationContent>
          {/* Tombol Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Render Angka Halaman secara Dinamis */}
          {paginationRange.map((item, index) => (
            <PaginationItem key={index}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => setPage(item as number)}
                  isActive={page === item}
                  className="cursor-pointer"
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Tombol Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => page < lastPage && setPage(page + 1)}
              className={page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}