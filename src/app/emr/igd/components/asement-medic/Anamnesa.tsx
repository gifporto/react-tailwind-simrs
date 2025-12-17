"use client";

import { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ClipboardList,
  History,
  Users,
  Pill,
  Save,
} from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function Anamnesa({ editable = false }: Props) {
  // dummy state
  const [form, setForm] = useState({
    keluhanUtama: "Nyeri dada sejak 2 jam sebelum masuk IGD",
    riwayatSekarang: "Nyeri menjalar ke lengan kiri, disertai sesak",
    riwayatDahulu: "Hipertensi sejak 5 tahun lalu",
    riwayatKeluarga: "Ayah dengan riwayat penyakit jantung",
    obatDikonsumsi: "Amlodipine 10 mg",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AccordionItem value="anamnesa" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <Badge variant="outline">1</Badge>
          Anamnesa
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        {/* Keluhan Utama */}
        <div className="space-y-1">
          <Label className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Keluhan Utama <span className="text-destructive">*</span>
          </Label>
          <Textarea
            rows={3}
            placeholder="Tuliskan keluhan utama pasien..."
            value={form.keluhanUtama}
            onChange={(e) => handleChange("keluhanUtama", e.target.value)}
            disabled={!editable}
          />
          <p className="text-xs text-muted-foreground">
            Keluhan utama yang dirasakan pasien saat ini
          </p>
        </div>

        {/* Riwayat Penyakit Sekarang */}
        <div className="space-y-1">
          <Label className="flex items-center gap-2 font-semibold">
            <ClipboardList className="h-4 w-4 text-sky-600" />
            Riwayat Penyakit Sekarang
          </Label>
          <Textarea
            rows={3}
            placeholder="Jelaskan kronologi keluhan..."
            value={form.riwayatSekarang}
            onChange={(e) => handleChange("riwayatSekarang", e.target.value)}
            disabled={!editable}
          />
          <p className="text-xs text-muted-foreground">
            Perjalanan penyakit sejak awal hingga sekarang
          </p>
        </div>

        {/* Riwayat Penyakit Dahulu */}
        <div className="space-y-1">
          <Label className="flex items-center gap-2 font-semibold">
            <History className="h-4 w-4 text-yellow-600" />
            Riwayat Penyakit Dahulu
          </Label>
          <Textarea
            rows={3}
            placeholder="Riwayat penyakit sebelumnya..."
            value={form.riwayatDahulu}
            onChange={(e) => handleChange("riwayatDahulu", e.target.value)}
            disabled={!editable}
          />
          <p className="text-xs text-muted-foreground">
            Penyakit kronis, operasi, atau kondisi medis sebelumnya
          </p>
        </div>

        {/* Riwayat Penyakit Keluarga */}
        <div className="space-y-1">
          <Label className="flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4 text-green-600" />
            Riwayat Penyakit Keluarga
          </Label>
          <Textarea
            rows={3}
            placeholder="Riwayat penyakit dalam keluarga..."
            value={form.riwayatKeluarga}
            onChange={(e) => handleChange("riwayatKeluarga", e.target.value)}
            disabled={!editable}
          />
          <p className="text-xs text-muted-foreground">
            Penyakit genetik atau turunan dalam keluarga
          </p>
        </div>

        {/* Obat */}
        <div className="space-y-1">
          <Label className="flex items-center gap-2 font-semibold">
            <Pill className="h-4 w-4 text-primary" />
            Usaha Berobat / Obat yang Dikonsumsi
          </Label>
          <Textarea
            rows={3}
            placeholder="Daftar obat yang sedang dikonsumsi..."
            value={form.obatDikonsumsi}
            onChange={(e) => handleChange("obatDikonsumsi", e.target.value)}
            disabled={!editable}
          />
          <p className="text-xs text-muted-foreground">
            Termasuk obat tradisional dan suplemen
          </p>
        </div>

        {/* aksi */}
        {editable && (
          <div className="pt-3 border-t flex justify-end">
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Simpan Anamnesa
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
