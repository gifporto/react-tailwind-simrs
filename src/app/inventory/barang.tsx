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
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
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

import { Search, Box, Loader2, Plus, Edit, Trash2, Factory, Pill } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";
import { useKategoriOptions } from "@/hooks/queries/use-kategori-queries";
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

  // Inisialisasi Full Payload
  const initialFormState = {
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
    // Field Khusus Obat
    golongan: "BEBAS",
    kategori: "GENERIK",
    fornas: false,
    kode_kfa: "",
    perlu_resep: false,
    nama_generik: "",
    bentuk: "",
    indikasi: "",
    dosis_umum: "",
    aturan_pakai_default: "",
    kontraindikasi: "",
    efek_samping: "",
    cara_penyimpanan: "",
    suhu_min: 0,
    suhu_max: 0,
    bisa_diganti: false,
    masuk_billing: true
  };

  const [formData, setFormData] = React.useState(initialFormState);

  /* =======================
     FETCH DATA
  ======================= */
  const { data: apiResponse, isLoading } = useBarangList(page, perPage, search);
  const { data: kategoriList } = useKategoriOptions();
  const { data: pabrikList, isLoading: isLoadingPabrik } = useKategoriOptions(); // Asumsi endpoint sama atau ganti ke usePabrikOptions
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
        ...initialFormState, // Reset ke default dulu
        ...item, // Timpa dengan data yang ada
        id_kategori: item.id_kategori?.toString() || "",
        id_satuan: item.id_satuan?.toString() || "",
        id_pabrik: item.id_pabrik?.toString() || "",
      });
    } else {
      setSelectedItem(null);
      setFormData(initialFormState);
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

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = e.target.value;
    setFormData({ ...formData, [field]: val === "" ? 0 : Number(val) });
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
                              <span className="text-red-500 font-medium">Min: {item.min_stok}</span> /
                              <span className="text-green-600 font-medium ml-1">Max: {item.max_stok}</span>
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
                <CustomPagination page={page} perPage={perPage} total={total} lastPage={lastPage} setPage={setPage} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* DIALOG FORM CREATE/EDIT */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[95vw] overflow-y-auto lg:max-w-[700px] max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Data Barang" : "Tambah Barang Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">

            {/* SECTION 1: DATA UMUM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kd_barang">Kode Barang</Label>
                <Input id="kd_barang" required value={formData.kd_barang} onChange={(e) => setFormData({ ...formData, kd_barang: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nama">Nama Barang / Obat</Label>
                <Input id="nama" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Jenis</Label>
                <Select value={formData.jenis} onValueChange={(val) => setFormData({ ...formData, jenis: val })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["OBAT", "ALKES", "BHP", "ATK", "LINEN", "MAKANAN", "UMUM"].map(j => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.id_kategori} onValueChange={(val) => setFormData({ ...formData, id_kategori: val })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                  <SelectContent>
                    {kategoriList?.data?.map((k: any) => (
                      <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Satuan</Label>
                <Select value={formData.id_satuan} onValueChange={(val) => setFormData({ ...formData, id_satuan: val })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Satuan" /></SelectTrigger>
                  <SelectContent>
                    {satuanList?.data?.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.desk_satuan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pabrik</Label>
                <Select value={formData.id_pabrik} onValueChange={(val) => setFormData({ ...formData, id_pabrik: val })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Pabrik" /></SelectTrigger>
                  <SelectContent>
                    {pabrikList?.data?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stok">Min Stok</Label>
                <Input
                  id="min_stok"
                  type="number"
                  value={formData.min_stok === 0 ? "" : formData.min_stok}
                  onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                  onChange={(e) => handleNumberInput(e, "min_stok")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_stok">Max Stok</Label>
                <Input
                  id="max_stok"
                  type="number"
                  value={formData.max_stok === 0 ? "" : formData.max_stok}
                  onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                  onChange={(e) => handleNumberInput(e, "max_stok")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spesifikasi">Spesifikasi</Label>
              <Textarea id="spesifikasi" value={formData.spesifikasi} onChange={(e) => setFormData({ ...formData, spesifikasi: e.target.value })} />
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
              <Switch id="is_aktif" checked={formData.is_aktif} onCheckedChange={(val) => setFormData({ ...formData, is_aktif: val })} />
              <Label htmlFor="is_aktif">Barang Aktif</Label>
            </div>

            {/* SECTION 2: KHUSUS OBAT (CONDITIONAL) */}
            {formData.jenis === "OBAT" && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="font-bold flex items-center gap-2 text-blue-600"><Pill className="w-4 h-4" /> Detail Spesifik Obat</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Golongan</Label>
                    <Select value={formData.golongan} onValueChange={(val) => setFormData({ ...formData, golongan: val })}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEBAS">BEBAS</SelectItem>
                        <SelectItem value="BEBAS TERBATAS">BEBAS TERBATAS</SelectItem>
                        <SelectItem value="KERAS">KERAS</SelectItem>
                        <SelectItem value="NARKOTIKA">NARKOTIKA</SelectItem>
                        <SelectItem value="PSIKOTROPIKA">PSIKOTROPIKA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori Obat</Label>
                    <Select value={formData.kategori} onValueChange={(val) => setFormData({ ...formData, kategori: val })}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERIK">GENERIK</SelectItem>
                        <SelectItem value="PATEN">PATEN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kode_kfa">Kode KFA (Satu Sehat)</Label>
                    <Input id="kode_kfa" value={formData.kode_kfa} onChange={(e) => setFormData({ ...formData, kode_kfa: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Generik</Label>
                    <Input value={formData.nama_generik} onChange={(e) => setFormData({ ...formData, nama_generik: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bentuk Sediaan</Label>
                    <Input placeholder="Contoh: Kapsul, Tablet, Sirup" value={formData.bentuk} onChange={(e) => setFormData({ ...formData, bentuk: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Indikasi</Label>
                    <Textarea value={formData.indikasi} onChange={(e) => setFormData({ ...formData, indikasi: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Dosis Umum</Label>
                    <Textarea value={formData.dosis_umum} onChange={(e) => setFormData({ ...formData, dosis_umum: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Suhu Simpan (Min-Max)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={formData.suhu_min === 0 ? "" : formData.suhu_min}
                        onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                        onChange={(e) => handleNumberInput(e, "suhu_min")}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={formData.suhu_max === 0 ? "" : formData.suhu_max}
                        onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                        onChange={(e) => handleNumberInput(e, "suhu_max")}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="perlu_resep" checked={formData.perlu_resep} onCheckedChange={(val) => setFormData({ ...formData, perlu_resep: !!val })} />
                      <Label htmlFor="perlu_resep">Perlu Resep Dokter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fornas" checked={formData.fornas} onCheckedChange={(val) => setFormData({ ...formData, fornas: !!val })} />
                      <Label htmlFor="fornas">Masuk FORNAS</Label>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="bisa_diganti" checked={formData.bisa_diganti} onCheckedChange={(val) => setFormData({ ...formData, bisa_diganti: !!val })} />
                      <Label htmlFor="bisa_diganti">Dapat Diganti (Substitusi)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="masuk_billing" checked={formData.masuk_billing} onCheckedChange={(val) => setFormData({ ...formData, masuk_billing: !!val })} />
                      <Label htmlFor="masuk_billing">Masuk Billing</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
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