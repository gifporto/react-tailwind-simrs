"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Info, Save, Loader2, Search,
    Crosshair, ClipboardCheck, Trash2, RotateCcw
} from "lucide-react";
import { AsesmentMedicAPI } from "@/lib/api";

const SURVEY_FIELDS = [
    { key: "kepala", label: "Kepala" },
    { key: "mata", label: "Mata" },
    { key: "leher", label: "Leher" },
    { key: "tht", label: "THT" },
    { key: "thorax", label: "Thorax" },
    { key: "jantung", label: "Jantung" },
    { key: "paru", label: "Paru" },
    { key: "abdomen", label: "Abdomen" },
    { key: "genitalia", label: "Genitalia" },
    { key: "ekstremitas", label: "Ekstremitas" },
];

export default function PhysicalExam({ initialData, editable = false }: { initialData?: any, editable?: boolean }) {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [form, setForm] = useState({
        kondisi_pasien: "Aman dan Stabil",
        kondisi_pasien_keterangan: "",
        kepala: "normal",
        mata: "normal",
        leher: "normal",
        tht: "normal",
        thorax: "normal",
        jantung: "normal",
        paru: "normal",
        abdomen: "normal",
        genitalia: "normal",
        ekstremitas: "normal",
        secondary_keterangan: "",
        lokalis_keterangan: "",
        pemeriksaan_fisik_tambahan: "",
        lokalis_koordinat: [] as any[],
        lokalis_files: [] as string[],
    });

    useEffect(() => {
        if (initialData) {
            setForm((prev) => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!editable || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        // Menghitung posisi klik dalam persentase (%) relatif terhadap ukuran gambar
        const xPercentage = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercentage = ((e.clientY - rect.top) / rect.height) * 100;

        const newPoint = {
            x: xPercentage,
            y: yPercentage,
            region: "",
            finding: ""
        };

        setForm({ ...form, lokalis_koordinat: [...form.lokalis_koordinat, newPoint] });
    };
    const removeLastPoint = () => {
        setForm({ ...form, lokalis_koordinat: form.lokalis_koordinat.slice(0, -1) });
    };

    const clearPoints = () => {
        setForm({ ...form, lokalis_koordinat: [] });
    };

    // Fungsi untuk memperbarui data spesifik pada titik tertentu
    const updatePointData = (index: number, field: string, value: string) => {
        const updatedPoints = [...form.lokalis_koordinat];
        updatedPoints[index] = { ...updatedPoints[index], [field]: value };
        setForm({ ...form, lokalis_koordinat: updatedPoints });
    };

    // Fungsi untuk menghapus titik spesifik berdasarkan index
    const removePoint = (index: number) => {
        const updatedPoints = form.lokalis_koordinat.filter((_, i) => i !== index);
        setForm({ ...form, lokalis_koordinat: updatedPoints });
    };

    const handleSave = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await AsesmentMedicAPI.updatePemeriksaanFisik(id, form);
            toast.success("Pemeriksaan Fisik berhasil disimpan");
        } catch (error) {
            toast.error("Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccordionItem value="pemeriksaanFisik" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">11</Badge>
                    <span>Pemeriksaan Fisik</span>
                </div>
            </AccordionTrigger>

            <AccordionContent className="p-4 space-y-6">
                <Alert variant="info" className="bg-blue-50 border-none shadow-none">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800 font-medium">
                        Lakukan pemeriksaan fisik secara sistematis (ABCDE & Head-to-Toe).
                    </AlertDescription>
                </Alert>

                {/* Primary Survey */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Survey (ABCDE)</h4>
                    </div>

                    <Card className="shadow-none border-muted">
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-3">
                                <Label>Kondisi Pasien</Label>
                                <RadioGroup
                                    value={form.kondisi_pasien}
                                    onValueChange={(val) => setForm({ ...form, kondisi_pasien: val })}
                                    disabled={!editable || loading}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-2"
                                >
                                    {["Aman dan Stabil", "Tidak Aman", "Lainnya"].map((opt) => (
                                        <Label
                                            key={opt}
                                            htmlFor={`kondisi-${opt}`}
                                            className={`flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer ${form.kondisi_pasien === opt
                                                ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                                                : "border-transparent bg-muted/30 hover:bg-muted"
                                                }`}
                                        >
                                            <RadioGroupItem value={opt} id={`kondisi-${opt}`} className="sr-only" />
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[11px] font-bold uppercase tracking-tight">{opt}</span>
                                                <span className="text-[9px] text-muted-foreground italic">
                                                    {opt === "Aman dan Stabil" ? "Pasien hemodinamik stabil" : opt === "Tidak Aman" ? "Gawat darurat" : "Kondisi khusus"}
                                                </span>
                                            </div>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>Keterangan Kondisi Pasien</Label>
                                <Textarea
                                    placeholder="Pasien datang dengan keluhan..."
                                    className="text-xs min-h-[80px]"
                                    value={form.kondisi_pasien_keterangan}
                                    onChange={(e) => setForm({ ...form, kondisi_pasien_keterangan: e.target.value })}
                                    disabled={!editable}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Survey Grid */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secondary Survey (Head-to-Toe)</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {SURVEY_FIELDS.map((field) => {
                            const val = form[field.key as keyof typeof form] as string;
                            return (
                                <Card key={field.key}>
                                    <CardHeader>
                                        <h4 className="font-bold uppercase">{field.label}</h4>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={val}
                                            onValueChange={(v) => setForm({ ...form, [field.key]: v })}
                                            disabled={!editable}
                                            className="flex flex-col gap-1"
                                        >
                                            {["normal", "abnormal"].map((s) => (
                                                <Label
                                                    key={s}
                                                    className={`flex items-center justify-between px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer border transition-all ${val === s
                                                        ? (s === "normal" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700")
                                                        : "bg-white border-transparent hover:bg-muted"
                                                        }`}
                                                >
                                                    {s} <RadioGroupItem value={s} className="sr-only" />
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="space-y-2">
                        <Label>Keterangan Temuan Abnormal</Label>
                        <Textarea
                            placeholder="Ditemukan nyeri tekan pada..."
                            className="text-xs"
                            value={form.secondary_keterangan}
                            onChange={(e) => setForm({ ...form, secondary_keterangan: e.target.value })}
                            disabled={!editable}
                        />
                    </div>
                </div>

                {/* Status Lokalis dengan Canvas Interaktif */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Crosshair className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status Lokalis</h4>
                    </div>

                    <Card className="shadow-none border-muted overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            {/* SISI KIRI: CANVAS GAMBAR */}
                            <div className="md:col-span-1 p-4 flex flex-col items-center">
                                <div
                                    ref={containerRef}
                                    onClick={handleCanvasClick}
                                    className={`relative w-full aspect-square bg-white border rounded-lg overflow-hidden shadow-inner ${editable ? 'cursor-crosshair' : 'cursor-default'}`}
                                >
                                    {/* Gambar Utama dari Public */}
                                    <img
                                        src="/lokalis.png"
                                        alt="Status Lokalis"
                                        className="w-full h-full object-contain pointer-events-none"
                                    />

                                    {/* Render Titik Berdasarkan Persentase */}
                                    {form.lokalis_koordinat.map((point, i) => (
                                        <div
                                            key={i}
                                            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg z-10"
                                            style={{
                                                left: `${point.x}%`,
                                                top: `${point.y}%`
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}

                                    {form.lokalis_koordinat.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/5">
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold text-center px-4">
                                                {editable ? "Klik pada gambar untuk menandai lokasi" : "Tidak ada data"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {editable && (
                                    <div className="mt-3 flex gap-2 w-full">
                                        <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8" onClick={removeLastPoint}>
                                            <RotateCcw className="h-3 w-3 mr-1" /> Undo
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8 text-red-600" onClick={clearPoints}>
                                            <Trash2 className="h-3 w-3 mr-1" /> Clear
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* SISI KANAN: DAFTAR KARTU INPUT */}
                            <div className="md:col-span-2 p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h5 className="text-[11px] font-bold uppercase text-primary">Detail Temuan Per Titik</h5>
                                    <Badge variant="secondary">{form.lokalis_koordinat.length} Titik</Badge>
                                </div>

                                {form.lokalis_koordinat.map((point, i) => (
                                    <Card key={i}>
                                        <CardContent>
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                                                        {i + 1}
                                                    </Badge>
                                                    <span className="text-[8px] text-muted-foreground font-mono">
                                                        {Math.round(point.x)}%,{Math.round(point.y)}%
                                                    </span>
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <Label>Region</Label>
                                                        <Input
                                                            value={point.region}
                                                            onChange={(e) => updatePointData(i, "region", e.target.value)}
                                                            placeholder="Nama area..."
                                                            className="h-8 text-xs"
                                                            disabled={!editable}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Finding</Label>
                                                        <Textarea
                                                            value={point.finding}
                                                            onChange={(e) => updatePointData(i, "finding", e.target.value)}
                                                            placeholder="Temuan klinis..."
                                                            className="min-h-[60px] text-xs resize-none"
                                                            disabled={!editable}
                                                        />
                                                    </div>
                                                </div>

                                                {editable && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removePoint(i)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {editable && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={loading} className="min-w-[180px] h-9 text-xs">
                            {loading ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-2" />} Simpan Pemeriksaan Fisik
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}