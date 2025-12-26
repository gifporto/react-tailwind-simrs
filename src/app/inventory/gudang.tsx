"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvGudangAPI } from "@/lib/api"; 
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

import { Search, Warehouse, Loader2, Plus, Edit, Trash2 } from "lucide-react";

export default function GudangIndexPage() {
  const queryClient = useQueryClient();

  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  // States for Dialog & Form
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedGudang, setSelectedGudang] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({ nama: "", jenis: "UMUM" });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["gudang-list", page, search],
    queryFn: () => InvGudangAPI.getList(page, perPage, search),
    placeholderData: (previousData) => previousData, 
  });

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     MUTATIONS (CREATE, UPDATE, DELETE)
  ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) => InvGudangAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gudang-list"] });
      toast.success("Gudang berhasil ditambahkan");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal menambah gudang"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => InvGudangAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gudang-list"] });
      toast.success("Gudang berhasil diperbarui");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal memperbarui gudang"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => InvGudangAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gudang-list"] });
      toast.success("Gudang berhasil dihapus");
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error("Gagal menghapus gudang"),
  });

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenDialog = (gudang?: any) => {
    if (gudang) {
      setSelectedGudang(gudang);
      setFormData({ nama: gudang.nama, jenis: gudang.jenis });
    } else {
      setSelectedGudang(null);
      setFormData({ nama: "", jenis: "UMUM" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGudang) {
      updateMutation.mutate({ id: selectedGudang.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getJenisVariant = (jenis: string) => {
    switch (jenis?.toUpperCase()) {
      case "FARMASI": return "default";
      case "UMUM": return "secondary";
      default: return "outline";
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
                  <Warehouse className="w-6 h-6" />
                  Manajemen Gudang
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kelola daftar lokasi penyimpanan barang dan farmasi.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama gudang..."
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
                  {total} Total Gudang
                </Badge>
              </div>
            </div>

            <Button onClick={() => handleOpenDialog()} className="gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Gudang
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
                <Warehouse className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground font-medium">Data gudang tidak ditemukan</p>
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
                        <TableHead>Nama Gudang</TableHead>
                        <TableHead>Jenis</TableHead>
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
                            <Badge variant={getJenisVariant(item.jenis)} className="text-[10px] font-bold">
                              {item.jenis}
                            </Badge>
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
                                  setSelectedGudang(item);
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

                {/* PAGINATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <p className="text-xs text-muted-foreground">
                    Menampilkan <span className="font-medium">{(page - 1) * perPage + 1}</span> -{" "}
                    <span className="font-medium">{Math.min(page * perPage, total)}</span> dari{" "}
                    <span className="font-medium">{total}</span> data
                  </p>

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
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* DIALOG CREATE & EDIT */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGudang ? "Edit Gudang" : "Tambah Gudang Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Gudang</Label>
              <Input
                id="nama"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Gudang Farmasi Utama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Gudang</Label>
              <Select
                value={formData.jenis}
                onValueChange={(value) => setFormData({ ...formData, jenis: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FARMASI">FARMASI</SelectItem>
                  <SelectItem value="UMUM">UMUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Perubahan
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
              Tindakan ini tidak dapat dibatalkan. Data gudang <strong>{selectedGudang?.nama}</strong> akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(selectedGudang?.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}