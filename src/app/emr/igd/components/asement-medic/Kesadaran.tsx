"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, Meh, AlertCircle, Skull, Bed, Save, Loader2 } from "lucide-react";
import clsx from "clsx";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

type KesadaranLevel = "Compos Mentis" | "Apatis" | "Somnolen" | "Sopor" | "Coma";

const eyeOptions = [
    { value: 1, label: "1 - Tidak Membuka Mata" },
    { value: 2, label: "2 - Membuka Mata terhadap Rangsangan Nyeri" },
    { value: 3, label: "3 - Membuka Mata terhadap Panggilan" },
    { value: 4, label: "4 - Membuka Mata secara spontan" },
];

const verbalOptions = [
    { value: 1, label: "1 - Tidak ada respon verbal" },
    { value: 2, label: "2 - Suara tidak jelas" },
    { value: 3, label: "3 - Kata-kata tidak tepat" },
    { value: 4, label: "4 - Bingung" },
    { value: 5, label: "5 - Percakapan normal" },
];

const motorOptions = [
    { value: 1, label: "1 - Tidak ada gerakan" },
    { value: 2, label: "2 - Gerakan abnormal" },
    { value: 3, label: "3 - Gerakan fleksion abnormal" },
    { value: 4, label: "4 - Gerakan fleksion normal" },
    { value: 5, label: "5 - Gerakan lokal terhadap nyeri" },
    { value: 6, label: "6 - Normal" },
];

interface Props {
    initialData?: any;
    editable?: boolean;
    onSuccess?: () => void;
}

