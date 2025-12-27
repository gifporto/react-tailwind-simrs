"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

// HOOKS
import { useOrderList, useCreateOrder, useUpdateOrder, useApproveOrder, useRejectOrder } from "@/hooks/queries/use-order-queries";
import { usePabrikOptions } from "@/hooks/queries/use-pabrik-queries";
import { useGudangOptions } from "@/hooks/queries/use-gudang-queries";
import { useBarangOptions } from "@/hooks/queries/use-barang-queries";
import { useBatchOptions } from "@/hooks/queries/use-batch-queries";

// UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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

// ICONS
import { ShoppingCart, Search, Loader2, Plus, Factory, Warehouse, Receipt, Package, Trash2, CheckCircle2, XCircle, Edit, AlertTriangle } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function PembelianPage() {
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const perPage = 10;

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    // Alert Dialog States
    const [confirmAction, setConfirmAction] = React.useState<{ id: string; type: 'approve' | 'reject' } | null>(null);

    const [formData, setFormData] = React.useState({
        no_faktur: "",
        tgl_beli: format(new Date(), "yyyy-MM-dd"),
        id_pabrik: "",
        id_gudang: "",
        keterangan: "",
        user_id: 1,
        details: [{ id_barang: "", id_batch: "", qty: 0, harga: 0, diskon: 0 }]
    });

    /* =======================
       FETCH DATA
    ======================= */
    const { data: apiResponse, isLoading } = useOrderList(page, perPage);
    const { data: pabrikList } = usePabrikOptions();
    const { data: gudangList } = useGudangOptions();
    const { data: barangList } = useBarangOptions();
    const { data: batchList } = useBatchOptions();

    const listData = (apiResponse as any)?.data || [];
    const pagination = (apiResponse as any)?.meta?.pagination;
    const lastPage = pagination?.total_pages || 1;
    const total = pagination?.total || 0;

    /* =======================
       MUTATIONS
    ======================= */
    const createMutation = useCreateOrder();
    const updateMutation = useUpdateOrder();
    const approveMutation = useApproveOrder();
    const rejectMutation = useRejectOrder();

    const onApprove = async () => {
        if (!confirmAction) return;
        toast.promise(approveMutation.mutateAsync(confirmAction.id), {
            loading: 'Menyetujui pembelian...',
            success: () => {
                setConfirmAction(null);
                return 'Pembelian disetujui, stok telah bertambah';
            },
            error: 'Gagal menyetujui pembelian',
        });
    };

    const onReject = async () => {
        if (!confirmAction) return;
        toast.promise(rejectMutation.mutateAsync(confirmAction.id), {
            loading: 'Menolak pembelian...',
            success: () => {
                setConfirmAction(null);
                return 'Pembelian telah ditolak';
            },
            error: 'Gagal menolak pembelian',
        });
    };

    const handleOpenDialog = (item?: any) => {
        if (item) {
            setSelectedId(item.id);
            setFormData({
                no_faktur: item.no_faktur,
                tgl_beli: format(new Date(item.tgl_beli), "yyyy-MM-dd"),
                id_pabrik: item.id_supplier?.toString(),
                id_gudang: item.id_gudang?.toString(),
                keterangan: item.keterangan || "",
                user_id: 1,
                details: item.details.map((d: any) => ({
                    id_barang: d.id_barang.toString(),
                    id_batch: d.id_batch.toString(),
                    qty: Number(d.qty),
                    harga: Number(d.harga),
                    diskon: Number(d.diskon)
                }))
            });
        } else {
            setSelectedId(null);
            setFormData({
                no_faktur: "", tgl_beli: format(new Date(), "yyyy-MM-dd"),
                id_pabrik: "", id_gudang: "", keterangan: "", user_id: 1,
                details: [{ id_barang: "", id_batch: "", qty: 0, harga: 0, diskon: 0 }]
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mutation = selectedId ? updateMutation : createMutation;

        mutation.mutate(selectedId ? { id: selectedId, payload: formData } : formData as any, {
            onSuccess: () => {
                toast.success(selectedId ? "Perubahan berhasil disimpan" : "Pembelian berhasil dibuat");
                setIsDialogOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || "Terjadi kesalahan"),
        });
    };

    const addDetailRow = () => {
        setFormData({
            ...formData,
            details: [...formData.details, { id_barang: "", id_batch: "", qty: 0, harga: 0, diskon: 0 }]
        });
    };

    const removeDetailRow = (index: number) => {
        const newDetails = formData.details.filter((_, i) => i !== index);
        setFormData({ ...formData, details: newDetails });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-4 w-full">
                            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                                <ShoppingCart className="w-6 h-6" /> Transaksi Pembelian
                            </CardTitle>
                            <div className="flex flex-wrap gap-3 items-center">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nomor faktur..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Badge variant="outline" className="bg-primary/5">{total} Transaksi</Badge>
                            </div>
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="gap-2">
                            <Plus className="w-4 h-4" /> Pembelian Baru
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="space-y-3"><Skeleton className="h-40 w-full" /></div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-[50px] text-center">No</TableHead>
                                                <TableHead>Faktur & Tanggal</TableHead>
                                                <TableHead>Supplier & Gudang</TableHead>
                                                <TableHead>Total Item</TableHead>
                                                <TableHead>Total Bayar</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {listData.map((item: any, i: number) => (
                                                <TableRow key={item.id} className="group">
                                                    <TableCell className="text-center text-xs font-mono">{i + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-blue-600 text-sm uppercase">{item.no_faktur}</span>
                                                            <span className="text-[10px] text-muted-foreground">{format(new Date(item.tgl_beli), "dd/MM/yyyy")}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm flex items-center gap-1"><Factory className="w-3 h-3" /> {item.supplier?.nama}</span>
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Warehouse className="w-3 h-3" /> {item.gudang?.nama || "Gudang Belum Diset"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm">{item.details?.length} Item</TableCell>
                                                    <TableCell className="font-semibold text-green-600">Rp {Number(item.total).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.status === 'APPROVED' ? 'success' : item.status === 'CANCELLED' ? 'destructive' : 'secondary'}>
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            {item.status === "DRAFT" && (
                                                                <>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => handleOpenDialog(item)}>
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => setConfirmAction({ id: item.id, type: 'approve' })}>
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setConfirmAction({ id: item.id, type: 'reject' })}>
                                                                        <XCircle className="w-4 h-4" />
                                                                    </Button>
                                                                </>
                                                            )}
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

            {/* DIALOG FORM PEMBELIAN */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[95vw] overflow-y-auto lg:max-w-[1200px] max-h-[95vh] flex flex-col p-0">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Receipt className="w-6 h-6 text-primary" />
                            {selectedId ? "Edit Transaksi Pembelian" : "Input Pembelian Inventory"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* SECTION: HEADER INFO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-primary/5 p-4 rounded-xl border border-primary/10">
                                <div className="space-y-2">
                                    <Label className="text-primary font-semibold">Nomor Faktur</Label>
                                    <Input required className="bg-white" value={formData.no_faktur} onChange={(e) => setFormData({ ...formData, no_faktur: e.target.value })} placeholder="PO-2025-XXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-primary font-semibold">Tanggal Beli</Label>
                                    <Input type="date" className="bg-white" value={formData.tgl_beli} onChange={(e) => setFormData({ ...formData, tgl_beli: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-primary font-semibold">Supplier</Label>
                                    <Select value={formData.id_pabrik} onValueChange={(v) => setFormData({ ...formData, id_pabrik: v })}>
                                        <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Pilih Supplier" /></SelectTrigger>
                                        <SelectContent>
                                            {pabrikList?.data?.map((p: any) => (<SelectItem key={p.id} value={p.id.toString()}>{p.nama}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-primary font-semibold">Gudang Penerima</Label>
                                    <Select value={formData.id_gudang} onValueChange={(v) => setFormData({ ...formData, id_gudang: v })}>
                                        <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Pilih Gudang" /></SelectTrigger>
                                        <SelectContent>
                                            {gudangList?.data?.map((g: any) => (<SelectItem key={g.id} value={g.id.toString()}>{g.nama}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* SECTION: ITEM LIST (CARD VERSION) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                        Daftar Barang
                                    </h3>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={addDetailRow}
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Item
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <AnimatePresence>
                                        {formData.details.map((detail, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="relative group bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                                            >
                                                {/* Badge Nomor & Tombol Hapus */}
                                                <div className="absolute -top-2 -left-2 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                                    {idx + 1}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={formData.details.length === 1}
                                                    onClick={() => removeDetailRow(idx)}
                                                    className="absolute -top-2 -right-2 bg-white border text-destructive hover:bg-red-50 h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                    {/* Pilihan Barang & Batch */}
                                                    <div className="col-span-12 lg:col-span-5 space-y-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Informasi Barang</Label>
                                                            <Select value={detail.id_barang} onValueChange={(v) => {
                                                                const newDetails = [...formData.details];
                                                                newDetails[idx].id_barang = v;
                                                                newDetails[idx].id_batch = "";
                                                                setFormData({ ...formData, details: newDetails });
                                                            }}>
                                                                <SelectTrigger className="w-full bg-muted/20">
                                                                    <SelectValue placeholder="Cari & Pilih Barang" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {barangList?.data?.map((b: any) => (
                                                                        <SelectItem key={b.id} value={b.id.toString()}>{b.nama}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Nomor Batch</Label>
                                                            <Select
                                                                disabled={!detail.id_barang}
                                                                value={detail.id_batch}
                                                                onValueChange={(v) => {
                                                                    const newDetails = [...formData.details];
                                                                    newDetails[idx].id_batch = v;
                                                                    setFormData({ ...formData, details: newDetails });
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full bg-muted/20">
                                                                    <SelectValue placeholder="Pilih Batch" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {batchList?.data?.filter((b: any) => b.id_barang.toString() === detail.id_barang).map((b: any) => (
                                                                        <SelectItem key={b.id} value={b.id.toString()}>{b.no_batch}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    {/* Input Angka */}
                                                    <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
                                                        {/* Input Qty */}
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Jumlah (Qty)</Label>
                                                            <Input
                                                                type="number"
                                                                className="bg-muted/20"
                                                                // JIKA value 0 tampilkan kosong agar user langsung ketik
                                                                value={detail.qty === 0 ? "" : detail.qty}
                                                                onChange={(e) => {
                                                                    const newDetails = [...formData.details];
                                                                    // JIKA input kosong, Number("") akan menghasilkan 0
                                                                    newDetails[idx].qty = Number(e.target.value);
                                                                    setFormData({ ...formData, details: newDetails });
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Input Potongan (Diskon) */}
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Potongan (Rp)</Label>
                                                            <Input
                                                                type="number"
                                                                className="bg-muted/20"
                                                                value={detail.diskon === 0 ? "" : detail.diskon}
                                                                onChange={(e) => {
                                                                    const newDetails = [...formData.details];
                                                                    newDetails[idx].diskon = Number(e.target.value);
                                                                    setFormData({ ...formData, details: newDetails });
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Input Harga Satuan */}
                                                        <div className="col-span-2 space-y-2">
                                                            <Label className="text-xs font-bold uppercase text-muted-foreground">Harga Satuan</Label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                                                                <Input
                                                                    type="number"
                                                                    className="pl-9 bg-muted/20"
                                                                    value={detail.harga === 0 ? "" : detail.harga}
                                                                    onChange={(e) => {
                                                                        const newDetails = [...formData.details];
                                                                        newDetails[idx].harga = Number(e.target.value);
                                                                        setFormData({ ...formData, details: newDetails });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Subtotal Card */}
                                                    <div className="col-span-12 lg:col-span-3 flex flex-col justify-end">
                                                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-right">
                                                            <Label className="text-[10px] uppercase font-bold text-primary/60">Subtotal Item</Label>
                                                            <p className="text-lg font-black text-primary">
                                                                Rp {((detail.qty * detail.harga) - detail.diskon).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold">Catatan Internal</Label>
                                <Textarea value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} placeholder="Tulis catatan tambahan di sini..." />
                            </div>
                        </div>

                        <DialogFooter className="p-6 border-t bg-muted/20">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-left">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Grand Total</p>
                                    <p className="text-2xl font-black text-primary">
                                        Rp {formData.details.reduce((acc, curr) => acc + (curr.qty * curr.harga) - curr.diskon, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                        {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {selectedId ? "Simpan Perubahan" : "Proses Pembelian"}
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* CONFIRMATION ALERT DIALOG */}
            <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className={confirmAction?.type === 'approve' ? "text-green-600" : "text-red-600"} />
                            Konfirmasi {confirmAction?.type === 'approve' ? 'Persetujuan' : 'Penolakan'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction?.type === 'approve'
                                ? "Apakah Anda yakin ingin menyetujui transaksi ini? Stok barang akan otomatis bertambah sesuai detail pembelian."
                                : "Apakah Anda yakin ingin menolak transaksi ini? Transaksi yang ditolak tidak dapat diproses kembali."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmAction?.type === 'approve' ? onApprove : onReject}
                            className={confirmAction?.type === 'approve' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            Lanjutkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}