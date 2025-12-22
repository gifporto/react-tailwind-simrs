"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, Smile, Meh, Frown, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AsesmentMedicAPI } from "@/lib/api";

export default function NumericPainScale({ initialData, editable = false }: { initialData?: any, editable?: boolean }) {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [painValue, setPainValue] = useState<number>(0);

    useEffect(() => {
        if (initialData?.numeric_pain_scale !== undefined) {
            setPainValue(Number(initialData.numeric_pain_scale));
        }
    }, [initialData]);

    const handleSave = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await AsesmentMedicAPI.updateSkriningNeyri(id, { numeric_pain_scale: painValue });
            toast.success("Skala Numerik disimpan");
        } catch (error) {
            toast.error("Gagal menyimpan");
        } finally {
            setLoading(false);
        }
    };

    const getPainLabel = (value: number) => {
        if (value === 0) return { label: "Tidak Ada Nyeri", color: "text-green-600", icon: <Smile className="w-4 h-4" /> };
        if (value <= 3) return { label: "Nyeri Ringan", color: "text-green-600", icon: <Smile className="w-4 h-4" /> };
        if (value <= 6) return { label: "Nyeri Sedang", color: "text-yellow-600", icon: <Meh className="w-4 h-4" /> };
        return { label: "Nyeri Berat", color: "text-red-600", icon: <Frown className="w-4 h-4" /> };
    };

    const pain = getPainLabel(painValue);

    return (
        <AccordionItem value="numericPain" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">8</Badge>
                    Numeric Pain Rating Scale (0-10)
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
                <Alert variant="info">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertTitle>INFORMASI</AlertTitle>
                    <AlertDescription>Untuk pasien dewasa yang dapat berkomunikasi verbal.</AlertDescription>
                </Alert>

                <div className="space-y-6 py-4">
                    <div className="flex justify-between text-xs font-bold px-1">
                        {[0,1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} className={n <= 3 ? "text-green-600" : n <= 6 ? "text-yellow-600" : "text-red-600"}>{n}</span>)}
                    </div>
                    <Input type="range" min={0} max={10} value={painValue} onChange={(e) => setPainValue(Number(e.target.value))} disabled={!editable || loading} className="h-2 accent-primary" />
                    <div className="bg-muted/30 p-4 rounded-lg text-center border-dashed border-2">
                        <span className="text-xs uppercase text-muted-foreground font-bold">Skala Terpilih</span>
                        <h2 className="text-3xl font-black">{painValue}</h2>
                        <div className={`flex items-center justify-center gap-2 font-bold ${pain.color}`}>{pain.icon} {pain.label}</div>
                    </div>
                </div>

                {editable && (
                    <div className="flex justify-end pt-3 border-t">
                        <Button onClick={handleSave} disabled={loading} size="sm">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Simpan
                        </Button>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}