export default function Kesadaran({ initialData, editable = false, onSuccess }: Props) {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    const [kesadaran, setKesadaran] = useState<KesadaranLevel>("Compos Mentis");
    const [interpretation, setInterpretation] = useState("Compos Mentis (Normal)");
    const [gcs, setGcs] = useState({
        eye: "4",
        verbal: "5",
        motor: "6",
    });

    const totalGcs = Number(gcs.eye) + Number(gcs.verbal) + Number(gcs.motor);

    // Sinkronisasi data awal
    useEffect(() => {
        if (initialData) {
            // Map snake_case back to Title Case if needed
            const mapBack: Record<string, KesadaranLevel> = {
                compos_mentis: "Compos Mentis",
                apatis: "Apatis",
                somnolen: "Somnolen",
                sopor: "Sopor",
                coma: "Coma"
            };
            setKesadaran(mapBack[initialData.kesadaran] || "Compos Mentis");
            setGcs({
                eye: initialData.gcs_eye?.toString() || "4",
                verbal: initialData.gcs_verbal?.toString() || "5",
                motor: initialData.gcs_motor?.toString() || "6",
            });
        }
    }, [initialData]);

    useEffect(() => {
        let text = "";
        if (totalGcs === 15) text = "Compos Mentis (Normal)";
        else if (totalGcs >= 13) text = "Cedera Kepala Ringan";
        else if (totalGcs >= 9) text = "Cedera Kepala Sedang";
        else if (totalGcs >= 3) text = "Cedera Kepala Berat";
        else text = "Tidak terdefinisi";
        setInterpretation(text);
    }, [totalGcs]);

    useEffect(() => {
        let text = "";
        let autoKesadaran: KesadaranLevel = "Compos Mentis";

        // Logika Penentuan Interpretasi dan Tingkat Kesadaran Otomatis
        if (totalGcs >= 14) {
            text = "Compos Mentis (Normal)";
            autoKesadaran = "Compos Mentis";
        } else if (totalGcs >= 12) {
            text = "Cedera Kepala Ringan (Apatis)";
            autoKesadaran = "Apatis";
        } else if (totalGcs >= 10) {
            text = "Cedera Kepala Ringan (Somnolen)";
            autoKesadaran = "Somnolen";
        } else if (totalGcs >= 7) {
            text = "Cedera Kepala Sedang (Sopor)";
            autoKesadaran = "Sopor";
        } else if (totalGcs >= 3) {
            text = "Cedera Kepala Berat (Coma)";
            autoKesadaran = "Coma";
        } else {
            text = "Tidak terdefinisi";
        }

        setInterpretation(text);

        // Hanya update otomatis jika sedang dalam mode editable 
        // agar tidak menimpa data awal dari API saat pertama kali load
        if (editable) {
            setKesadaran(autoKesadaran);
        }
    }, [totalGcs, editable]);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) return toast.error("ID tidak ditemukan");

        try {
            setLoading(true);
            const now = new Date();

            const payload = {
                kesadaran: kesadaran.toLowerCase().replace(" ", "_"),
                gcs_eye: Number(gcs.eye),
                gcs_verbal: Number(gcs.verbal),
                gcs_motor: Number(gcs.motor),
                gcs_total: totalGcs,
            };

            await AsesmentMedicAPI.updateGscScore(id, payload);
            toast.success("Skor GCS & Kesadaran berhasil disimpan");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("GCS Save Error:", error);
            toast.error("Gagal menyimpan data kesadaran");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccordionItem value="kesadaran" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">5</Badge>
                    Kesadaran & GCS Score
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                {/* GCS Calculator */}
                <div className="border rounded-md p-4 space-y-3 bg-muted/20">
                    <h6 className="flex items-center gap-2 font-semibold text-sm">
                        <Badge variant="secondary">GCS</Badge> Glasgow Coma Scale (GCS) Calculator
                    </h6>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold flex items-center gap-1">
                                <Badge variant="outline" className="h-5 w-5 p-0 flex justify-center">E</Badge> Eye Response
                            </Label>
                            <Select
                                disabled={!editable || loading}
                                value={gcs.eye}
                                onValueChange={(val) => setGcs({ ...gcs, eye: val })}
                            >
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Pilih Eye" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eyeOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold flex items-center gap-1">
                                <Badge variant="outline" className="h-5 w-5 p-0 flex justify-center text-green-600 border-green-600">V</Badge> Verbal Response
                            </Label>
                            <Select
                                disabled={!editable || loading}
                                value={gcs.verbal}
                                onValueChange={(val) => setGcs({ ...gcs, verbal: val })}
                            >
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Pilih Verbal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {verbalOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold flex items-center gap-1">
                                <Badge variant="outline" className="h-5 w-5 p-0 flex justify-center text-amber-600 border-amber-600">M</Badge> Motor Response
                            </Label>
                            <Select
                                disabled={!editable || loading}
                                value={gcs.motor}
                                onValueChange={(val) => setGcs({ ...gcs, motor: val })}
                            >
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Pilih Motor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {motorOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 p-4 text-center rounded-md bg-primary/10 border border-primary/20">
                        <small className="block mb-1 text-muted-foreground uppercase tracking-wider font-bold">Total GCS Score</small>
                        <h2 className="text-3xl font-bold text-primary">{totalGcs} <span className="text-sm font-normal text-muted-foreground">/ 15</span></h2>
                        <Badge variant="secondary" className="mt-1">{interpretation}</Badge>
                    </div>
                </div>

                {/* Tingkat Kesadaran */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Tingkat Kesadaran</Label>
                    <RadioGroup
                        value={kesadaran}
                        onValueChange={(val) => setKesadaran(val as KesadaranLevel)}
                        className="flex flex-wrap gap-2"
                        disabled={!editable || loading}
                    >
                        {[
                            { val: "Compos Mentis", icon: <CheckCircle className="w-4 h-4 mr-1.5" />, color: "border-green-500 text-green-700 data-[state=checked]:bg-green-50" },
                            { val: "Apatis", icon: <Meh className="w-4 h-4 mr-1.5" />, color: "border-amber-500 text-amber-700 data-[state=checked]:bg-amber-50" },
                            { val: "Somnolen", icon: <Bed className="w-4 h-4 mr-1.5" />, color: "border-amber-600 text-amber-800 data-[state=checked]:bg-amber-50" },
                            { val: "Sopor", icon: <AlertCircle className="w-4 h-4 mr-1.5" />, color: "border-red-500 text-red-700 data-[state=checked]:bg-red-50" },
                            { val: "Coma", icon: <Skull className="w-4 h-4 mr-1.5" />, color: "border-red-800 text-red-900 data-[state=checked]:bg-red-50" },
                        ].map((item) => (
                            <div key={item.val} className="flex items-center">
                                <RadioGroupItem value={item.val} id={item.val} className="sr-only" />
                                <Label
                                    htmlFor={item.val}
                                    className={clsx(
                                        "flex items-center px-3 py-2 rounded-md border cursor-pointer text-xs font-medium transition-all",
                                        kesadaran === item.val ? item.color : "border-muted bg-background hover:bg-muted/50"
                                    )}
                                >
                                    {item.icon} {item.val}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Action Button */}
                {editable && (
                    <div className="text-right mt-4 border-t pt-3">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            size="sm"
                            className="min-w-[150px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Kesadaran
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}