"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { EmrLabAPI } from "@/lib/api";

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

import { Search, Eye, Beaker, Loader2, FilePlus } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function EmrLabIndexPage() {
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["emr-lab-list", page, search],
    queryFn: () => EmrLabAPI.getList(page, perPage, search),
  });

  // Mapping data berdasarkan struktur respon API Lab
  const listData = apiResponse?.data?.data || [];
  const lastPage = apiResponse?.data?.last_page || 1;
  const total = apiResponse?.data?.total || 0;

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 w-full">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                  <Beaker className="w-6 h-6" />
                  EMR Laboratorium
                </CardTitle>
                <p className="text-sm text-muted-foreground">Manajemen Order dan Hasil Laboratorium Pasien</p>
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
                <Badge variant="secondary" className="h-7">{total} Total Order</Badge>
              </div>
            </div>

            <Button onClick={() => navigate("/emr/laboratory/create")}>
              <FilePlus className="w-4 h-4" />
              Order Baru
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : listData.length === 0 ? (
              <div className="text-center py-20">
                <Beaker className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">Data laboratorium tidak ditemukan</p>
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
                        <TableHead>Item Tes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground text-xs">{(page - 1) * perPage + i + 1}</TableCell>
                          <TableCell>
                            <div className="font-bold text-primary text-xs">{item.no_order}</div>
                            <div className="text-[10px] text-muted-foreground">{formatDate(item.created_at)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold uppercase text-xs">{item.pasien?.nama}</div>
                            <div className="text-[10px] text-muted-foreground">RM: {item.pasien?.norm}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-medium">{item.dokter?.nama}</div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="flex flex-wrap gap-1">
                              {item.items?.map((test: any) => (
                                <Badge key={test.id} variant="outline" className="text-[9px] py-0 h-5">
                                  {test.nama_test}
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
                              onClick={() => navigate(`/emr/lab/detail/${item.id}`)}
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