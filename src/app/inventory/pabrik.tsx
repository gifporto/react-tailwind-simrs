"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvPabrikAPI } from "@/lib/api"; // Sesuaikan path
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Search, Factory, Loader2, Plus, Edit, Trash2, Phone, MapPin } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function PabrikIndexPage() {
  const queryClient = useQueryClient();

  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  // States for Dialog & Form
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPabrik, setSelectedPabrik] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    nama: "",
    telepon: "",
    alamat: ""
  });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["pabrik-list", page, search],
    queryFn: () => InvPabrikAPI.getList(page, perPage, search),
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
    mutationFn: (payload: any) => InvPabrikAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pabrik-list"] });
      toast.success("Pabrik berhasil ditambahkan");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal menambah pabrik"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => InvPabrikAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pabrik-list"] });
      toast.success("Pabrik berhasil diperbarui");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal memperbarui pabrik"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => InvPabrikAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pabrik-list"] });
      toast.success("Pabrik berhasil dihapus");
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error("Gagal menghapus pabrik"),
  });

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenDialog = (pabrik?: any) => {
    if (pabrik) {
      setSelectedPabrik(pabrik);
      setFormData({
        nama: pabrik.nama,
        telepon: pabrik.telepon,
        alamat: pabrik.alamat
      });
    } else {
      setSelectedPabrik(null);
      setFormData({ nama: "", telepon: "", alamat: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPabrik) {
      updateMutation.mutate({ id: selectedPabrik.id, payload: formData });
    } else {
      createMutation.mutate(formData);
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
                <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                  <Factory className="w-6 h-6" />
                  Manajemen Pabrik / Suplier
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kelola daftar produsen dan pemasok barang/obat.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama pabrik..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                <Badge variant="outline" className="h-7 border-primary/20 bg-primary/5 text-primary">
                  {total} Total Pabrik
                </Badge>
              </div>
            </div>

            <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Pabrik
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading && listData.length === 0 ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : listData.length === 0 ? (
              <div className="text-center py-20">
                <Factory className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground font-medium">Data pabrik tidak ditemukan</p>
                {isError && (
                  <Button variant="ghost" onClick={() => refetch()} className="mt-2 text-primary">
                    Coba Lagi
                  </Button>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[80px]">No</TableHead>
                        <TableHead>Informasi Pabrik</TableHead>
                        <TableHead>Kontak & Alamat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground text-xs">{(page - 1) * perPage + i + 1}</TableCell>

                          <TableCell>
                            <div className="font-semibold text-sm">{item.nama}</div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="w-3 h-3" /> {item.telepon || "-"}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="line-clamp-1">{item.alamat || "-"}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenDialog(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPabrik(item);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

      {/* DIALOG CREATE & EDIT */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedPabrik ? "Edit Pabrik" : "Tambah Pabrik Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Pabrik / Perusahaan</Label>
              <Input
                id="nama"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: PT. Kimia Farma"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telepon">Nomor Telepon</Label>
              <Input
                id="telepon"
                type="number"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="0274-XXXX-XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat Lengkap</Label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Masukkan alamat lengkap pabrik..."
                className="min-h-[100px]"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {selectedPabrik ? "Simpan Perubahan" : "Tambah Pabrik"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALERT DIALOG DELETE */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus <strong>{selectedPabrik?.nama}</strong> dari sistem secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(selectedPabrik?.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}