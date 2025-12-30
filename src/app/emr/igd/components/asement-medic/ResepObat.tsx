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
    Search,
    X,
    Check,
    SearchIcon,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { AsesmentMedicAPI, InvBarangAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import KunjunganLayanan from "@/components/kunjunganLayanan";

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
    onSuccess?: () => void;
}

const DrugSearchSection = ({
    entry,
    index,
    updateField,
    editable,
}: {
    entry: DrugEntry;
    index: number;
    updateField: (index: number, field: keyof DrugEntry, value: any) => void;
    editable: boolean;
}) => {
    const [tempSearch, setTempSearch] = React.useState("");
    const [results, setResults] = React.useState<any[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);

    // Fungsi Pencarian Utama
    const onSearch = React.useCallback(async (query: string) => {
        if (query.length < 3) {
            setResults([]);
            return;
        }
        try {
            setIsSearching(true);
            const res = await InvBarangAPI.getList(1, 30, query);
            setResults(res.data || []);
        } catch (error) {
            console.error("Gagal mengambil data obat:", error);
            // toast.error("Gagal mengambil data obat");
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Efek Auto Search (Debounce 500ms)
    useEffect(() => {
        if (tempSearch.length < 3) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            onSearch(tempSearch);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [tempSearch, onSearch]);

    const handleSelect = (item: any) => {
        if (!editable) return;
        const isCurrentlySelected = entry.id_obat === item.id;

        if (isCurrentlySelected) {
            updateField(index, "id_obat", 0);
            updateField(index, "nama_obat", "");
        } else {
            updateField(index, "id_obat", item.id);
            updateField(index, "nama_obat", item.nama);
            // Bersihkan hasil setelah memilih untuk merapikan UI
            setResults([]);
            setTempSearch("");
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    {/* Icon berubah jadi loading jika sedang mencari */}
                    {isSearching ? (
                        <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-primary animate-spin" />
                    ) : (
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    )}

                    <input
                        className="flex h-9 w-full rounded-md border border-input bg-background px-9 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Ketik nama obat (min. 3 huruf)..."
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        disabled={!editable}
                    />
                    {tempSearch && (
                        <button
                            type="button"
                            onClick={() => {
                                setTempSearch("");
                                setResults([]);
                            }}
                            className="absolute right-2.5 top-2.5"
                        >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>
                {/* Tombol cari manual tetap ada sebagai alternatif */}
                <Button
                    type="button"
                    size="sm"
                    onClick={() => onSearch(tempSearch)}
                    disabled={isSearching || !editable || tempSearch.length < 3}
                    className="h-9 px-4 text-xs font-bold"
                >
                    {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                </Button>
            </div>

            {/* HASIL PENCARIAN */}
            {results.length > 0 && (
                <div className="border rounded-md overflow-hidden bg-slate-50/50 animate-in fade-in slide-in-from-top-1 duration-200 shadow-sm">
                    <div className="flex items-center justify-between px-3 py-1 bg-slate-100/50 border-b">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Ditemukan {results.length} Obat</span>
                        <button onClick={() => setResults([])} className="text-slate-400 hover:text-slate-600">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto divide-y divide-slate-100">
                        {results.map((item: any) => {
                            const isChecked = entry.id_obat === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                                        isChecked ? "bg-primary/10" : "hover:bg-white"
                                    )}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => handleSelect(item)}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase truncate",
                                                isChecked ? "text-primary" : "text-slate-700"
                                            )}>
                                                {item.nama}
                                            </span>
                                            {isChecked && <Badge className="h-3 px-1 text-[8px]">Terpilih</Badge>}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {item.spesifikasi}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* DATA TERPILIH (STAY PERMANEN DIBAWAH SEARCH) */}
            {entry.id_obat !== 0 && (
                <div className="flex items-start gap-3 p-3 bg-white border-2 border-primary/30 rounded-lg shadow-sm animate-in zoom-in-95">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0">
                        <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-primary leading-none uppercase tracking-tight">
                            {entry.nama_obat}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-[9px] h-4 font-mono bg-slate-50">ID: {entry.id_obat}</Badge>
                            <span className="text-[10px] text-muted-foreground italic">Siap untuk diresepkan</span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                            updateField(index, "id_obat", 0);
                            updateField(index, "nama_obat", "");
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default function Prescription({ initialData = [], editable = false, onSuccess }: Props) {
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
            isNew: true,
        };
        setNewEntries([newEntry, ...newEntries]);
    };

    const removeEntry = (targetId: string | number) => {
        setNewEntries(newEntries.filter((e) => e.id !== targetId));
    };

    const updateField = (index: number, field: keyof DrugEntry, value: any) => {
        setNewEntries((prev) => {
            const next = [...prev]; // Salin array
            next[index] = { ...next[index], [field]: value }; // Salin objek di dalam array
            return next;
        });
    };

    const handleSave = async () => {
        if (newEntries.length === 0) return;
        if (newEntries.some((e) => e.id_obat === 0)) {
            toast.error("Pastikan semua obat sudah dipilih");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                kunjungan_id: "1", // Sesuaikan Kunjungan ID
                drugs: newEntries.map(({ isNew, id, nama_obat, ...rest }) => ({
                    ...rest,
                    qty: Number(rest.qty),
                })),
            };

            await AsesmentMedicAPI.updateResepObat(id!, payload);
            toast.success("Resep baru berhasil disimpan");
            setNewEntries([]);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error("Gagal menyimpan resep");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResep = async (resepId: number) => {
        if (!id) return;
        try {
            setLoading(true);
            await AsesmentMedicAPI.deleteResepObat(id, resepId.toString());
            setHistoryList(historyList.filter(r => r.id !== resepId));
            toast.success("Resep berhasil dihapus");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error("Gagal menghapus resep");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AccordionItem value="prescription" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-bold">15</Badge>
                    <span>Peresepan Dokter</span>
                </div>
            </AccordionTrigger>

            <AccordionContent className="p-4 space-y-6">
                <div className="flex items-center justify-between pb-4">
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

                {/* LIST CARD UNTUK INPUT BARU */}
                <div className="space-y-3">
                    {newEntries.map((entry, index) => (
                        <Card key={entry.id} className="border-primary/40 bg-primary/[0.01] shadow-none">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <Badge>Obat Baru</Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive"
                                        onClick={() => removeEntry(entry.id!)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* KOLOM PENCARIAN OBAT */}
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Cari & Pilih Obat</Label>
                                        <DrugSearchSection
                                            entry={entry}
                                            index={index}
                                            updateField={updateField}
                                            editable={editable}
                                        />

                                        {/* INPUT QTY & SIGNA DIBAWAH SEARCH */}
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Qty</Label>
                                                <Input type="number" className="h-8 text-xs bg-background" value={entry.qty} onChange={(e) => updateField(index, "qty", e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Signa</Label>
                                                <Input placeholder="3x1" className="h-8 text-xs font-mono bg-background" value={entry.signa} onChange={(e) => updateField(index, "signa", e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* JADWAL DOSIS */}
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Jadwal Pakai (P/S/S/M)</Label>
                                        <div className="flex gap-2 bg-muted/30 p-2 rounded-md border border-dashed">
                                            {["pagi", "siang", "sore", "malam"].map((t) => (
                                                <div key={t} className="flex-1 text-center space-y-1">
                                                    <Input
                                                        className="h-8 text-center text-xs p-0 bg-background uppercase font-bold"
                                                        value={(entry as any)[t]}
                                                        onChange={(e) => updateField(index, t as any, e.target.value)}
                                                    />
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{t[0]}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Indikasi</Label>
                                            <Input placeholder="Contoh: Demam" className="h-8 text-xs bg-background" value={entry.indikasi} onChange={(e) => updateField(index, "indikasi", e.target.value)} />
                                        </div>
                                    </div>

                                    {/* KETERANGAN & CATATAN */}
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Instruksi Khusus</Label>
                                            <Input placeholder="Jangan dikunyah..." className="h-8 text-xs bg-background" value={entry.instruksi_khusus} onChange={(e) => updateField(index, "instruksi_khusus", e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Cara Pakai</Label>
                                            <Input placeholder="Sesudah makan" className="h-8 text-xs bg-background" value={entry.cara_pakai} onChange={(e) => updateField(index, "cara_pakai", e.target.value)} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground text-destructive">Catatan Penting</Label>
                                            <Input placeholder="Hentikan jika gatal" className="h-8 text-xs bg-background italic" value={entry.catatan} onChange={(e) => updateField(index, "catatan", e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {editable && newEntries.length > 0 && (
                    <div className="flex justify-end pt-2 border-t">
                        <Button onClick={handleSave} disabled={loading} className="gap-2 px-8">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Kirim ke Farmasi
                        </Button>
                    </div>
                )}

                {/* RIWAYAT RESEP (Sesuai Struktur JSON) */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Riwayat Resep Terdaftar</h4>
                    </div>

                    {historyList.length > 0 ? (
                        historyList.map((resep) => (
                            <div key={resep.id} className="rounded-lg border bg-background shadow-sm overflow-hidden mb-4">
                                <div className="bg-muted/40 p-3 border-b flex justify-between items-center">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold font-mono text-primary uppercase leading-none">No: {resep.no_resep}</span>
                                            <Badge variant="outline" className="text-[9px] h-4 bg-white px-1 uppercase">{resep.kd_sts_resep}</Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                                            <Clock className="w-3 h-3" />
                                            {resep.tgl_resep ? format(new Date(resep.tgl_resep), "dd/MM/yyyy HH:mm") : "-"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={resep.is_terima === "Y" ? "success" : "warning"}>
                                            {resep.is_terima === "Y" ? "Diterima" : "Pending"}
                                        </Badge>
                                        {editable && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Resep ini?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus resep <span className="font-bold text-foreground">{resep.no_resep}</span>?
                                                            Tindakan ini tidak dapat dibatalkan dan data akan terhapus dari sistem.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteResep(resep.id)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>

                                <div className="divide-y divide-dashed">
                                    {resep.details?.map((detail: any, i: number) => (
                                        <div key={i} className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center hover:bg-muted/5">
                                            <div className="md:col-span-1">
                                                <p className="text-xs font-bold text-primary leading-tight uppercase">{detail.obat?.desk_brg}</p>
                                                <p className="text-[9px] text-muted-foreground italic mt-0.5 uppercase">{detail.obat?.spesifikasi}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="text-center">
                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Qty</p>
                                                    <p className="font-semibold">{detail.qty}</p>
                                                </div>
                                                <div className="border-l pl-4 font-bold">
                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Signa</p>
                                                    <p className="text-primary">{detail.signa}</p>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {["pagi", "siang", "sore", "malam"].map((t) => (
                                                        detail[t] && detail[t] !== "0" && (
                                                            <div key={t} className="flex flex-col items-center">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="h-5 px-2 text-[9px] bg-primary/5 text-primary font-bold border-primary/20 uppercase"
                                                                >
                                                                    {t}
                                                                </Badge>
                                                                <span className="text-[8px] font-bold">Dosis: {detail[t]}x</span>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-[10px] border-l pl-3 space-y-0.5">
                                                <p className="italic text-muted-foreground leading-tight">"{detail.cara_pakai || "-"}"</p>
                                                {detail.catatan && <p className="text-destructive font-bold text-[9px]">Nb: {detail.catatan}</p>}
                                            </div>
                                            <div className="text-[10px] border-l pl-3 space-y-0.5">
                                                {detail.indikasi || "-"}
                                                <p className="text-destructive"> ({detail.instruksi_khusus || "-"})</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {resep.alergi === "Y" && (
                                    <div className="bg-destructive/5 p-2 flex items-center gap-2 border-t">
                                        <AlertCircle className="w-3 h-3 text-destructive" />
                                        <span className="text-[10px] font-bold text-destructive uppercase">Pasien Alergi: {resep.ket_alergi || "Riwayat Alergi"}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-muted/5 border-2 border-dashed rounded-lg">
                            <p className="text-xs text-muted-foreground">Belum ada riwayat peresepan.</p>
                        </div>
                    )}
                </div>

                <KunjunganLayanan api="EmrIgdAPI" />

            </AccordionContent>
        </AccordionItem>
    );
}