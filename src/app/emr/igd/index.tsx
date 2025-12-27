"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { EmrIgdAPI } from "@/lib/api";

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

import { Search, Eye, Ambulance, Loader2, UserPlus } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function EmrIgdIndexPage() {
  const navigate = useNavigate();

  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 15; // Sesuai dengan per_page di API meta

  /* =======================
     FETCH DATA DARI API
  ======================= */
  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["emr-igd-list", page],
    queryFn: () => EmrIgdAPI.getList(page, perPage),
  });

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     MAPPING & FILTERING
  ======================= */
  const filteredData = listData.filter((item: any) => {
    const keyword = search.toLowerCase();
    return (
      item.no_reg.toLowerCase().includes(keyword) ||
      item.norm.toLowerCase().includes(keyword) ||
      item.nama_pasien?.toLowerCase().includes(keyword)
    );
  });

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
                <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                  <Ambulance className="w-6 h-6" />
                  EMR IGD
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daftar Registrasi Instalasi Gawat Darurat
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari No. Reg, RM, atau Nama..."
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
                  {total} Total Data
                </Badge>
              </div>
            </div>

            <Button onClick={() => navigate("/emr/igd/create")} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Registrasi Baru
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-20">
                <Ambulance className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">Data tidak ditemukan</p>
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
                        <TableHead>Registrasi</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell>
                            <div className="font-bold text-destructive">{item.no_reg}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">
                              {formatDate(item.tanggal_periksa)} • {item.jam_periksa}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="font-semibold uppercase text-xs tracking-tight">
                              {item.nama_pasien}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              RM: {item.norm} • {item.umur_pasien} Thn
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs font-medium">{item.dokter}</div>
                            <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                              {item.poli}
                            </Badge>
                          </TableCell>

                          <TableCell className="max-w-[180px]">
                            <p className="text-[11px] leading-relaxed line-clamp-2">
                              {item.alamat || "-"}
                            </p>
                          </TableCell>

                          <TableCell>
                            <Badge variant="secondary" className="text-[10px]">
                              {item.tipe_pasien}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/emr/igd/detail/${item.id}`)}
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

                <CustomPagination
                  page={page}
                  perPage={perPage}
                  total={total}
                  lastPage={lastPage}
                  setPage={setPage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}