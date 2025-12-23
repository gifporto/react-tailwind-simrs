"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Smile,
    Meh,
    Frown,
    Info,
    Save,
    Loader2,
} from "lucide-react";
import clsx from "clsx";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
    initialData?: { keadaan: string };
    editable?: boolean;
    onSuccess?: () => void;
}

// Mapping antara value radio (internal) dan label payload (API)
const KEADAAN_MAP: Record<string, string> = {
    "ringan": "Sakit Ringan",
    "sedang": "Sakit Sedang",
    "berat": "Sakit Berat",
};

// Kebalikannya untuk sinkronisasi initialData
const REVERSE_MAP: Record<string, string> = {
    "Sakit Ringan": "ringan",
    "Sakit Sedang": "sedang",
    "Sakit Berat": "berat",
};

export default function KeadaanUmum({ initialData, editable = false, onSuccess }: Props) {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [keadaan, setKeadaan] = useState<string>("ringan");

    // Sinkronisasi data awal dari API
    useEffect(() => {
        if (initialData?.keadaan) {
            setKeadaan(REVERSE_MAP[initialData.keadaan] || "ringan");
        }
    }, [initialData]);

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!id) {
            toast.error("ID tidak ditemukan");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                keadaan: KEADAAN_MAP[keadaan]
            };

            await AsesmentMedicAPI.updateKeadaanUmum(id, payload);
            toast.success("Keadaan umum berhasil diperbarui");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Update Keadaan Umum Error:", error);
            toast.error("Gagal menyimpan keadaan umum");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccordionItem value="keadaan-umum" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    Keadaan Umum
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                <Alert variant="info">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Pilih tingkat keparahan kondisi pasien
                    </AlertDescription>
                </Alert>

                <RadioGroup
                    value={keadaan}
                    onValueChange={setKeadaan}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    disabled={!editable || loading}
                >
                    {/* Ringan */}
                    <Label
                        htmlFor="ringan"
                        className={clsx(
                            "cursor-pointer rounded-md border p-4 space-y-1 transition-colors",
                            keadaan === "ringan" ? "border-green-500 bg-green-50" : "hover:bg-muted/50"
                        )}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <RadioGroupItem value="ringan" id="ringan" />
                            <div>
                                <div className="flex gap-1 mb-1 items-center">
                                    <Smile className="h-4 w-4 text-green-600" />
                                    <span>Sakit Ringan</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-normal">
                                    Kondisi stabil, tidak memerlukan tindakan darurat
                                </p>
                            </div>
                        </div>
                    </Label>

                    {/* Sedang */}
                    <Label
                        htmlFor="sedang"
                        className={clsx(
                            "cursor-pointer rounded-md border p-4 space-y-1 transition-colors",
                            keadaan === "sedang" ? "border-yellow-500 bg-yellow-50" : "hover:bg-muted/50"
                        )}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <RadioGroupItem value="sedang" id="sedang" />
                            <div>
                                <div className="flex gap-1 mb-1 items-center">
                                    <Meh className="h-4 w-4 text-yellow-600" />
                                    <span>Sakit Sedang</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-normal">
                                    Perlu observasi dan perawatan
                                </p>
                            </div>
                        </div>
                    </Label>

                    {/* Berat */}
                    <Label
                        htmlFor="berat"
                        className={clsx(
                            "cursor-pointer rounded-md border p-4 space-y-1 transition-colors",
                            keadaan === "berat" ? "border-red-500 bg-red-50" : "hover:bg-muted/50"
                        )}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <RadioGroupItem value="berat" id="berat" />
                            <div>
                                <div className="flex gap-1 mb-1 items-center">
                                    <Frown className="h-4 w-4 text-red-600" />
                                    <span>Sakit Berat</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-normal">
                                    Prioritas tinggi, tindakan segera
                                </p>
                            </div>
                        </div>
                    </Label>
                </RadioGroup>

                {editable && (
                    <div className="pt-3 border-t flex justify-end">
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={loading || !id}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Simpan Keadaan Umum
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}