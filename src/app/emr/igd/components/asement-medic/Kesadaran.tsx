"use client";

import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Meh, AlertCircle, Skull, Bed } from "lucide-react";
import clsx from "clsx";

type GCS = { eye: number; verbal: number; motor: number };
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
    editable?: boolean;
}

export default function Kesadaran({ editable = false }: Props) {
    const [interpretation, setInterpretation] = useState("Compos Mentis (Normal)");
    const [kesadaran, setKesadaran] = useState<KesadaranLevel>("Compos Mentis");

    const [gcs, setGcs] = useState<{ eye: string; verbal: string; motor: string }>({
        eye: "4",
        verbal: "5",
        motor: "6",
    });

    const totalGcs = Number(gcs.eye) + Number(gcs.verbal) + Number(gcs.motor);

    useEffect(() => {
        let text = "";
        if (totalGcs === 15) text = "Compos Mentis (Normal)";
        else if (totalGcs >= 13) text = "Cedera Kepala Ringan";
        else if (totalGcs >= 9) text = "Cedera Kepala Sedang";
        else if (totalGcs >= 3) text = "Cedera Kepala Berat";
        else text = "Tidak terdefinisi";

        setInterpretation(text);
    }, [totalGcs]);


    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="kesadaran" className="border rounded-md">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">5</Badge>
                        Kesadaran & GCS Score
                    </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 space-y-4">
                    {/* GCS */}
                    <div className="border rounded-md p-4 space-y-3">
                        <h6 className="flex items-center gap-2 font-semibold">
                            <Badge variant="secondary">GCS</Badge> Glasgow Coma Scale (GCS) Calculator
                        </h6>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <Label className="font-semibold flex items-center gap-1">
                                    <Badge variant="outline">E</Badge> Eye Response
                                </Label>
                                <Select value={gcs.eye} onValueChange={(val) => setGcs({ ...gcs, eye: val })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Eye Response" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eyeOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value.toString()}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="font-semibold flex items-center gap-1">
                                    <Badge variant="success">V</Badge> Verbal Response
                                </Label>
                                <Select value={gcs.verbal} onValueChange={(val) => setGcs({ ...gcs, verbal: val })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Verbal Response" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {verbalOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value.toString()}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="font-semibold flex items-center gap-1">
                                    <Badge variant="warning">M</Badge> Motor Response
                                </Label>
                                <Select value={gcs.motor} onValueChange={(val) => setGcs({ ...gcs, motor: val })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Motor Response" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {motorOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value.toString()}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-4 p-4 text-center rounded-md bg-primary/30">
                            <small className="block mb-1">Total GCS Score</small>
                            <h2 className="text-2xl font-bold">{totalGcs} / 15</h2>
                            <small className="block mt-1">{interpretation}</small>
                        </div>
                    </div>

                    {/* Kesadaran */}
                    <div className="space-y-2">
                        <Label className="font-semibold mb-2">Tingkat Kesadaran</Label>
                        <RadioGroup
                            value={kesadaran}
                            onValueChange={(val) => setKesadaran(val as KesadaranLevel)}
                            className="flex flex-wrap gap-2"
                            disabled={!editable}
                        >
                            <Label className={clsx("cursor-pointer btn btn-outline-success")}>
                                <RadioGroupItem value="Compos Mentis" />
                                <CheckCircle className="w-4 h-4 mr-1" /> Compos Mentis
                            </Label>
                            <Label className={clsx("cursor-pointer btn btn-outline-warning")}>
                                <RadioGroupItem value="Apatis" />
                                <Meh className="w-4 h-4 mr-1" /> Apatis
                            </Label>
                            <Label className={clsx("cursor-pointer btn btn-outline-warning")}>
                                <RadioGroupItem value="Somnolen" />
                                <Bed className="w-4 h-4 mr-1" /> Somnolen
                            </Label>
                            <Label className={clsx("cursor-pointer btn btn-outline-danger")}>
                                <RadioGroupItem value="Sopor" />
                                <AlertCircle className="w-4 h-4 mr-1" /> Sopor
                            </Label>
                            <Label className={clsx("cursor-pointer btn btn-outline-danger")}>
                                <RadioGroupItem value="Coma" />
                                <Skull className="w-4 h-4 mr-1" /> Coma
                            </Label>
                        </RadioGroup>
                    </div>

                    {editable && (
                        <div className="text-right mt-4 border-t pt-3">
                            <Button>💾 Simpan Kesadaran</Button>
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
