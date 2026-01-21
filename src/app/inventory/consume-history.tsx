"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConsumeHistory } from "@/hooks/queries/use-consume-queries";
import { useGudangOptions } from "@/hooks/queries/use-gudang-queries";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Search, History, Loader2, Calendar, Package } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";
import { format } from "date-fns";

export default function ConsumeHistoryPage() {
  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [filterGudang, setFilterGudang] = React.useState<number | undefined>();
  const perPage = 15;

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading } = useConsumeHistory(page, perPage, {
    search,
    startDate,
    endDate,
    idGudang: filterGudang,
  });
  const { data: gudangList } = useGudangOptions(1, 100);

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <History className="w-6 h-6" />
                Riwayat Konsumsi Barang
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Histori lengkap pemakaian barang non-obat
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari ref no atau keterangan..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Periode:</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-[150px]"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-[150px]"
                />
              </div>

              <Select
                value={filterGudang?.toString() || undefined}
                onValueChange={(val) => {
                  setFilterGudang(val ? parseInt(val) : undefined);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Gudang" />
                </SelectTrigger>
                <SelectContent>
                  {gudangList?.data?.map((g: any) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              <Badge variant="outline" className="h-7 border-primary/20 bg-primary/5 text-primary">
                {total} Transaksi
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading && listData.length === 0 ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : listData.length === 0 ? (
              <div className="text-center py-20">
                <History className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground font-medium">
                  Tidak ada riwayat konsumsi ditemukan
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>Tanggal & Ref No</TableHead>
                        <TableHead>Info Barang</TableHead>
                        <TableHead>Batch & Gudang</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Nilai (HPP)</TableHead>
                        <TableHead>Tujuan & Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground text-xs">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-medium">
                                  {item.tgl_mutasi
                                    ? format(new Date(item.tgl_mutasi), "dd MMM yyyy HH:mm")
                                    : "-"}
                                </span>
                              </div>
                              <span className="font-mono text-xs text-blue-600">
                                {item.ref_no || "-"}
                              </span>
                              {item.created_by && (
                                <span className="text-[10px] text-muted-foreground">
                                  by: {item.created_by.name}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-mono text-[10px] text-blue-600 font-bold">
                                {item.barang?.kd_barang}
                              </span>
                              <span className="font-semibold text-sm">{item.barang?.nama}</span>
                              <Badge variant="outline" className="w-fit text-[10px] mt-1">
                                {item.barang?.jenis}
                              </Badge>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {item.gudang?.nama}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <span className="font-mono">{item.batch?.no_batch}</span>
                                {item.batch?.exp_date && (
                                  <span className="ml-2">Exp: {item.batch.exp_date}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <Badge variant="default" className="font-mono">
                              {parseFloat(item.qty).toLocaleString()}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right font-mono text-sm">
                            Rp {parseFloat(item.total_nilai || 0).toLocaleString()}
                            <div className="text-[10px] text-muted-foreground">
                              @ Rp {parseFloat(item.hpp || 0).toLocaleString()}
                            </div>
                          </TableCell>

                          <TableCell className="max-w-xs">
                            <div className="text-xs">
                              <p className="font-medium text-sm line-clamp-2">{item.keterangan}</p>
                            </div>
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
