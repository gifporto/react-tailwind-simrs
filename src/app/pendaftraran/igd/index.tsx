import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  UserPlus,
  Calendar,
  Clock,
  Stethoscope,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CustomPagination } from "@/components/shared/pagination";
import GenderBadge from "@/components/gender-badge";
import { formatDateSafely } from "@/lib/datetime";
import { api } from "@/lib/axios";

// Komponen Loading
function SkeletonTable() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

export default function IgdRegistrationPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["pendaftaran-igd", "list", page, limit, debouncedSearch],
    queryFn: async () => {
      const response = await api.get("pendaftaran/igd", {
        params: {
          page,
          limit,
          search: debouncedSearch,
        },
      });
      return response.data;
    },
    // Keep data previous page saat fetching page baru agar UI tidak "jumpy"
    placeholderData: (previousData) => previousData,
  });

  const registrations = data?.data ?? [];
  const pagination = data?.meta?.pagination;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Activity className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Antrean IGD</h1>
            <p className="text-muted-foreground">
              Manajemen pendaftaran dan kedatangan pasien gawat darurat.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate("create")}
          className="gap-2 bg-red-600 hover:bg-red-700"
        >
          <UserPlus className="w-4 h-4" /> Daftar Pasien Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari No. Reg, Nama, atau NORM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Baris:
              </span>
              <Select
                value={limit.toString()}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[150px]">No. Registrasi</TableHead>
                    <TableHead>Identitas Pasien</TableHead>
                    <TableHead>Waktu Masuk</TableHead>
                    <TableHead>Dokter & Layanan</TableHead>
                    <TableHead>Penanggung Jawab</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.length > 0 ? (
                    registrations.map((reg: any) => (
                      <TableRow
                        key={reg.id}
                        className={`hover:bg-muted/30 ${
                          isFetching ? "opacity-50" : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-blue-600 leading-none">
                              {reg.no_reg}
                            </span>
                            <span className="text-[10px] font-mono mt-1 px-1.5 py-0.5 bg-slate-100 w-fit rounded text-muted-foreground">
                              NORM: {reg.norm}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold uppercase text-sm">
                              {reg.pasien?.nama}
                            </span>
                            <div className="flex items-center gap-2">
                              <GenderBadge gender={reg.pasien?.sex} />
                              <span className="text-xs text-muted-foreground font-mono">
                                {reg.pasien?.nik || "Tanpa NIK"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDateSafely(reg.tgl_periksa, "dd MMM yyyy")}
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                              {reg.jam}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <Badge
                              variant="secondary"
                              className="w-fit text-[10px] uppercase tracking-wider"
                            >
                              {reg.poli?.desk_poli}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Stethoscope className="w-3 h-3 text-red-400" />
                              <span>Dokter ID: {reg.id_dokter}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-0.5">
                            <p className="font-medium">
                              {reg.nama_penanggung || "-"}
                            </p>
                            <p className="text-muted-foreground italic">
                              {reg.hp_penanggung
                                ? `HP: ${reg.hp_penanggung}`
                                : "No Kontak"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`${reg.id}`)}
                            className="h-8 px-3 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" /> Pelayanan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        Tidak ada data pendaftaran IGD yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomPagination
        page={page}
        perPage={limit}
        total={pagination?.total || 0}
        lastPage={pagination?.total_pages || 1}
        setPage={setPage}
      />
    </div>
  );
}
