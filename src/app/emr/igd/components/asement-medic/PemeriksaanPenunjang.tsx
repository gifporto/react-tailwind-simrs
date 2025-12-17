"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Microscope,
    ScanLine,
    HeartPulse,
    Stethoscope,
    Save,
    Info,
} from "lucide-react";

interface Props {
    editable?: boolean;
}

export default function PemeriksaanPenunjang({ editable = false }: Props) {
    // dummy data (sesuai blade, tidak diubah)
    const [laboratorium, setLaboratorium] = useState(
        "- Hemoglobin: 12.5 g/dL\n- Leukosit: 12.000/uL\n- GDS: 145 mg/dL"
    );
    const [radiologi, setRadiologi] = useState(
        "- Foto Thorax: Tidak tampak infiltrat\n- CT Scan: ...\n- USG: ..."
    );
    const [ekg, setEkg] = useState(
        "Sinus rhythm, HR 80x/menit, ST elevasi di lead V1-V4"
    );
    const [lainnya, setLainnya] = useState(
        "Tuliskan hasil pemeriksaan penunjang lainnya..."
    );

    return (
        <AccordionItem value="penunjang" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">13</Badge>
                    Pemeriksaan Penunjang & Hasil
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                {/* Info */}
                <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Dokumentasikan hasil pemeriksaan penunjang yang telah dilakukan
                    </AlertDescription>
                </Alert>

                {/* Laboratorium */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Microscope className="h-4 w-4 text-muted-foreground" />
                        Laboratorium
                    </div>
                    <Textarea
                        rows={4}
                        value={laboratorium}
                        onChange={(e) => setLaboratorium(e.target.value)}
                        disabled={!editable}
                    />
                </section>

                {/* Radiologi */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <ScanLine className="h-4 w-4 text-muted-foreground" />
                        Radiologi
                    </div>
                    <Textarea
                        rows={4}
                        value={radiologi}
                        onChange={(e) => setRadiologi(e.target.value)}
                        disabled={!editable}
                    />
                </section>

                {/* EKG */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <HeartPulse className="h-4 w-4 text-muted-foreground" />
                        EKG (Elektrokardiogram)
                    </div>
                    <Textarea
                        rows={3}
                        value={ekg}
                        onChange={(e) => setEkg(e.target.value)}
                        disabled={!editable}
                    />
                </section>

                {/* Pemeriksaan lain */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        Pemeriksaan Penunjang Lainnya
                    </div>
                    <Textarea
                        rows={3}
                        value={lainnya}
                        onChange={(e) => setLainnya(e.target.value)}
                        disabled={!editable}
                    />
                </section>

                {/* Action */}
                {editable && (
                    <div className="pt-3 border-t flex justify-end">
                        <Button size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Simpan Pemeriksaan Penunjang
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
