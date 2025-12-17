"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Smile, Meh, Frown } from "lucide-react";

interface Props {
    editable?: boolean;
}

export default function NumericPainScale({ editable = false }: Props) {
    const [painValue, setPainValue] = useState<number>(0);

    const getPainLabel = (value: number) => {
        if (value === 0) return { label: "Tidak Ada Nyeri", color: "text-green-600", icon: <Smile className="w-4 h-4 inline" /> };
        if (value <= 3) return { label: "Nyeri Ringan", color: "text-green-600", icon: <Smile className="w-4 h-4 inline" /> };
        if (value <= 6) return { label: "Nyeri Sedang", color: "text-yellow-600", icon: <Meh className="w-4 h-4 inline" /> };
        return { label: "Nyeri Berat", color: "text-red-600", icon: <Frown className="w-4 h-4 inline" /> };
    };

    const pain = getPainLabel(painValue);

    return (
        <AccordionItem value="numericPain" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">8</Badge>
                    Numeric Pain Rating Scale (0-10)
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                {/* Info */}
                <Alert variant="info" className="flex items-start gap-2">
                    <Info className="w-5 h-5 mt-1" />
                    <div>
                        <AlertTitle>Informasi</AlertTitle>
                        <AlertDescription>
                            Untuk pasien dewasa yang dapat berkomunikasi verbal
                        </AlertDescription>
                    </div>
                </Alert>

                {/* Pain Scale */}
                <div className="space-y-3">
                    <Label htmlFor="painSlider" className="font-semibold">
                        Seberapa besar nyeri yang Anda rasakan saat ini?
                    </Label>

                    <div className="p-2 border rounded-md bg-gray-50">
                        {/* Slider scale numbers */}
                        <div className="flex justify-between text-sm font-medium mb-1">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                let colorClass = "";
                                if (num === 0) colorClass = "text-green-600";
                                else if (num <= 3) colorClass = "text-green-600";
                                else if (num <= 6) colorClass = "text-yellow-600";
                                else colorClass = "text-red-600";
                                return (
                                    <span key={num} className={colorClass}>{num}</span>
                                )
                            })}
                        </div>

                        {/* Slider input */}
                        <Input
                            type="range"
                            min={0}
                            max={10}
                            value={painValue}
                            id="painSlider"
                            onChange={(e) => setPainValue(Number(e.target.value))}
                            className="w-full h-2 accent-primary"
                        />

                        {/* Pain legend */}
                        <div className="flex justify-between text-xs font-semibold mt-1">
                            <span className="text-green-600 flex items-center gap-1"><Smile className="w-4 h-4" /> Tidak Nyeri</span>
                            <span className="text-yellow-600 flex items-center gap-1"><Meh className="w-4 h-4" /> Sedang</span>
                            <span className="text-red-600 flex items-center gap-1"><Frown className="w-4 h-4" /> Sangat Nyeri</span>
                        </div>

                        {/* Selected pain */}
                        <div className="text-center mt-3 p-3 border rounded-md bg-white">
                            <small className="block text-gray-500 mb-1">Skala Nyeri Terpilih</small>
                            <h2 className="text-xl font-bold">{painValue}</h2>
                            <span className={`${pain.color} font-semibold flex items-center justify-center gap-1`}>
                                {pain.icon} {pain.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="flex justify-end mt-3 pt-3 border-t">
                    <Button>Simpan Skrining Nyeri</Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
