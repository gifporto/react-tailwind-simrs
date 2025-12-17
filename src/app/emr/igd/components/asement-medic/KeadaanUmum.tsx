"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Smile,
    Meh,
    Frown,
    Info,
    Save,
} from "lucide-react";
import clsx from "clsx";

interface Props {
    editable?: boolean;
}

type Keadaan = "ringan" | "sedang" | "berat";

export default function KeadaanUmum({ editable = false }: Props) {
    // dummy data (tidak mengubah nilai asli)
    const [keadaan, setKeadaan] = useState<Keadaan>("ringan");

    return (
        <AccordionItem value="keadaan-umum" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    Keadaan Umum Pasien
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                {/* Info */}
                <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Pilih tingkat keparahan kondisi pasien
                    </AlertDescription>
                </Alert>

                {/* Radio Options */}
                <RadioGroup
                    value={keadaan}
                    onValueChange={(val) => setKeadaan(val as Keadaan)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    disabled={!editable}
                >
                    {/* Ringan */}
                    <Label
                        htmlFor="ringan"
                        className={clsx(
                            "cursor-pointer rounded-md border p-4 space-y-1",
                            keadaan === "ringan" && "border-green-500 bg-green-50"
                        )}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <RadioGroupItem value="ringan" id="ringan" />
                            <div>
                                <div className="flex gap-1 mb-1">
                                    <Smile className="h-4 w-4 text-green-600" />
                                    <span>Sakit Ringan</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Kondisi stabil, tidak memerlukan tindakan darurat
                                </p>
                            </div>
                        </div>
                    </Label>

                    {/* Sedang */}
                    <Label
                        htmlFor="sedang"
                        className={clsx(
                            "cursor-pointer rounded-md border p-4 space-y-1",
                            keadaan === "sedang" && "border-yellow-500 bg-yellow-50"
                        )}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <RadioGroupItem value="sedang" id="sedang" />
                            <div>
                                <div className="flex gap-1 mb-1">
                                    <Meh className="h-4 w-4 text-yellow-600" />
                                    <span>Sakit Sedang</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Perlu observasi dan perawatan
                                </p>
                            </div>
                        </div>
                    </Label>

                    {/* Berat */}
                    <Label
                        htmlFor="berat"
                        className={clsx(
                            "cursor-pointer rounded-md border p-4 space-y-1",
                            keadaan === "berat" && "border-red-500 bg-red-50"
                        )}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <RadioGroupItem value="berat" id="berat" />
                            <div>
                                <div className="flex gap-1 mb-1">
                                    <Frown className="h-4 w-4 text-red-600" />
                                    <span>Sakit Berat</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Prioritas tinggi, tindakan segera
                                </p>
                            </div>
                        </div>
                    </Label>
                </RadioGroup>


                {/* Action */}
                {editable && (
                    <div className="pt-3 border-t flex justify-end">
                        <Button size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Simpan Keadaan Umum
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
