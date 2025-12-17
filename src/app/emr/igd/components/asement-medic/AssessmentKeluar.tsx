"use client";

import { useState } from "react";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, Clock, Heart, File, User } from "lucide-react";

interface Props {
    editable?: boolean;
}

const dummyDokumen = [
    { id: "resume", label: "Resume Medis", icon: <File /> },
    { id: "resep", label: "Resep / Obat", icon: <File /> },
    { id: "lab", label: "Hasil Laboratorium", icon: <File /> },
    { id: "radiologi", label: "Hasil Radiologi", icon: <File /> },
];

export default function AssessmentKeluar({ editable = false }: Props) {
    const [keadaan, setKeadaan] = useState<string>("");
    const [transportasi, setTransportasi] = useState<string>("");
    const [dokumen, setDokumen] = useState<string[]>([]);

    const toggleDokumen = (id: string) => {
        if (dokumen.includes(id)) setDokumen(dokumen.filter((d) => d !== id));
        else setDokumen([...dokumen, id]);
    };

    return (
        <AccordionItem value="kondisiKeluar" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">18</Badge>
                    Kondisi Saat Meninggalkan IGD
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                {/* Info */}
                <Alert variant="info">
                    <Info className="w-5 h-5 mr-1" />
                    <AlertTitle>Informasi</AlertTitle>
                    <AlertDescription>
                        Dokumentasikan kondisi pasien saat keluar dari IGD
                    </AlertDescription>
                </Alert>

                {/* Waktu Keluar */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Waktu Keluar IGD
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="tanggalKeluar">Tanggal</Label>
                                <Input type="date" id="tanggalKeluar" />
                            </div>
                            <div>
                                <Label htmlFor="jamKeluar">Jam</Label>
                                <Input type="time" id="jamKeluar" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Kondisi Pasien */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Heart className="w-4 h-4" /> Kondisi Pasien Saat Keluar
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="keadaanUmum">Keadaan Umum</Label>
                            <select
                                id="keadaanUmum"
                                className="w-full border rounded p-2"
                                value={keadaan}
                                onChange={(e) => setKeadaan(e.target.value)}
                            >
                                <option value="">Pilih Keadaan Umum</option>
                                <option value="Baik">Baik - Stabil</option>
                                <option value="Sedang">Sedang - Perlu Observasi</option>
                                <option value="Lemah">Lemah - Perlu Perawatan Intensif</option>
                            </select>
                        </div>

                        {/* Vital Signs */}
                        <Label>Tanda Vital Saat Keluar:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {["TD", "RR", "Nadi", "Suhu"].map((item) => (
                                <Card key={item} className="text-center p-2 border">
                                    <Label htmlFor={item.toLowerCase()}>{item}</Label>
                                    <Input id={item.toLowerCase()} placeholder={item === "TD" ? "120/80" : item === "RR" ? "20" : item === "Nadi" ? "80" : "36.5"} />
                                </Card>
                            ))}
                        </div>

                        <Card className="text-center p-2 border">
                            <Label htmlFor="spo2">SpO₂</Label>
                            <Input id="spo2" placeholder="98" className="text-center" />
                        </Card>
                    </CardContent>
                </Card>

                {/* Alasan Keluar */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Alasan Keluar dari IGD
                    </CardHeader>
                    <CardContent>
                        <Textarea placeholder="Jelaskan alasan pasien keluar dari IGD" />
                    </CardContent>
                </Card>

                {/* Transportasi */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Transportasi Pulang
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={transportasi} onValueChange={setTransportasi} className="flex gap-3">
                            {["Kendaraan Pribadi", "Ambulance", "Kendaraan Jenazah"].map((item) => (
                                <Label key={item} className="cursor-pointer border rounded p-3 text-center flex-1">
                                    <RadioGroupItem value={item} />
                                    {item}
                                </Label>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Dokumen */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <File className="w-4 h-4" /> Dokumen & Hasil yang Diserahkan
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dummyDokumen.map((d) => (
                            <div
                                key={d.id}
                                className="border rounded p-2 cursor-pointer flex items-center gap-2"
                                onClick={() => toggleDokumen(d.id)}
                            >
                                <Checkbox checked={dokumen.includes(d.id)} onCheckedChange={() => toggleDokumen(d.id)} />
                                {d.icon}
                                <span>{d.label}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Penerima Dokumen */}
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Penerima Dokumen
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="diserahkanKepada">Diserahkan Kepada</Label>
                        <Input placeholder="Tulis nama/relasi penerima" />
                    </CardContent>
                </Card>

                {/* Action */}
                <div className="flex justify-end mt-3 pt-3 border-t">
                    <Button>Simpan Kondisi Keluar IGD</Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
