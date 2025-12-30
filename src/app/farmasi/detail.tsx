"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResepDetail, useApproveResep } from "@/hooks/queries/farmasi/use-resep-queries";
import { useStockMonitoring } from "@/hooks/queries/use-stock-queries";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { cn } from "@/lib/utils";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Pill,
    User,
    Clock,
    ArrowLeft,
    Check,
    AlertCircle,
    ClipboardList,
    FileText,
    CheckCircle2,
    PackageCheck,
    Loader2,
    Printer,
} from "lucide-react";
import { toast } from "sonner";

export default function FarResepDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State: { [ID_ITEM]: STOCK_ID }
    const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});

    /* =====================
       FETCH DATA API
    ===================== */
    const { data: apiResponse, isLoading, isError } = useResepDetail(id as string);
    const resep = apiResponse?.data;

    const { data: stockData } = useStockMonitoring("list", 1, 1000, "") as any;
    const availableStocks = stockData?.data || [];

    const { mutate: approveMutation, isPending: isApproving } = useApproveResep();

    if (isLoading) return <LoadingSkeleton lines={20} />;

    if (isError || !resep) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-bold">Data Tidak Ditemukan</h3>
                <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
            </div>
        );
    }

    /* =====================
       HANDLERS
    ===================== */
    const handleToggleItem = (itemId: number, checked: boolean) => {
        setSelectedItems((prev) => {
            const newState = { ...prev };
            if (checked) newState[itemId] = 0;
            else delete newState[itemId];
            return newState;
        });
    };

    const handleSelectStock = (itemId: number, stockId: string) => {
        setSelectedItems((prev) => ({ ...prev, [itemId]: parseInt(stockId) }));
    };

    const onApprove = () => {
        const itemIds = Object.keys(selectedItems);
        if (itemIds.length === 0) return toast.error("Pilih minimal satu item!");

        const isValid = itemIds.every((itemId) => selectedItems[parseInt(itemId)] !== 0);
        if (!isValid) return toast.error("Harap pilih Batch Stok untuk semua item yang dicentang!");

        const payload = {
            items: itemIds.map((itemId) => ({
                id: parseInt(itemId),
                stock_id: selectedItems[parseInt(itemId)],
            })),
        };
        approveMutation({ id: id as string, payload });
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">

                {/* INFO RESEP */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-primary font-bold uppercase tracking-tight">
                                <ClipboardList className="w-5 h-5" />
                                Detail Resep Farmasi
                            </CardTitle>
                            <CardDescription>No. Resep: {resep.no_resep}</CardDescription>
                        </div>
                        <Badge variant={resep.status?.toLowerCase() === 'disetujui' ? 'success' : 'outline'} className="uppercase">
                            {resep.status}
                        </Badge>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <Info label="Tanggal Resep">{resep.tanggal_resep}</Info>
                        <Info label="Dokter DPJP">{resep.dokter?.nama}</Info>
                        <Info label="Catatan Dokter">{resep.catatan_dokter}</Info>
                    </CardContent>
                </Card>

                

                {/* LIST ITEM OBAT */}
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Pill className="w-5 h-5 text-primary" />
                                <CardTitle className="text-lg">Item & Penyiapan Stok</CardTitle>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                                Total: {resep.details?.length} Item
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-border">
                            {resep.details?.map((detail: any, index: number) => {
                                const isSelected = selectedItems.hasOwnProperty(detail.id);

                                if (detail.is_racikan) {
                                    return (
                                        <Accordion key={detail.id} type="single" collapsible className="w-full">
                                            <AccordionItem value={detail.id.toString()} className="border-none">
                                                {/* Bungkus seluruh area header list dengan AccordionTrigger */}
                                                <AccordionTrigger className="hover:no-underline px-4 py-4 w-full [&[data-state=open]>svg]:rotate-180">
                                                    <div className="w-full">
                                                        <div className="flex items-center gap-4 w-full text-left">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-bold text-sm uppercase leading-none">
                                                                        {detail.racikan?.nama_racikan}
                                                                    </span>
                                                                    <Badge variant="outline" className="text-[10px] h-4 bg-amber-50 text-amber-700 border-amber-200">
                                                                        RACIKAN
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1 font-normal">
                                                                    <FileText className="w-3 h-3" /> {detail.aturan_pakai}
                                                                </p>
                                                            </div>
                                                            <div className="text-right px-4">
                                                                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Qty</p>
                                                                <p className="font-bold text-lg leading-none">{detail.jumlah}</p>
                                                            </div>
                                                            {/* Icon chevron otomatis ada dari AccordionTrigger bawaan shadcn */}
                                                        </div>
                                                        {detail.catatan_dokter && (
                                                            <div className="mt-3 p-2 bg-muted/50 rounded text-[11px] text-muted-foreground border-l-2 border-muted italic">
                                                                Catatan: {detail.catatan_dokter}
                                                            </div>
                                                        )}
                                                    </div>
                                                </AccordionTrigger>

                                                <AccordionContent className="px-4">
                                                    <div className="space-y-2 pb-4 pt-1">
                                                        {detail.racikan?.items?.map((rItem: any) => {
                                                            const isRSelected = selectedItems.hasOwnProperty(rItem.id);
                                                            const stocks = availableStocks.filter((s: any) => Number(s.id_barang) === Number(rItem.obat_id));
                                                            return (
                                                                <div
                                                                    key={rItem.id}
                                                                    className={cn(
                                                                        " p-3 rounded-lg border transition-all",
                                                                        isRSelected ? "bg-primary/5 border-primary/30 shadow-sm" : "bg-muted/30"
                                                                    )}
                                                                >
                                                                    <div className="flex justify-between">
                                                                        <div className="flex gap-4 items-center">
                                                                            <Checkbox
                                                                                checked={isRSelected}
                                                                                onCheckedChange={(c) => handleToggleItem(rItem.id, !!c)}
                                                                                disabled={resep.status === "DISETUJUI"}
                                                                                // Penting: Hentikan propagasi agar klik checkbox tidak menutup accordion
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-bold uppercase truncate">{rItem.nama}</p>
                                                                                <p className="text-[10px] text-muted-foreground">Dosis: {rItem.dosis} {rItem.satuan_dosis}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div onClick={(e) => e.stopPropagation()}>
                                                                            {isRSelected && (
                                                                                <Select onValueChange={(v) => handleSelectStock(rItem.id, v)}>
                                                                                    <SelectTrigger className="h-8 text-xs bg-background">
                                                                                        <SelectValue placeholder="Pilih Batch" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {stocks.map((s: any) => (
                                                                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                                                                {s.batch?.no_batch} (Sisa: {parseFloat(s.qty).toFixed(0)})
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {rItem.catatan && (
                                                                        <div className="mt-3 ml-8 p-2 bg-muted/50 rounded text-[11px] text-muted-foreground border-l-2 border-muted italic">
                                                                            Catatan: {rItem.catatan}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    );
                                } else {
                                    const stocks = availableStocks.filter((s: any) => Number(s.id_barang) === Number(detail.obat?.id));
                                    return (
                                        <div key={detail.id} className={cn(
                                            "p-4 transition-colors",
                                            isSelected ? "bg-primary/[0.03]" : "hover:bg-muted/20"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(c) => handleToggleItem(detail.id, !!c)}
                                                    disabled={resep.status === "DISETUJUI"}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-sm uppercase truncate leading-none">{detail.obat?.nama}</span>
                                                        <Badge variant="outline" className="text-[10px] h-4">NON-RACIKAN</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                                                        <FileText className="w-3.5 h-3.5" /> {detail.aturan_pakai}
                                                    </p>
                                                </div>
                                                <div className="text-right px-6">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Qty</p>
                                                    <p className="font-bold text-lg leading-none">{detail.jumlah}</p>
                                                </div>
                                                <div>
                                                    {isSelected && (
                                                        <Select onValueChange={(v) => handleSelectStock(detail.id, v)}>
                                                            <SelectTrigger className="bg-background">
                                                                <SelectValue placeholder="Pilih Batch Stok" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {stocks.map((s: any) => (
                                                                    <SelectItem key={s.id} value={s.id.toString()}>
                                                                        <span className="font-medium">{s.batch?.no_batch}</span>
                                                                        <span className="ml-2 text-muted-foreground text-xs">Sisa: {parseFloat(s.qty).toFixed(0)}</span>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            </div>
                                            {detail.catatan_dokter && (
                                                <div className="mt-3 ml-8 p-2 bg-muted/50 rounded text-[11px] text-muted-foreground border-l-2 border-muted italic">
                                                    Catatan: {detail.catatan_dokter}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SIDEBAR */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Aksi Petugas</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            className="w-full h-11 gap-2 bg-green-600 hover:bg-green-700 font-bold shadow-sm"
                            disabled={Object.keys(selectedItems).length === 0 || isApproving || resep.status === "DISETUJUI"}
                            onClick={onApprove}
                        >
                            {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-5 h-5" />}
                            APPROVE ({Object.keys(selectedItems).length}) ITEM
                        </Button>
                        <Button variant="outline" className="w-full gap-2" disabled={resep.status !== "DISETUJUI"}>
                            <Printer className="w-4 h-4" /> Cetak Etiket
                        </Button>
                        <Separator />
                        <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${resep.status === 'DISETUJUI' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                            <ClipboardList className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status Alur Resep</p>
                            <h3 className="text-xl font-bold capitalize">{resep.status}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t pt-4 text-xs">
                            <Summary label="Diterima" ok={true} />
                            <Summary label="Disiapkan" ok={resep.status === "DISETUJUI"} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/* =====================
   HELPERS
===================== */
function Info({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className="flex flex-col space-y-1">
            <Label className="text-muted-foreground text-[11px] uppercase font-bold tracking-tight">{label}</Label>
            <div className={`font-medium text-sm ${className}`}>{children}</div>
        </div>
    );
}

function Summary({ label, ok }: { label: string; ok?: boolean }) {
    return (
        <div>
            <p className="text-muted-foreground mb-1">{label}</p>
            {ok ? <CheckCircle2 className="mx-auto text-green-500 w-4 h-4" /> : <Clock className="mx-auto text-muted-foreground w-4 h-4" />}
        </div>
    );
}