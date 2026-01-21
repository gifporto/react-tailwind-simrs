"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConsumableList, useCreateConsume, useCheckStock } from "@/hooks/queries/use-consume-queries";
import { useGudangOptions } from "@/hooks/queries/use-gudang-queries";
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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Search, PackageOpen, Loader2, Plus, ShoppingCart, Trash2, AlertCircle, Info } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";
import { format } from "date-fns";

interface ConsumeItem {
  id_barang: number;
  id_batch: number;
  id_gudang: number;
  qty: number;
  // Display info
  nama_barang?: string;
  kd_barang?: string;
  no_batch?: string;
  nama_gudang?: string;
  hpp?: string;
  stock_available?: number;
}

export default function ConsumeIndexPage() {
  // States
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filterJenis, setFilterJenis] = React.useState<string>("");
  const [filterGudang, setFilterGudang] = React.useState<number | undefined>();
  const perPage = 10;

  // Dialog States
  const [isConsumeDialogOpen, setIsConsumeDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [consumeItems, setConsumeItems] = React.useState<ConsumeItem[]>([]);
  
  // Form States
  const [refNo, setRefNo] = React.useState("");
  const [tujuanPakai, setTujuanPakai] = React.useState("");
  const [keterangan, setKeterangan] = React.useState("");
  const [tglPakai, setTglPakai] = React.useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading } = useConsumableList(
    page,
    perPage,
    search,
    filterJenis,
    filterGudang
  );
  const { data: gudangList } = useGudangOptions(1, 100);

  const listData = apiResponse?.data || [];
  const pagination = apiResponse?.meta?.pagination;
  const lastPage = pagination?.total_pages || 1;
  const total = pagination?.total || 0;

  /* =======================
     MUTATIONS
  ======================= */
  const createMutation = useCreateConsume();

  /* =======================
     HANDLERS
  ======================= */
  const handleOpenConsumeDialog = (item: any) => {
    setSelectedItem(item);
    setConsumeItems([]);
    setRefNo("");
    setTujuanPakai("");
    setKeterangan("");
    setTglPakai(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setIsConsumeDialogOpen(true);
  };

  const handleAddItemToConsume = (batch: any) => {
    if (!selectedItem) return;

    const newItem: ConsumeItem = {
      id_barang: selectedItem.id,
      id_batch: batch.id_batch,
      id_gudang: batch.id_gudang,
      qty: 1,
      // Display info
      nama_barang: selectedItem.nama,
      kd_barang: selectedItem.kd_barang,
      no_batch: batch.no_batch,
      nama_gudang: batch.nama_gudang,
      hpp: batch.hpp,
      stock_available: batch.qty,
    };

    setConsumeItems([...consumeItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setConsumeItems(consumeItems.filter((_, i) => i !== index));
  };

  const handleQtyChange = (index: number, value: string) => {
    const qty = parseFloat(value) || 0;
    const newItems = [...consumeItems];
    newItems[index].qty = qty;
    setConsumeItems(newItems);
  };

  const handleSubmitConsume = () => {
    if (consumeItems.length === 0) {
      toast.error("Tambahkan minimal 1 item untuk dikonsumsi");
      return;
    }

    if (!tujuanPakai.trim()) {
      toast.error("Tujuan pemakaian harus diisi");
      return;
    }

    // Validate stock
    const invalidItems = consumeItems.filter(item => item.qty > (item.stock_available || 0));
    if (invalidItems.length > 0) {
      toast.error(`Qty melebihi stok tersedia untuk ${invalidItems[0].nama_barang}`);
      return;
    }

    const payload = {
      items: consumeItems.map(item => ({
        id_barang: item.id_barang,
        id_batch: item.id_batch,
        id_gudang: item.id_gudang,
        qty: item.qty,
      })),
      ref_no: refNo || undefined,
      tujuan_pakai: tujuanPakai,
      keterangan: keterangan || undefined,
      tgl_pakai: tglPakai,
    };

    createMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(`Pemakaian berhasil dicatat. Total ${response.data.total_items} item`);
        setIsConsumeDialogOpen(false);
        setConsumeItems([]);
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.meta?.description || "Gagal mencatat pemakaian";
        toast.error(errorMsg);
      },
    });
  };

  const totalNilai = consumeItems.reduce((sum, item) => {
    return sum + (parseFloat(item.hpp || "0") * item.qty);
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-4 w-full">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                  <PackageOpen className="w-6 h-6" />
                  Konsumsi Barang
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Catat pemakaian barang non-obat untuk kebutuhan operasional
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama barang..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>

                <Select value={filterJenis || undefined} onValueChange={(val) => { setFilterJenis(val); setPage(1); }}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Semua Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALKES">ALKES</SelectItem>
                    <SelectItem value="BHP">BHP</SelectItem>
                    <SelectItem value="ATK">ATK</SelectItem>
                    <SelectItem value="LINEN">LINEN</SelectItem>
                    <SelectItem value="MAKANAN">MAKANAN</SelectItem>
                    <SelectItem value="UMUM">UMUM</SelectItem>
                  </SelectContent>
                </Select>

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
                  {total} Item Tersedia
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading && listData.length === 0 ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : listData.length === 0 ? (
              <div className="text-center py-20">
                <PackageOpen className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground font-medium">
                  Tidak ada barang consumable ditemukan
                </p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead>Info Barang</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Total Stok</TableHead>
                        <TableHead>Lokasi Stok</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {listData.map((item: any, i: number) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-muted-foreground text-xs">
                            {(page - 1) * perPage + i + 1}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-mono text-[10px] text-blue-600 font-bold">
                                {item.kd_barang}
                              </span>
                              <span className="font-semibold text-sm">{item.nama}</span>
                              <span className="text-xs text-muted-foreground">
                                {item.satuan?.nama || "-"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.jenis}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={item.total_stok > 0 ? "default" : "destructive"}
                              className="font-mono"
                            >
                              {item.total_stok}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              {item.stok_per_gudang?.slice(0, 2).map((stok: any, idx: number) => (
                                <div key={idx} className="text-xs flex items-center gap-2">
                                  <Badge variant="secondary" className="text-[10px]">
                                    {stok.nama_gudang}
                                  </Badge>
                                  <span className="font-mono text-muted-foreground">
                                    {stok.qty} • {stok.no_batch}
                                  </span>
                                </div>
                              ))}
                              {(item.stok_per_gudang?.length || 0) > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{item.stok_per_gudang.length - 2} lokasi lagi
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleOpenConsumeDialog(item)}
                              disabled={item.total_stok === 0}
                              className="gap-2"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Konsumsi
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

      {/* DIALOG CONSUME */}
      <Dialog open={isConsumeDialogOpen} onOpenChange={setIsConsumeDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PackageOpen className="w-5 h-5" />
              Catat Pemakaian Barang
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Item Info */}
            {selectedItem && (
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-blue-600">{selectedItem.kd_barang}</p>
                    <h3 className="font-semibold text-lg">{selectedItem.nama}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total Stok: <strong>{selectedItem.total_stok}</strong> {selectedItem.satuan?.nama}
                    </p>
                  </div>
                  <Badge variant="outline">{selectedItem.jenis}</Badge>
                </div>
              </div>
            )}

            {/* Available Stock Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Pilih Batch & Lokasi</Label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                {selectedItem?.stok_per_gudang?.map((batch: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {batch.nama_gudang}
                        </Badge>
                        <span className="font-mono text-sm font-semibold">{batch.no_batch}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Exp: {batch.exp_date || "-"}</span>
                        <span>Stok: <strong>{batch.qty}</strong></span>
                        <span>HPP: Rp {parseFloat(batch.hpp).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddItemToConsume(batch)}
                      className="gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Items */}
            {consumeItems.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Item Yang Akan Dikonsumsi</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[250px]">Batch & Lokasi</TableHead>
                        <TableHead className="w-[150px]">Qty</TableHead>
                        <TableHead className="text-right">Nilai (HPP)</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consumeItems.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {item.nama_gudang}
                                </Badge>
                                <span className="font-mono text-xs">{item.no_batch}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Tersedia: {item.stock_available}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.qty}
                              onChange={(e) => handleQtyChange(idx, e.target.value)}
                              className="w-[120px]"
                            />
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            Rp {(parseFloat(item.hpp || "0") * item.qty).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(idx)}
                              className="h-8 w-8 p-0 text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30 font-semibold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right font-mono">
                          Rp {totalNilai.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="ref_no">No. Referensi (Opsional)</Label>
                <Input
                  id="ref_no"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="Auto-generate jika kosong"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tgl_pakai">Tanggal & Waktu Pakai</Label>
                <Input
                  id="tgl_pakai"
                  type="datetime-local"
                  value={tglPakai}
                  onChange={(e) => setTglPakai(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="tujuan_pakai">
                  Tujuan Pemakaian <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tujuan_pakai"
                  value={tujuanPakai}
                  onChange={(e) => setTujuanPakai(e.target.value)}
                  placeholder="Contoh: Unit IGD - Tindakan Pasien REG-12345"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                <Textarea
                  id="keterangan"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Catatan atau informasi tambahan..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Info Alert */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <strong>Informasi:</strong> Stok akan otomatis dikurangi setelah pemakaian dicatat.
                Pastikan qty dan batch sudah benar sebelum menyimpan.
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsConsumeDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitConsume}
              disabled={createMutation.isPending || consumeItems.length === 0}
              className="gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Catat Pemakaian ({consumeItems.length} item)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
