"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { EmrRadiologyAPI } from "@/lib/api"; // Menggunakan API Radiologi

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

import { Search, Eye, Radio, Loader2, FilePlus } from "lucide-react";

export default function EmrRadiologiIndexPage() {
  const navigate = useNavigate();

  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 15;

  /* =======================
     FETCH DATA RADIOLOGI
  ======================= */
  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["emr-radiologi-list", page, search], // Search dimasukkan ke key jika API mendukung server-side search
    queryFn: () => EmrRadiologyAPI.getList(page, perPage, search),
  });

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     FORMATTERS & STYLES
  ======================= */
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "success";
      case "ordered":
        return "info";
      case "dibatalkan":
        return "destructive";
      case "proses":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 w-full">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-blue-600">
                  <Radio className="w-6 h-6" />
                  EMR Radiologi
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daftar Order dan Pemeriksaan Radiologi Pasien
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari No. Order atau Nama Pasien..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <Badge variant="secondary" className="h-7">
                  {total} Total Order
                </Badge>
              </div>
            </div>

            <Button onClick={() => navigate("/emr/radiology/create")} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <FilePlus className="w-4 h-4" />
              Order Baru
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : listData.length === 0 ? (
              <div className="text-center py-20">
                <Radio className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">Data radiologi tidak ditemukan</p>
                {isError && (
                  <Button variant="ghost" onClick={() => refetch()} className="mt-2 text-primary">
                    Reload Data
                  </Button>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead>No. Order / Tanggal</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Dokter Pengirim</TableHead>
                        <TableHead>Pemeriksaan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground text-xs">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell>
                            <div className="font-bold text-blue-600 text-xs">{item.no_order}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {formatDate(item.tanggal_order)}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="font-semibold uppercase text-xs">
                              {item.pasien?.nama}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              RM: {item.pasien?.norm} • {item.pasien?.tgl_lahir}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs font-medium">{item.dokter_pengirim?.nama}</div>
                          </TableCell>

                          <TableCell className="max-w-[250px]">
                            <div className="flex flex-wrap gap-1">
                              {item.pemeriksaan?.map((p: any) => (
                                <Badge key={p.id} variant="outline" className="text-[9px] py-0 h-5">
                                  {p.pemeriksaan?.nama}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge className="text-[10px]" variant={`${getStatusVariant(item.status)}`}>
                              {item.status.toUpperCase()}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/emr/radiology/detail/${item.id}`)}
                              className="h-8 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* PAGINATION SECTION */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <p className="text-xs text-muted-foreground">
                    Menampilkan <span className="font-medium">{(page - 1) * perPage + 1}</span> -{" "}
                    <span className="font-medium">{Math.min(page * perPage, total)}</span> dari{" "}
                    <span className="font-medium">{total}</span> order
                  </p>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: lastPage }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                        .map((p, idx, arr) => (
                          <React.Fragment key={p}>
                            {idx > 0 && arr[idx - 1] !== p - 1 && (
                              <span className="text-muted-foreground px-2">...</span>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                isActive={page === p}
                                onClick={() => setPage(p)}
                                className="cursor-pointer"
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                          className={page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}