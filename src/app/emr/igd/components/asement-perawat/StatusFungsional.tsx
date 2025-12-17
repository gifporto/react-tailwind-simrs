"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Props {
  editable?: boolean;
}

export default function StatusFungsional({ editable = false }: Props) {
  // ===== Dummy state (sesuai HTML checked) =====
  const [penglihatan, setPenglihatan] = useState("Normal");
  const [penciuman, setPenciuman] = useState("Normal");
  const [pendengaran, setPendengaran] = useState("Normal");
  const [orientasi, setOrientasi] = useState("Penuh");
  const [aktivitas, setAktivitas] = useState("Normal");
  const [berjalan, setBerjalan] = useState("Normal");

  return (
    <Accordion type="single">
      <AccordionItem value="status-fungsional" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            Asesmen Status Fungsional
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-6">
          {/* ================= SENSORIK ================= */}
          <Card className="p-4 space-y-4">
            <h4 className="text-sm font-semibold">Sensorik</h4>

            {/* Penglihatan */}
            <div className="space-y-2">
              <Label className="font-medium">Penglihatan</Label>
              <RadioGroup
                value={penglihatan}
                onValueChange={setPenglihatan}
                disabled={!editable}
                className="flex flex-wrap gap-4"
              >
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Normal" /> Normal
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Kabur" /> Kabur
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Kacamata" /> Kacamata
                </Label>
              </RadioGroup>
            </div>

            {/* Penciuman */}
            <div className="space-y-2">
              <Label className="font-medium">Penciuman</Label>
              <RadioGroup
                value={penciuman}
                onValueChange={setPenciuman}
                disabled={!editable}
                className="flex gap-4"
              >
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Normal" /> Normal
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Tidak" /> Tidak
                </Label>
              </RadioGroup>
            </div>

            {/* Pendengaran */}
            <div className="space-y-2">
              <Label className="font-medium">Pendengaran</Label>
              <RadioGroup
                value={pendengaran}
                onValueChange={setPendengaran}
                disabled={!editable}
                className="flex flex-wrap gap-4"
              >
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Normal" /> Normal
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Tuli kanan/kiri" /> Tuli kanan/kiri
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Alat bantu" /> Alat bantu
                </Label>
              </RadioGroup>
            </div>
          </Card>

          {/* ================= KOGNITIF ================= */}
          <Card className="p-4 space-y-3">
            <h4 className="text-sm font-semibold">Kognitif</h4>

            <div className="space-y-2">
              <Label className="font-medium">Orientasi</Label>
              <RadioGroup
                value={orientasi}
                onValueChange={setOrientasi}
                disabled={!editable}
                className="flex flex-wrap gap-4"
              >
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Penuh" /> Penuh
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Pelupa/bingung" /> Pelupa / bingung
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Tidak dapat mengerti" /> Tidak dapat
                  mengerti
                </Label>
              </RadioGroup>
            </div>
          </Card>

          {/* ================= MOTORIK ================= */}
          <Card className="p-4 space-y-4">
            <h4 className="text-sm font-semibold">Motorik</h4>

            {/* Aktivitas */}
            <div className="space-y-2">
              <Label className="font-medium">Aktivitas Sehari-hari</Label>
              <RadioGroup
                value={aktivitas}
                onValueChange={setAktivitas}
                disabled={!editable}
                className="flex flex-wrap gap-4"
              >
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Normal" /> Normal
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Bantuan minimal" /> Bantuan minimal
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Bantuan sebagian" /> Bantuan sebagian
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Ketergantungan total" /> Ketergantungan
                  total
                </Label>
              </RadioGroup>
            </div>

            {/* Berjalan */}
            <div className="space-y-2">
              <Label className="font-medium">Berjalan</Label>
              <RadioGroup
                value={berjalan}
                onValueChange={setBerjalan}
                disabled={!editable}
                className="flex flex-wrap gap-4"
              >
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Normal" /> Normal
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Sering jatuh" /> Sering jatuh
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Perlu bantuan" /> Perlu bantuan
                </Label>
                <Label className="flex items-center gap-2">
                  <RadioGroupItem value="Kelumpuhan" /> Kelumpuhan
                </Label>
              </RadioGroup>
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
