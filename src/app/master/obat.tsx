"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useObatList, useCreateObat } from "@/hooks/queries/master/use-obat-queries";
import { toast } from "sonner";

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
} from "@/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Search, Pill, Loader2, Plus, Edit, Trash2, Home, Activity } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function ObatIndexPage() {
  const queryClient = useQueryClient();

  // Table States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const [formData, setFormData] = React.useState({
    kd_barang: "",
    nama: "",
    jenis: "OBAT",
    id_kategori: "",
    id_satuan: "",
    id_pabrik: "",
    spesifikasi: "",
    min_stok: 0,
    max_stok: 0,
    is_aktif: true,
    kategori: "generik",
    kode_kfa: "",
    nama_generik: "",
    komposisi: ""
  });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading } = useObatList(page, perPage, search);

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const total = pagination?.total || 0;
  const lastPage = pagination?.total_pages || 1;

  /* =======================
     MUTATIONS
  ======================= */
  const createMutation = useCreateObat();

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenDialog = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        kd_barang: item.id, // Menggunakan id sebagai kode sementara berdasarkan response
        nama: item.desk_brg,
        jenis: "OBAT",
        id_kategori: item.id_kategori || "",
        id_satuan: item.id_satuan || "",
        id_pabrik: item.id_pabrik || "",
        spesifikasi: item.spesifikasi || "",
        min_stok: Number(item.min_stok),
        max_stok: Number(item.max_stok),
        is_aktif: item.is_active === "Y",
        kategori: item.generik?.toLowerCase() || "generik",
        kode_kfa: item.kd_kfa || "",
        nama_generik: item.desk_brg,
        komposisi: item.komposisi || ""
      });
    } else {
      setSelectedItem(null);
      setFormData({ 
        kd_barang: "", nama: "", jenis: "OBAT", id_kategori: "", 
        id_satuan: "", id_pabrik: "", min_stok: 0, max_stok: 0, 
        spesifikasi: "", is_aktif: true, kategori: "generik",
        kode_kfa: "", nama_generik: "", komposisi: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Data obat berhasil disimpan");
        setIsDialogOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.message || "Gagal menyimpan data");
      }
    });
  };

  const formatCurrency = (val: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(Number(val));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="border-b bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-1 w-full">
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <Pill className="w-6 h-6" /> Master Data Obat
              </CardTitle>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama obat atau kode..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10"
                  />
                </div>
                <Badge variant="secondary">
                  {total} Records Found
                </Badge>
              </div>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4" /> Tambah Obat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="w-[50px] text-center">No</TableHead>
                        <TableHead>Deskripsi Obat</TableHead>
                        <TableHead>Informasi Teknis</TableHead>
                        <TableHead>Stok & Harga</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="text-center font-mono text-xs text-muted-foreground">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{item.desk_brg}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] py-0">{item.kd_kfa}</Badge>
                                <span className="text-[11px] text-muted-foreground italic">{item.komposisi}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Home className="w-3 h-3 text-slate-400" />
                                <span>Pabrik: {item.id_pabrik}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                                <Activity className="w-3 h-3" />
                                <span>{item.spesifikasi}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-xs font-semibold text-emerald-600">
                                {formatCurrency(item.harga_dasar_jual)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                Min: {Math.floor(item.min_stok)} / Max: {Math.floor(item.max_stok)}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge className={item.is_active === "Y" ? "bg-emerald-100 text-emerald-700 shadow-none" : "bg-red-100 text-red-700 shadow-none"}>
                              {item.is_active === "Y" ? "Aktif" : "Non-Aktif"}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 w-8 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
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

      {/* DIALOG FORM */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-600" />
              {selectedItem ? "Ubah Data Obat" : "Registrasi Obat Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            <div className="space-y-2">
              <Label>Kode KFA / Katalog</Label>
              <Input required value={formData.kode_kfa} onChange={(e) => setFormData({ ...formData, kode_kfa: e.target.value })} placeholder="Masukkan nomor KFA..." />
            </div>

            <div className="space-y-2">
              <Label>Nama Obat</Label>
              <Input required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Amoxicillin 500mg" />
            </div>

            <div className="space-y-2">
              <Label>Jenis Kategori</Label>
              <Select value={formData.kategori} onValueChange={(val) => setFormData({ ...formData, kategori: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="generik">Generik</SelectItem>
                  <SelectItem value="paten">Paten</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bentuk Sediaan</Label>
              <Input value={formData.spesifikasi} onChange={(e) => setFormData({ ...formData, spesifikasi: e.target.value })} placeholder="Tablet, Sirup, Kapsul..." />
            </div>

            <div className="space-y-2">
              <Label>Min Stok</Label>
              <Input type="number" value={formData.min_stok} onChange={(e) => setFormData({ ...formData, min_stok: Number(e.target.value) })} />
            </div>

            <div className="space-y-2">
              <Label>Max Stok</Label>
              <Input type="number" value={formData.max_stok} onChange={(e) => setFormData({ ...formData, max_stok: Number(e.target.value) })} />
            </div>

            <div className="col-span-full space-y-2">
              <Label>Komposisi / Kandungan</Label>
              <Textarea 
                value={formData.komposisi} 
                onChange={(e) => setFormData({ ...formData, komposisi: e.target.value })} 
                placeholder="Detail zat aktif obat..."
                className="h-20"
              />
            </div>

            <div className="col-span-full flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Data"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}