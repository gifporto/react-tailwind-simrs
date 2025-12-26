"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvMutasiAPI, InvBarangAPI, InvBatchAPI, InvGudangAPI } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { 
  ArrowRightLeft, 
  Search, 
  Loader2, 
  Plus, 
  ArrowDownLeft, 
  RefreshCcw,
  Calendar as CalendarIcon,
  Layers
} from "lucide-react";

export default function MutasiStokPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id_barang: "",
    id_batch: "",
    id_gudang_dari: "",
    id_gudang_ke: "",
    jenis: "TRANSFER",
    qty: 0,
    hpp: 0,
    ref_no: "",
    keterangan: "",
    tgl_mutasi: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    user_id: 1,
  });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["mutasi-list", page, search],
    queryFn: () => InvMutasiAPI.getList(page, perPage, search),
    placeholderData: (prev) => prev,
  });

  const { data: barangList } = useQuery({ queryKey: ["barang-opt"], queryFn: () => InvBarangAPI.getList(1, 100) });
  
  // Ambil data batch
  const { data: batchList, isLoading: isLoadingBatch } = useQuery({ 
    queryKey: ["batch-opt"], 
    queryFn: () => InvBatchAPI.getList(1, 500) 
  });

  const { data: gudangList } = useQuery({ queryKey: ["inv-gudang-opt"], queryFn: () => InvGudangAPI.getList(1, 100) });

  const listData = (apiResponse as any)?.data || [];
  const pagination = (apiResponse as any)?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  // Filter batch berdasarkan barang yang dipilih (UX Improvement)
  const filteredBatches = React.useMemo(() => {
    if (!formData.id_barang || !batchList?.data) return batchList?.data || [];
    return batchList.data.filter((b: any) => b.id_barang.toString() === formData.id_barang);
  }, [formData.id_barang, batchList]);

  /* =======================
     MUTATIONS
  ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) => InvMutasiAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mutasi-list"] });
      toast.success("Mutasi stok berhasil diproses");
      setIsDialogOpen(false);
      setFormData({
        id_barang: "", id_batch: "", id_gudang_dari: "", id_gudang_ke: "",
        jenis: "TRANSFER", qty: 0, hpp: 0, ref_no: "", keterangan: "",
        tgl_mutasi: format(new Date(), "yyyy-MM-dd HH:mm:ss"), user_id: 1
      });
    },
    onError: () => toast.error("Gagal memproses mutasi"),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <ArrowRightLeft className="w-6 h-6" /> Mutasi Stok
          </h1>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Mutasi Baru
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Cari Ref No..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] text-center">No</TableHead>
                <TableHead>Waktu & Ref</TableHead>
                <TableHead>Barang & Batch</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="text-right">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto"/></TableCell></TableRow>
              ) : (
                listData.map((item: any, i: number) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center text-xs font-mono">{(page - 1) * perPage + i + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{format(new Date(item.tgl_mutasi), "dd/MM/yy HH:mm")}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{item.ref_no}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{item.barang?.nama}</span>
                        <Badge variant="outline" className="w-fit text-[9px] px-1 h-4 mt-1">Batch: {item.id_batch}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={item.jenis === "MASUK" ? "default" : "secondary"}>{item.jenis}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">{item.qty}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="p-4 border-t">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink isActive className="bg-primary text-primary-foreground">
                        {page}
                    </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext
                        onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                        className={page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* DIALOG FORM */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Input Mutasi Stok</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Jenis Mutasi</Label>
                    <Select value={formData.jenis} onValueChange={(v) => setFormData({...formData, jenis: v})}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TRANSFER">TRANSFER</SelectItem>
                            <SelectItem value="MASUK">MASUK</SelectItem>
                            <SelectItem value="ADJUST">ADJUST</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Ref No</Label>
                    <Input required value={formData.ref_no} onChange={(e) => setFormData({...formData, ref_no: e.target.value})} placeholder="TRF-001 / PO-001" />
                </div>
            </div>

            <div className="space-y-2">
              <Label>Barang</Label>
              <Select value={formData.id_barang} onValueChange={(v) => setFormData({...formData, id_barang: v, id_batch: ""})}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Barang" /></SelectTrigger>
                <SelectContent>
                  {barangList?.data?.map((b: any) => (
                    <SelectItem key={b.id} value={b.id.toString()}>{b.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SELECT BATCH YANG SEBELUMNYA HILANG */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="w-3 h-3" /> Pilih No. Batch
              </Label>
              <Select 
                disabled={!formData.id_barang || isLoadingBatch} 
                value={formData.id_batch} 
                onValueChange={(v) => {
                    const selectedBatch = filteredBatches.find((b:any) => b.id.toString() === v);
                    setFormData({...formData, id_batch: v, hpp: selectedBatch?.hpp || 0});
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={!formData.id_barang ? "Pilih barang dahulu" : "Pilih Batch"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredBatches.map((batch: any) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.no_batch} (EXP: {format(new Date(batch.exp_date), "dd/MM/yy")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Gudang Asal</Label>
                    <Select disabled={formData.jenis === "MASUK"} value={formData.id_gudang_dari} onValueChange={(v) => setFormData({...formData, id_gudang_dari: v})}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Asal" /></SelectTrigger>
                        <SelectContent>
                            {gudangList?.data?.map((g: any) => <SelectItem key={g.id} value={g.id.toString()}>{g.nama}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Gudang Tujuan</Label>
                    <Select disabled={formData.jenis === "ADJUST"} value={formData.id_gudang_ke} onValueChange={(v) => setFormData({...formData, id_gudang_ke: v})}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Tujuan" /></SelectTrigger>
                        <SelectContent>
                            {gudangList?.data?.map((g: any) => <SelectItem key={g.id} value={g.id.toString()}>{g.nama}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Qty</Label>
                <Input type="number" step="0.01" value={formData.qty} onChange={(e) => setFormData({...formData, qty: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>HPP (Auto)</Label>
                <Input type="number" readOnly value={formData.hpp} className="bg-muted" />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Proses Mutasi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}