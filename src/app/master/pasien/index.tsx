"use client";

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PatientsAPI } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { toast } from "sonner";

export default function PatientPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [patients, setPatients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const perPage = 10;

  // Params dari URL
  const deleted = searchParams.get("deleted");
  const created = searchParams.get("created");
  const updated = searchParams.get("updated");

  // Handle Toast untuk created / deleted / updated
  React.useEffect(() => {
    if (deleted === "1") toast.success("Pasien berhasil dihapus!");
    if (created === "1") toast.success("Pasien berhasil dibuat!");
    if (updated === "1") toast.success("Pasien berhasil diperbarui!");

    if (deleted === "1" || created === "1" || updated === "1") {
      const t = setTimeout(() => {
        navigate("/master/pasien", { replace: true });
      }, 500);

      return () => clearTimeout(t);
    }
  }, [deleted, created, updated]);

  // Load API
  React.useEffect(() => {
    const loadPatients = async () => {
      try {
        const result: any = await PatientsAPI.getList(page, perPage, search);
        setPatients(result.data);
        setLastPage(result.meta.pagination.total_pages);
        setTotal(result.meta.pagination.total);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, [page, search]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0000-00-00") return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return "-";
    }
  };

  const formatGender = (gender: string) => {
    if (gender === "L") return "Laki-laki";
    if (gender === "P") return "Perempuan";
    return "-";
  };

  const formatPhones = (phones: string[]) => {
    if (!phones || phones.length === 0) return "-";
    return phones.join(", ");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-row justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-primary">Data Pasien</CardTitle>
            <p className="text-sm text-muted-foreground">Kelola data master pasien rumah sakit</p>
          </div>
          <Button 
            onClick={() => navigate("/master/pasien/create")}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            + Tambah Pasien Baru
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Input
            placeholder="Cari berdasarkan nama, NIK, atau NORM..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            {total} pasien ditemukan
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <LoadingSkeleton lines={6} />
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">Tidak ada pasien ditemukan</div>
            <p className="text-sm text-muted-foreground mt-2">Coba sesuaikan pencarian atau tambah pasien baru</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">No</TableHead>
                    <TableHead className="font-semibold">NORM</TableHead>
                    <TableHead className="font-semibold">Nama</TableHead>
                    <TableHead className="font-semibold">NIK</TableHead>
                    <TableHead className="font-semibold">No. BPJS</TableHead>
                    <TableHead className="font-semibold">Jenis Kelamin</TableHead>
                    <TableHead className="font-semibold">Tgl. Lahir</TableHead>
                    <TableHead className="font-semibold">Umur</TableHead>
                    <TableHead className="font-semibold">Telepon</TableHead>
                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {patients.map((patient, i) => (
                    <TableRow key={patient.id} className="table-row-hover">
                      <TableCell className="font-medium text-muted-foreground">{(page - 1) * perPage + (i + 1)}</TableCell>
                      <TableCell className="font-medium">{patient.norm || "-"}</TableCell>
                      <TableCell className="font-medium">{patient.name || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{patient.nik || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{patient.bpjs_number || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{formatGender(patient.gender)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(patient.birth_date)}</TableCell>
                      <TableCell className="text-muted-foreground">{patient.age || 0} tahun</TableCell>
                      <TableCell className="text-muted-foreground">{formatPhones(patient.phones)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/master/pasien/detail/${patient.id}`)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan {((page - 1) * perPage) + 1} sampai {Math.min(page * perPage, total)} dari {total} pasien
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary hover:text-primary-foreground"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                    const startPage = Math.max(1, Math.min(page - 2, lastPage - 4));
                    const currentPage = startPage + i;
                    return currentPage <= lastPage ? (
                      <PaginationItem key={currentPage}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setPage(currentPage)}
                          className={`cursor-pointer ${
                            page === currentPage 
                              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                              : "hover:bg-muted"
                          }`}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                    ) : null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < lastPage && setPage(page + 1)}
                      className={
                        page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}