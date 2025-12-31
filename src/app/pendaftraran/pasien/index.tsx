import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Search, UserPlus } from "lucide-react";
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
import { CustomPagination } from "@/components/shared/pagination";
import GenderBadge from "@/components/gender-badge";
import { formatDateSafely } from "@/lib/datetime";
import { usePatientList } from "@/querys/patient";

function SkeletonTable() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

export default function PatientPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching } = usePatientList(page, limit, debouncedSearch);

  const patients = data?.data ?? [];
  const pagination = data?.meta?.pagination;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Pasien</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat informasi rekam medis pasien.
          </p>
        </div>
        <Button
          onClick={() => navigate("/daftar/pasien/create")}
          className="gap-2"
        >
          <UserPlus className="w-4 h-4" /> Tambah Pasien
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari Nama, NIK, atau NORM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Baris per halaman:
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
          {isFetching ? (
            <SkeletonTable />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">NORM</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>L/P</TableHead>
                    <TableHead>No. HP</TableHead>
                    <TableHead>Tgl Lahir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length > 0 ? (
                    patients.map((patient: any) => (
                      <TableRow key={patient.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono font-medium text-blue-600">
                          {patient.norm}
                        </TableCell>
                        <TableCell className="font-medium uppercase">
                          {patient.nama}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {patient.nik || "-"}
                        </TableCell>
                        <TableCell>
                          <GenderBadge gender={patient.sex} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {patient.hp || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateSafely(patient.tgl_lahir, "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/daftar/pasien/detail/${patient.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" /> Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada data ditemukan.
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
