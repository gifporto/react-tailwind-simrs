"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvBatchAPI, InvBarangAPI } from "@/lib/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

import { Search, Layers, Loader2, Plus, Edit, Trash2, CalendarIcon, Banknote, ChevronDown, CalendarCheck2, CalendarX2 } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function BatchInventoryPage() {
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
    id_barang: "",
    no_batch: "",
    exp_date: "", // Simpan sebagai string YYYY-MM-DD
    hpp: 0,
    tgl_terima: "", // Simpan sebagai string YYYY-MM-DD
    is_aktif: true
  });

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["batch-list", page, search],
    queryFn: () => InvBatchAPI.getList(page, perPage, search),
    placeholderData: (previousData) => previousData,
  });

  const { data: barangList } = useQuery({
    queryKey: ["barang-opt"],
    queryFn: () => InvBarangAPI.getList(1, 100)
  });

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     MUTATIONS
  ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) => InvBatchAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-list"] });
      toast.success("Batch baru berhasil didaftarkan");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal mendaftarkan batch"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => InvBatchAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-list"] });
      toast.success("Data batch berhasil diperbarui");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Gagal memperbarui batch"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => InvBatchAPI.delete(id, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-list"] });
      toast.success("Batch berhasil dihapus");
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error("Gagal menghapus batch"),
  });

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenDialog = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        id_barang: item.id_barang?.toString() || "",
        no_batch: item.no_batch,
        exp_date: item.exp_date ? item.exp_date.split("T")[0] : "",
        tgl_terima: item.tgl_terima ? item.tgl_terima.split("T")[0] : "",
        hpp: Number(item.hpp),
        is_aktif: Boolean(item.is_aktif)
      });
    } else {
      setSelectedItem(null);
      setFormData({
        id_barang: "",
        no_batch: "",
        exp_date: format(new Date(), "yyyy-MM-dd"),
        hpp: 0,
        tgl_terima: format(new Date(), "yyyy-MM-dd"),
        is_aktif: true
      });
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 w-full">
              <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                <Layers className="w-6 h-6" /> Batch Inventori
              </CardTitle>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari No. Batch..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="bg-primary/5">{total} Total Batch</Badge>
              </div>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Batch
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading && listData.length === 0 ? (
              <div className="space-y-3"><Skeleton className="h-40 w-full" /></div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>No. Batch & Barang</TableHead>
                        <TableHead>Tgl. Terima / EXP</TableHead>
                        <TableHead>HPP</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground text-xs font-mono">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{item.no_batch}</span>
                              <span className="text-xs text-muted-foreground">{item.barang?.nama}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <CalendarCheck2 className="w-3 h-3 text-green-500" />
                                {item.tgl_terima ? format(new Date(item.tgl_terima), "dd MMM yyyy") : "-"}
                              </div>
                              <div className="flex items-center gap-1 font-semibold text-red-500">
                                <CalendarX2 className="w-3 h-3" />
                                {item.exp_date ? format(new Date(item.exp_date), "dd MMM yyyy") : "-"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            Rp. {new Intl.NumberFormat('id-ID').format(item.hpp)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 w-8 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                              <Button variant="outline" size="sm" onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true); }} className="h-8 w-8 p-0 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Batch" : "Tambah Batch Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Pilih Barang</Label>
              <Select value={formData.id_barang} onValueChange={(val) => setFormData({ ...formData, id_barang: val })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Barang..." /></SelectTrigger>
                <SelectContent>
                  {barangList?.data?.map((b: any) => (
                    <SelectItem key={b.id} value={b.id.toString()}>[{b.kd_barang}] {b.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_batch">No. Batch</Label>
              <Input id="no_batch" required value={formData.no_batch} onChange={(e) => setFormData({ ...formData, no_batch: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* TGL TERIMA - DATEPICKER */}
              <div className="space-y-2 flex flex-col">
                <Label>Tgl. Terima</Label>
                <DatePicker
                  value={formData.tgl_terima}
                  onChange={(date) => setFormData({ ...formData, tgl_terima: date })}
                />
              </div>

              {/* EXP DATE - DATEPICKER */}
              <div className="space-y-2 flex flex-col">
                <Label>Tgl. Kadaluarsa</Label>
                <DatePicker
                  value={formData.exp_date}
                  onChange={(date) => setFormData({ ...formData, exp_date: date })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hpp">HPP</Label>
              <Input id="hpp" type="number" step="0.01" value={formData.hpp} onChange={(e) => setFormData({ ...formData, hpp: Number(e.target.value) })} />
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {/* ... AlertDialog Content remains same ... */}
      </AlertDialog>
    </motion.div>
  );
}

// INTERNAL COMPONENT: DATEPICKER SHADCN
function DatePicker({ value, onChange }: { value: string, onChange: (date: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const dateValue = value ? parseISO(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          {dateValue ? format(dateValue, "dd/MM/yyyy") : <span>Pilih Tanggal</span>}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"))
              setOpen(false)
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}