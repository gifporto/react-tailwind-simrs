"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStockMonitoring, useUpdateStock } from "@/hooks/queries/use-stock-queries";
import { useBarangOptions } from "@/hooks/queries/use-barang-queries";
import { useBatchOptions } from "@/hooks/queries/use-batch-queries";
import { useGudangOptions } from "@/hooks/queries/use-gudang-queries";
import { InvStockAPI, InvBarangAPI, InvBatchAPI, InvGudangAPI } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import {
    Package,
    Search,
    Loader2,
    Plus,
    Warehouse,
    Layers,
    TrendingDown,
    Calendar,
    AlertCircle,
    ClipboardCheck
} from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";

export default function InventoriStokPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = React.useState("summary");
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const perPage = 10;

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        id_barang: "",
        id_batch: "",
        id_gudang: "",
        qty: 0,
    });

    /* =======================
       FETCH DATA
    ======================= */
   const { data: apiResponse, isLoading } = useStockMonitoring(activeTab, page, perPage, search);
    
    // Options menggunakan hooks yang sudah dibuat sebelumnya
    const { data: barangList } = useBarangOptions();
    const { data: batchList } = useBatchOptions();
    const { data: gudangList } = useGudangOptions();

    
    const listData = Array.isArray((apiResponse as any)?.data)
        ? (apiResponse as any).data
        : (apiResponse as any)?.data?.alerts || [];

    const pagination = (apiResponse as any)?.meta?.pagination;
    const total = pagination?.total || (activeTab === "alerts" ? (apiResponse as any)?.data?.total : 0) || listData.length;
    const lastPage = pagination?.total_pages || 1;

    /* =======================
       MUTATIONS
    ======================= */
    const createMutation = useUpdateStock();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Stok berhasil diperbarui");
                setIsDialogOpen(false);
                setFormData({ id_barang: "", id_batch: "", id_gudang: "", qty: 0 });
            },
            onError: () => toast.error("Gagal memperbarui stok"),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case "good": return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 uppercase text-[10px] px-2">Aman</Badge>;
            case "low":
            case "low_stock": return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100 uppercase text-[10px] px-2">Menipis</Badge>;
            case "critical": return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 uppercase text-[10px] px-2">Kritis</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px] px-2">{status}</Badge>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-4 w-full">
                            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                                <Package className="w-6 h-6" /> Monitoring Stok
                            </CardTitle>

                            <div className="flex flex-wrap gap-3 items-center">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari barang..."
                                        className="pl-10"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    />
                                </div>
                                <Badge variant="outline" className="bg-primary/5 h-9 px-4">{total} Entri</Badge>
                            </div>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 shadow-sm">
                            <Plus className="w-4 h-4" /> Update Stok
                        </Button>
                    </div>
                </CardHeader>

                <div className="px-6 pt-6">
                    <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1); }} className="w-full">
                        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-2xl mb-2 bg-muted/50 p-1">
                            <TabsTrigger value="summary" className="text-xs">Ringkasan</TabsTrigger>
                            <TabsTrigger value="list" className="text-xs">Log Stok</TabsTrigger>
                            <TabsTrigger value="warehouse" className="text-xs">Per Gudang</TabsTrigger>
                            <TabsTrigger value="batch" className="text-xs">Per Batch</TabsTrigger>
                            <TabsTrigger value="alerts" className="text-xs data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                                <AlertCircle className="w-3.5 h-3.5 mr-2" /> Peringatan
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <CardContent className="pt-4">
                    <AnimatePresence mode="wait">
                        {isLoading && listData.length === 0 ? (
                            <div className="space-y-3"><Skeleton className="h-60 w-full" /></div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="rounded-lg border overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-[60px] text-center">No</TableHead>
                                                <TableHead>Informasi Barang</TableHead>
                                                {activeTab === "summary" && (
                                                    <>
                                                        <TableHead>Total Stok</TableHead>
                                                        <TableHead>Sebaran</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </>
                                                )}
                                                {(activeTab === "list" || activeTab === "batch") && (
                                                    <>
                                                        <TableHead>No. Batch</TableHead>
                                                        <TableHead>Gudang</TableHead>
                                                        <TableHead>Qty</TableHead>
                                                        <TableHead>Update</TableHead>
                                                    </>
                                                )}
                                                {activeTab === "warehouse" && (
                                                    <>
                                                        <TableHead>Gudang</TableHead>
                                                        <TableHead>Total Stok</TableHead>
                                                        <TableHead>Jumlah Batch</TableHead>
                                                    </>
                                                )}
                                                {activeTab === "alerts" && (
                                                    <>
                                                        <TableHead>Masalah</TableHead>
                                                        <TableHead>Min. Stok</TableHead>
                                                        <TableHead>Stok Sekarang</TableHead>
                                                    </>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {listData.length === 0 ? (
                                                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Data tidak ditemukan.</TableCell></TableRow>
                                            ) : (
                                                listData.map((item: any, i: number) => (
                                                    <TableRow key={i} className="hover:bg-muted/30">
                                                        <TableCell className="text-center text-xs text-muted-foreground font-mono">
                                                            {(page - 1) * perPage + i + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-mono text-[10px] text-blue-600 font-bold">{item.barang?.kd_barang || "-"}</span>
                                                                <span className="font-semibold text-sm">{item.barang?.nama || "Unknown"}</span>
                                                            </div>
                                                        </TableCell>

                                                        {activeTab === "summary" && (
                                                            <>
                                                                <TableCell className="font-bold text-sm text-primary">{item.total_qty}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-2">
                                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border">
                                                                            <Warehouse className="w-3 h-3" /> {item.total_warehouses}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border">
                                                                            <Layers className="w-3 h-3" /> {item.total_batches}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                            </>
                                                        )}

                                                        {(activeTab === "list" || activeTab === "batch") && (
                                                            <>
                                                                <TableCell className="text-xs font-mono font-medium">{item.batch?.no_batch || item.id_batch || "-"}</TableCell>
                                                                <TableCell className="text-sm">{item.gudang?.nama || "-"}</TableCell>
                                                                <TableCell className="font-bold text-sm">{item.qty || item.total_qty}</TableCell>
                                                                <TableCell className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString('id-ID') : "-"}
                                                                </TableCell>
                                                            </>
                                                        )}

                                                        {activeTab === "warehouse" && (
                                                            <>
                                                                <TableCell className="text-sm font-medium">{item.gudang?.nama || "Gudang Utama"}</TableCell>
                                                                <TableCell className="font-bold text-sm">{item.total_qty}</TableCell>
                                                                <TableCell className="text-xs text-muted-foreground">{item.total_batches} Batch Terdata</TableCell>
                                                            </>
                                                        )}

                                                        {activeTab === "alerts" && (
                                                            <>
                                                                <TableCell>
                                                                    <div className="flex items-start gap-2 text-red-600">
                                                                        <TrendingDown className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                                        <span className="text-xs font-medium leading-tight">{item.message}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-xs font-semibold">{item.min_stok}</TableCell>
                                                                <TableCell className="text-xs font-bold text-red-600">
                                                                    <span className="bg-red-50 px-2 py-1 rounded border border-red-100">{item.current_qty}</span>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                                    <p className="text-xs text-muted-foreground">
                                        Menampilkan <span className="font-medium">{(page - 1) * perPage + 1}</span> - {Math.min(page * perPage, total)} dari {total} data
                                    </p>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                            </PaginationItem>
                                            <PaginationItem><PaginationLink isActive>{page}</PaginationLink></PaginationItem>
                                            <PaginationItem>
                                                <PaginationNext onClick={() => setPage(p => Math.min(lastPage, p + 1))} className={page === lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* DIALOG UPDATE STOK (MATCHED WITH BARANGINDEX STYLE) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ClipboardCheck className="w-5 h-5 text-primary" />
                            Update Stok Inventori
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Pilih Barang</Label>
                            <Select onValueChange={(v) => setFormData({ ...formData, id_barang: v })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Barang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {barangList?.data?.map((b: any) => (
                                        <SelectItem key={b.id} value={b.id.toString()}>
                                            {b.kd_barang} - {b.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Batch</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, id_batch: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="No. Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batchList?.data?.map((b: any) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>{b.no_batch}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Gudang</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, id_gudang: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Lokasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gudangList?.data?.map((g: any) => (
                                            <SelectItem key={g.id} value={g.id.toString()}>{g.nama}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qty">Jumlah Penambahan (Qty)</Label>
                            <Input
                                id="qty"
                                type="number"
                                placeholder="0.00"
                                value={formData.qty}
                                onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                                className="font-mono"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Perubahan Stok
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}