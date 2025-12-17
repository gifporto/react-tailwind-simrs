"use client";

import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PhysicalExam() {
    const [primarySurvey, setPrimarySurvey] = useState<"Aman" | "Tidak aman" | "Lainnya">("Aman");
    const [primarySurveyDesc, setPrimarySurveyDesc] = useState<string>("");
    const [secondarySurvey, setSecondarySurvey] = useState<Record<string, "Normal" | "Abnormal">>({
        kepala: "Normal",
        mata: "Normal",
        leher: "Normal",
        tht: "Normal",
        thorax: "Normal",
        jantung: "Normal",
        paru: "Normal",
        abdomen: "Normal",
        genitalia: "Normal",
        ekstremitas: "Normal",
    });
    const [secondarySurveyDesc, setSecondarySurveyDesc] = useState<string>("");

    const [lokalisCount, setLokalisCount] = useState<number>(0);

    const addMarker = () => setLokalisCount((prev) => prev + 1);
    const removeLastMarker = () => setLokalisCount((prev) => Math.max(prev - 0, 0));
    const clearMarkers = () => setLokalisCount(0);

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="pemeriksaanFisik" className="border rounded-md">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">11</Badge>
                        Pemeriksaan Fisik
                    </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 space-y-4">

                    {/* Info Alert */}
                    <Alert variant="info">
                        <AlertTitle>Informasi</AlertTitle>
                        <AlertDescription>Lakukan pemeriksaan fisik secara sistematis dari kepala hingga kaki</AlertDescription>
                    </Alert>

                    {/* Primary Survey */}
                    <div className="border rounded-md">
                        <div className="px-3 py-2 font-bold border-b">PRIMARY SURVEY (ABCDE)</div>
                        <div className="p-3 space-y-3">
                            <label className="font-semibold">Status Kondisi Pasien:</label>
                            <div className="flex flex-col md:flex-row gap-3">
                                {["Aman", "Tidak aman", "Lainnya"].map((option) => (
                                    <div key={option} className="border rounded p-3 flex-1">
                                        <RadioGroup value={primarySurvey} onValueChange={(val) => setPrimarySurvey(val as any)}>
                                            <div className="flex flex-col gap-1">
                                                <RadioGroupItem value={option} id={option} />
                                                <label htmlFor={option} className="font-medium capitalize">
                                                    {option}
                                                    <small className="block text-muted">
                                                        {option === "Aman"
                                                            ? "Tidak ada ancaman langsung"
                                                            : option === "Tidak aman"
                                                                ? "Memerlukan intervensi segera"
                                                                : "Jelaskan kondisi khusus"}
                                                    </small>
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                ))}
                            </div>
                            <Textarea
                                placeholder="Jelaskan temuan primary survey / kondisi khusus pasien..."
                                value={primarySurveyDesc}
                                onChange={(e) => setPrimarySurveyDesc(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Secondary Survey */}
                    <div className="border rounded-md">
                        <div className="px-3 py-2 font-bold border-b">SECONDARY SURVEY (Head-to-Toe Assessment)</div>
                        <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.keys(secondarySurvey).map((part) => (
                                <div key={part} className="border rounded p-2">
                                    <label className="font-medium mb-1 capitalize">{part}</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="radio"
                                            name={part}
                                            value="Normal"
                                            checked={secondarySurvey[part] === "Normal"}
                                            onChange={() => setSecondarySurvey({ ...secondarySurvey, [part]: "Normal" })}
                                        />{" "}
                                        Normal
                                        <input
                                            type="radio"
                                            name={part}
                                            value="Abnormal"
                                            checked={secondarySurvey[part] === "Abnormal"}
                                            onChange={() => setSecondarySurvey({ ...secondarySurvey, [part]: "Abnormal" })}
                                        />{" "}
                                        Abnormal
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Textarea
                            placeholder="Jelaskan temuan abnormal atau catatan khusus..."
                            value={secondarySurveyDesc}
                            onChange={(e) => setSecondarySurveyDesc(e.target.value)}
                        />
                    </div>

                    {/* Lokalis Static */}
                    <div className="border rounded-md">
                        <div className="px-3 py-2 font-bold border-b">STATUS LOKALIS</div>
                        <div className="p-3 flex flex-col items-center gap-3">
                            <div className="border w-full h-64 flex items-center justify-center text-muted">Gambar tubuh statis</div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={addMarker}>Tambah Tanda</Button>
                                <Button size="sm" variant="outline" onClick={removeLastMarker}>Hapus Terakhir</Button>
                                <Button size="sm" variant="destructive" onClick={clearMarkers}>Hapus Semua</Button>
                            </div>
                            <div className="mt-2 text-sm text-muted">
                                Jumlah tanda: <Badge>{lokalisCount}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="text-end">
                        <Button>Simpan Pemeriksaan Fisik</Button>
                    </div>

                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
