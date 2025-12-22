"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Plus,
    Trash2,
    Save,
    Loader2,
    History,
    Pill,
    ShoppingCart,
    Clock,
    AlertCircle,
    Stethoscope,
    Info
} from "lucide-react";

import { AsesmentMedicAPI } from "@/lib/api";

interface DrugEntry {
    id?: string | number;
    id_obat: number;
    nama_obat: string;
    qty: number;
    signa: string;
    cara_pakai: string;
    pagi: string;
    siang: string;
    sore: string;
    malam: string;
    indikasi: string;
    instruksi_khusus: string;
    catatan: string;
    isNew?: boolean;
}

interface Props {
    initialData?: any[];
    editable?: boolean;
}

export default function Prescription({ initialData = [], editable = false }: Props) {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [newEntries, setNewEntries] = useState<DrugEntry[]>([]);
    const [historyList, setHistoryList] = useState<any[]>([]);

    useEffect(() => {
        if (initialData && Array.isArray(initialData)) {
            setHistoryList(initialData);
        }
    }, [initialData]);

    const addEntry = () => {
        const newEntry: DrugEntry = {
            id: Date.now(),
            id_obat: 0,
            nama_obat: "",
            qty: 1,
            signa: "",
            cara_pakai: "",
            pagi: "0",
            siang: "0",
            sore: "0",
            malam: "0",
            indikasi: "",
            instruksi_khusus: "",
            catatan: "",
            isNew: true
        };
        setNewEntries([newEntry, ...newEntries]);
    };

    const removeEntry = (targetId: string | number) => {
        setNewEntries(newEntries.filter(e => e.id !== targetId));
    };

    const updateField = (index: number, field: keyof DrugEntry, value: string | number) => {
        const updatedEntries = [...newEntries];
        updatedEntries[index] = { ...updatedEntries[index], [field]: value } as DrugEntry;
        setNewEntries(updatedEntries);
    };

    const handleSave = async () => {
        if (newEntries.length === 0) return;
        try {
            setLoading(true);
            const payload = {
                kunjungan_id: "2",
                drugs: newEntries.map(({ isNew, id, nama_obat, ...rest }) => ({
                    ...rest,
                    qty: Number(rest.qty)
                }))
            };
            await AsesmentMedicAPI.updateResepObat(id!, payload);
            toast.success("Resep baru berhasil disimpan");
            setNewEntries([]);
        } catch (error) {
            toast.error("Gagal menyimpan resep");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccordionItem value="prescription" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">15</Badge>
                    Peresepan Dokter
                </div>
            </AccordionTrigger>

            <AccordionContent className="p-4 space-y-6">
                {/* HEADER INPUT */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-primary" /> Input Obat Baru
                        </h4>
                    </div>
                    {editable && (
                        <Button variant="outline" size="sm" onClick={addEntry} disabled={loading}>
                            <Plus className="h-4 w-4 mr-1" /> Tambah Obat
                        </Button>
                    )}
                </div>

                {/* --- LIST CARD UNTUK INPUT BARU --- */}
                <div className="space-y-3">
                    {newEntries.map((entry, index) => (
                        <Card key={entry.id} className="border-primary/30 bg-primary/[0.01] shadow-none animate-in slide-in-from-top-2">
                            <CardContent>
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <Badge>Data Baru</Badge>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeEntry(entry.id!)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Nama Obat</Label>
                                            <Input placeholder="Cari obat..." className="h-8 text-xs bg-background" value={entry.nama_obat} onChange={(e) => updateField(index, "nama_obat", e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Qty</Label>
                                                <Input type="number" className="h-8 text-xs bg-background text-center" value={entry.qty} onChange={(e) => updateField(index, "qty", e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Signa</Label>
                                                <Input placeholder="3x1" className="h-8 text-xs bg-background text-center font-mono" value={entry.signa} onChange={(e) => updateField(index, "signa", e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Jadwal Pakai (P/S/S/M)</Label>
                                        <div className="flex gap-2 bg-muted/30 p-2 rounded-md border border-dashed">
                                            {['pagi', 'siang', 'sore', 'malam'].map((t) => (
                                                <div key={t} className="flex-1 text-center space-y-1">
                                                    <Input className="h-8 text-center text-xs p-0 bg-background uppercase font-bold" maxLength={1} value={(entry as any)[t]} onChange={(e) => updateField(index, t as any, e.target.value)} />
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{t[0]}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Cara Pakai / Instruksi</Label>
                                            <Input placeholder="Sesudah makan..." className="h-8 text-xs bg-background" value={entry.cara_pakai} onChange={(e) => updateField(index, "cara_pakai", e.target.value)} />
                                        </div>
                                        <Input placeholder="Instruksi khusus / Catatan..." className="h-8 text-xs bg-background italic" value={entry.catatan} onChange={(e) => updateField(index, "catatan", e.target.value)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editable && newEntries.length > 0 && (
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSave} disabled={loading} className="gap-2 px-8 shadow-md">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Simpan Resep
                        </Button>
                    </div>
                )}

                {/* --- RIWAYAT RESEP (OLD VALUE CARD LIST LENGKAP) --- */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Riwayat Resep Terdaftar</h4>
                    </div>

                    {historyList.length > 0 ? (
                        historyList.map((resep) => (
                            <div key={resep.id}>
                                {/* Header Card Riwayat */}
                                <div className="mb-4 px-3 flex justify-between items-center">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold font-mono uppercase tracking-tighter text-muted-foreground">No Resep:</span>
                                            <span className="text-[11px] font-bold font-mono text-primary">{resep.no_resep}</span>
                                            <Badge variant="outline" className="text-[9px] h-4 leading-none bg-background px-1 uppercase">{resep.kd_sts_resep}</Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {resep.tgl_resep ? format(new Date(resep.tgl_resep), "dd/MM/yyyy HH:mm") : "-"}
                                            <span className="mx-1">•</span>
                                            <Stethoscope className="w-3 h-3" />
                                            Dokter ID: {resep.id_dokter || '-'}
                                        </div>
                                    </div>
                                    <Badge variant={resep.is_terima === "Y" ? "success" : "warning"}>
                                        {resep.is_terima === "Y" ? "Diterima Farmasi" : "Belum Verifikasi"}
                                    </Badge>
                                </div>

                                {/* Body Details Obat */}
                                <div className="flex flex-col gap-2">
                                    {resep.details?.map((detail: any, i: number) => (
                                        <Card key={i}>
                                            <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                                {/* Info Nama Obat */}
                                                <div className="md:col-span-4 flex gap-3">
                                                    <div className="bg-primary/5 p-2 rounded-lg border border-primary/10">
                                                        <Pill className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-primary leading-tight">{detail.obat?.desk_brg}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                            <Badge variant="secondary" className="text-[8px] h-3.5 px-1 uppercase tracking-tight">{detail.obat?.spesifikasi}</Badge>
                                                            <span className="italic">KFA: {detail.obat?.kd_kfa || '-'}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Aturan Pakai */}
                                                <div className="md:col-span-3 flex flex-col gap-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Qty</span>
                                                            <span className="text-xs font-semibold">{detail.qty}</span>
                                                        </div>
                                                        <div className="flex flex-col border-l pl-4">
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Signa</span>
                                                            <span className="text-xs font-mono font-bold text-blue-600">{detail.signa}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1.5 mt-1">
                                                        {['pagi', 'siang', 'sore', 'malam'].map(t => (
                                                            detail[t] === "1" && (
                                                                <Badge key={t} variant="outline" className="h-5 px-1.5 text-[9px] uppercase border-primary/20 text-primary bg-primary/5 font-bold">
                                                                    {t[0]}
                                                                </Badge>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Keterangan & Instruksi */}
                                                <div className="md:col-span-5 text-[11px] space-y-1.5 bg-muted/20 p-2 rounded border border-muted-foreground/10">
                                                    <div className="flex gap-2">
                                                        <span className="font-bold text-muted-foreground min-w-[70px] uppercase text-[9px]">Cara Pakai:</span>
                                                        <span className="italic">"{detail.cara_pakai || '-'}"</span>
                                                    </div>
                                                    {detail.indikasi && (
                                                        <div className="flex gap-2">
                                                            <span className="font-bold text-muted-foreground min-w-[70px] uppercase text-[9px]">Indikasi:</span>
                                                            <span>{detail.indikasi}</span>
                                                        </div>
                                                    )}
                                                    {detail.instruksi_khusus && (
                                                        <div className="flex gap-2 text-amber-700 bg-amber-50 p-1 rounded">
                                                            <Info className="w-3 h-3 mt-0.5 shrink-0" />
                                                            <span>{detail.instruksi_khusus}</span>
                                                        </div>
                                                    )}
                                                    {detail.catatan && (
                                                        <div className="flex gap-2 text-destructive font-bold border-t border-dashed mt-1 pt-1">
                                                            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                            <span className="text-[10px]">NB: {detail.catatan}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Status Alergi Footer */}
                                {resep.alergi === "Y" && (
                                    <div className="bg-destructive/[0.05] p-2 flex items-center gap-2 border-t border-destructive/20">
                                        <AlertCircle className="w-3.5 h-3.5 text-destructive animate-pulse" />
                                        <span className="text-[10px] font-bold text-destructive uppercase tracking-tight">Perhatian Alergi: {resep.ket_alergi || "Cek Riwayat Alergi Pasien"}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-muted/10 border-2 border-dashed rounded-lg">
                            <History className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground italic">Belum ada riwayat peresepan ditemukan.</p>
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}