"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvKategoriAPI } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

import { Search, Tags, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function KategoriInventoryPage() {
  const queryClient = useQueryClient();

  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  // Dialog & Form States
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({ nama: "", jenis: "MEDIS" });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["inv-kategori-list", page, search],
    queryFn: () => InvKategoriAPI.getList(page, perPage, search),
    placeholderData: (previousData) => previousData,
  });

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     MUTATIONS
  ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) => InvKategoriAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inv-kategori-list"] });
      toast.success("Kategori inventori berhasil ditambahkan");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal menambah kategori"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      InvKategoriAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inv-kategori-list"] });
      toast.success("Kategori inventori berhasil diperbarui");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal memperbarui kategori"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => InvKategoriAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inv-kategori-list"] });
      toast.success("Kategori inventori berhasil dihapus");
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error("Gagal menghapus kategori"),
  });

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenDialog = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setFormData({ nama: item.nama, jenis: item.jenis });
    } else {
      setSelectedItem(null);
      setFormData({ nama: "", jenis: "MEDIS" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 w-full">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                  <Tags className="w-6 h-6" />
                  Kategori Inventori
                </CardTitle>
                <p className="text-sm text-muted-foreground">Kelola klasifikasi produk dan obat-obatan.</p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kategori..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="h-7 bg-primary/5">{total} Kategori</Badge>
              </div>
            </div>

            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Kategori
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading && listData.length === 0 ? (
              <div className="space-y-3"><Skeleton className="h-48 w-full" /></div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>Nama Kategori</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          {/* ROW NUMBER SESUAI PERMINTAAN */}
                          <TableCell className="text-muted-foreground text-xs font-mono">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell className="font-medium text-sm">
                            {item.nama}
                          </TableCell>

                          <TableCell>
                            <Badge variant={item.jenis === "MEDIS" ? "default" : "secondary"} className="text-[10px]">
                              {item.jenis}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 w-8 p-0">
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Kategori</Label>
              <Input
                id="nama"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Masukkan nama kategori (e.g. Obat Umum)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis</Label>
              <Select
                value={formData.jenis}
                onValueChange={(val) => setFormData({ ...formData, jenis: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEDIS">MEDIS</SelectItem>
                  <SelectItem value="NON-MEDIS">NON-MEDIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALERT DELETE */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus kategori <strong>{selectedItem?.nama}</strong>. Data yang terkait mungkin akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(selectedItem?.id)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}