"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Route,
    Info,
    ShieldCheck,
    Stethoscope,
    Accessibility,
    HeartPulse,
    Save,
    Bed,
    Footprints,
    Ambulance,
    UserX,
    Cross,
    ClipboardCheck,
    FileText,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
    initialData?: any;
    editable?: boolean;
}

const JENIS_PERENCANAAN = [
    { id: "Preventif", title: "Preventif", icon: <ShieldCheck className="w-5 h-5" />, color: "text-blue-500" },
    { id: "Kuratif", title: "Kuratif", icon: <Stethoscope className="w-5 h-5" />, color: "text-emerald-500" },
    { id: "Rehabilitatif", title: "Rehabilitatif", icon: <Accessibility className="w-5 h-5" />, color: "text-sky-500" },
    { id: "Paliatif", title: "Paliatif", icon: <HeartPulse className="w-5 h-5" />, color: "text-amber-500" },
];

const DISPOSISI = [
    { id: "RawatInap", title: "Rawat Inap", icon: <Bed className="w-5 h-5" />, color: "text-blue-600" },
    { id: "RawatJalan", title: "Rawat Jalan", icon: <Footprints className="w-5 h-5" />, color: "text-emerald-600" },
    { id: "Dirujuk", title: "Dirujuk", icon: <Ambulance className="w-5 h-5" />, color: "text-amber-600" },
    { id: "APS", title: "APS", icon: <UserX className="w-5 h-5" />, color: "text-slate-600" },
    { id: "Meninggal", title: "Meninggal", icon: <Cross className="w-5 h-5" />, color: "text-destructive" },
];

export default function RencanaTindakLanjut({ initialData, editable = false }: Props) {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        jenis_perencanaan: "",
        rencana_detail: "",
        rencana_tindak_lanjut: "",
        detail_rencana_indikasi: "",
        detail_rencana_ruang: "",
        rs_tujuan_rujukan: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                jenis_perencanaan: initialData.jenis_perencanaan || "",
                rencana_detail: initialData.rencana_detail || "",
                rencana_tindak_lanjut: initialData.rencana_tindak_lanjut || "",
                detail_rencana_indikasi: initialData.detail_rencana_indikasi || "",
                detail_rencana_ruang: initialData.detail_rencana_ruang || "",
                rs_tujuan_rujukan: initialData.rs_tujuan_rujukan || ""
            });
        }
    }, [initialData]);

    const handleSave = async () => {
        if (!id) return toast.error("ID tidak ditemukan");
        try {
            setLoading(true);
            await AsesmentMedicAPI.updateTindakLanjut(id, {
                ...formData,
                rs_tujuan_rujukan: formData.rs_tujuan_rujukan || null
            });
            toast.success("Rencana tindak lanjut berhasil disimpan");
        } catch (error) {
            toast.error("Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccordionItem value="tindakLanjut" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">17</Badge>
                    Rencana Tindak Lanjut
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-6">
                <Alert variant="info">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription>
                        Tentukan disposisi dan instruksi medis lanjutan untuk pasien sebelum meninggalkan IGD.
                    </AlertDescription>
                </Alert>

                {/* 1. Jenis Perencanaan - Gaya Card Grid */}
                <div className="space-y-3">
                    <Label>
                        <ClipboardCheck className="w-3.5 h-3.5" /> Jenis Perencanaan
                    </Label>
                    <RadioGroup
                        value={formData.jenis_perencanaan}
                        onValueChange={(val) => setFormData({ ...formData, jenis_perencanaan: val })}
                        disabled={!editable || loading}
                        className="grid grid-cols-2 md:grid-cols-4 gap-2"
                    >
                        {JENIS_PERENCANAAN.map((item) => (
                            <Label
                                key={item.id}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 border rounded-lg text-center transition-all cursor-pointer hover:bg-muted/50",
                                    formData.jenis_perencanaan === item.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-background",
                                    !editable && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <RadioGroupItem value={item.id} className="sr-only" />
                                <div className={cn("p-2 rounded-full mb-2 bg-muted", item.color)}>
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase">{item.title}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                {/* 2. Rencana Detail */}
                <div className="space-y-2">
                    <Label>Rencana Detail Medis</Label>
                    <Textarea
                        value={formData.rencana_detail}
                        onChange={(e) => setFormData({ ...formData, rencana_detail: e.target.value })}
                        placeholder="Detail instruksi medis, obat oral, dsb..."
                        className="min-h-[100px] text-sm resize-none"
                        disabled={!editable || loading}
                    />
                </div>

                {/* 3. Disposisi - Gaya Card Grid */}
                <div className="space-y-3">
                    <Label>
                        <Route className="w-3.5 h-3.5" /> Rencana Tindak Lanjut (Disposisi)
                    </Label>
                    <RadioGroup
                        value={formData.rencana_tindak_lanjut}
                        onValueChange={(val) => setFormData({ ...formData, rencana_tindak_lanjut: val })}
                        disabled={!editable || loading}
                        className="grid grid-cols-2 md:grid-cols-5 gap-2"
                    >
                        {DISPOSISI.map((item) => (
                            <Label
                                key={item.id}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 border rounded-lg text-center transition-all cursor-pointer hover:bg-muted/50",
                                    formData.rencana_tindak_lanjut === item.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-background"
                                )}
                            >
                                <RadioGroupItem value={item.id} className="sr-only" />
                                <div className={cn("p-2 rounded-full mb-2 bg-muted", item.color)}>
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase">{item.title}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>

                {/* 4. Detail Form Card */}
                <Card className="border-muted bg-muted/20">
                    <CardHeader className="flex gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm">Informasi Penunjang Disposisi</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Indikasi Rawat / Catatan Rujukan</Label>
                            <Textarea
                                value={formData.detail_rencana_indikasi}
                                onChange={(e) => setFormData({ ...formData, detail_rencana_indikasi: e.target.value })}
                                className="bg-background text-sm min-h-[60px]"
                                disabled={!editable || loading}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Shadcn Select untuk Ruang/Kelas */}
                            <div className="space-y-2">
                                <Label>Ruang/Kelas</Label>
                                <Select
                                    disabled={!editable || loading}
                                    value={formData.detail_rencana_ruang}
                                    onValueChange={(val) => setFormData({ ...formData, detail_rencana_ruang: val })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Ruang/Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["VIP", "Kelas 1", "Kelas 2", "Kelas 3", "ICU", "HCU"].map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>RS Tujuan Rujukan</Label>
                                <Input
                                    value={formData.rs_tujuan_rujukan}
                                    onChange={(e) => setFormData({ ...formData, rs_tujuan_rujukan: e.target.value })}
                                    placeholder="Nama RS..."
                                    className="h-9 text-sm"
                                    disabled={!editable || loading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {editable && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            size="sm"
                            className="px-8 shadow-sm"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Simpan Rencana
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}