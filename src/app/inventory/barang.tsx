"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useBarangList,
  useCreateBarang,
  useUpdateBarang,
  useDeleteBarang
} from "@/hooks/queries/use-barang-queries";
import { InvBarangAPI, InvKategoriAPI, InvPabrikAPI, InvUnitAPI } from "@/lib/api"; // Pastikan InvUnitAPI diimport
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Search, Box, Loader2, Plus, Edit, Trash2, Factory } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";
import { useKategoriList, useKategoriOptions } from "@/hooks/queries/use-kategori-queries";
import { useUnitOptions } from "@/hooks/queries/use-unit-queries";

export default function BarangIndexPage() {
  const queryClient = useQueryClient();

  // Table States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  // Dialog & Form States
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const [formData, setFormData] = React.useState({
    kd_barang: "",
    nama: "",
    jenis: "",
    id_kategori: "",
    id_satuan: "",
    id_pabrik: "",
    min_stok: 0,
    max_stok: 0,
    spesifikasi: ""
  });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading } = useBarangList(page, perPage, search);
  const { data: kategoriList } = useKategoriOptions();
  const { data: pabrikList, isLoading: isLoadingPabrik } = useKategoriOptions();
  const { data: satuanList, isLoading: isLoadingSatuan } = useUnitOptions();

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     MUTATIONS
  ======================= */
  const createMutation = useCreateBarang();
  const updateMutation = useUpdateBarang();
  const deleteMutation = useDeleteBarang();

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenDialog = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        kd_barang: item.kd_barang,
        nama: item.nama,
        jenis: item.jenis,
        id_kategori: item.id_kategori?.toString() || "",
        id_satuan: item.id_satuan?.toString() || "",
        id_pabrik: item.id_pabrik?.toString() || "",
        min_stok: Number(item.min_stok),
        max_stok: Number(item.max_stok),
        spesifikasi: item.spesifikasi || ""
      });
    } else {
      setSelectedItem(null);
      setFormData({ kd_barang: "", nama: "", jenis: "OBAT", id_kategori: "", id_satuan: "", id_pabrik: "", min_stok: 0, max_stok: 0, spesifikasi: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        toast.success(selectedItem ? "Berhasil diperbarui" : "Berhasil disimpan");
        setIsDialogOpen(false);
      }
    };

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, payload: formData }, options);
    } else {
      createMutation.mutate(formData, options);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 w-full">
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <Box className="w-6 h-6" /> Master Data Barang
              </CardTitle>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kode atau nama barang..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="bg-primary/5">{total} Item</Badge>
              </div>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Barang
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading && listData.length === 0 ? (
              <div className="space-y-3"><Skeleton className="h-40 w-full" /></div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>Info Barang</TableHead>
                        <TableHead>Kategori & Jenis</TableHead>
                        <TableHead>Stok (Min/Max)</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="text-muted-foreground text-xs font-mono">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-mono text-[10px] text-blue-600 font-bold">{item.kd_barang}</span>
                              <span className="font-semibold text-sm">{item.nama}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Factory className="w-3 h-3" /> {item.pabrik?.nama || "-"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className="w-fit text-[10px]">{item.kategori?.nama}</Badge>
                              <span className="text-[10px] font-bold text-muted-foreground">{item.jenis}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs">
                              <span className="text-red-500 font-medium">Min: {Math.floor(item.min_stok)}</span> /
                              <span className="text-green-600 font-medium ml-1">Max: {Math.floor(item.max_stok)}</span>
                              <div className="text-muted-foreground font-bold">{item.satuan?.nama}</div>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 w-8 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
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

      {/* DIALOG FORM CREATE/EDIT */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Data Barang" : "Tambah Barang Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="kd_barang">Kode Barang</Label>
              <Input id="kd_barang" required value={formData.kd_barang} onChange={(e) => setFormData({ ...formData, kd_barang: e.target.value })} placeholder="Contoh: OB0001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Barang</Label>
              <Input id="nama" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Nama Obat / Alat" />
            </div>

            <div className="space-y-2">
              <Label>Jenis</Label>
              <Select value={formData.jenis} onValueChange={(val) => setFormData({ ...formData, jenis: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OBAT">OBAT</SelectItem>
                  <SelectItem value="BARANG">BARANG</SelectItem>
                  <SelectItem value="JASA">JASA</SelectItem>
                  <SelectItem value="ASSET">ASSET</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={formData.id_kategori} onValueChange={(val) => setFormData({ ...formData, id_kategori: val })}>
                <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                <SelectContent>
                  {kategoriList?.data?.map((k: any) => (
                    <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SELECT PABRIK DENGAN API */}
            <div className="space-y-2">
              <Label>Pabrik / Produsen</Label>
              <Select
                value={formData.id_pabrik}
                onValueChange={(val) => setFormData({ ...formData, id_pabrik: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingPabrik ? "Memuat..." : "Pilih Pabrik"} />
                </SelectTrigger>
                <SelectContent>
                  {pabrikList?.data?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* --- PERUBAHAN: SELECT SATUAN MENGGUNAKAN API --- */}
            <div className="space-y-2">
              <Label>Satuan</Label>
              <Select
                value={formData.id_satuan}
                onValueChange={(val) => setFormData({ ...formData, id_satuan: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingSatuan ? "Memuat..." : "Pilih Satuan"} />
                </SelectTrigger>
                <SelectContent>
                  {satuanList?.data?.map((s: any) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.desk_satuan} ({s.singkatan})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stok">Minimum Stok</Label>
              <Input
                id="min_stok"
                type="number"
                // Mengubah 0 menjadi string kosong agar placeholder muncul/input bersih saat mulai mengetik
                value={formData.min_stok === 0 ? "" : formData.min_stok}
                onChange={(e) => {
                  const val = e.target.value;
                  // Jika input kosong (dihapus semua), set ke 0. Jika ada isi, ambil angkanya.
                  setFormData({ ...formData, min_stok: val === "" ? 0 : Number(val) });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_stok">Maximum Stok</Label>
              <Input
                id="max_stok"
                type="number"
                value={formData.max_stok === 0 ? "" : formData.max_stok}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, max_stok: val === "" ? 0 : Number(val) });
                }}
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label htmlFor="spesifikasi">Spesifikasi / Keterangan</Label>
              <Textarea id="spesifikasi" value={formData.spesifikasi} onChange={(e) => setFormData({ ...formData, spesifikasi: e.target.value })} />
            </div>

            <div className="col-span-full flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedItem ? "Perbarui Barang" : "Simpan Barang"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALERT DELETE */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Barang?</AlertDialogTitle>
            <AlertDialogDescription>Barang <strong>{selectedItem?.nama}</strong> akan dihapus secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate(selectedItem?.id)} className="bg-destructive text-white hover:bg-destructive/90">Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}