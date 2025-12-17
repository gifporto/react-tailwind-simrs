"use client";

import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Route,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Accessibility,
  HeartPulse,
  Save,
  Bed,
  Footprints,
  Ambulance,
  UserX,
  Cross,
  ClipboardCheck,
  FileText,
} from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function RencanaTindakLanjut({ editable = false }: Props) {
  const [perencanaan, setPerencanaan] = useState<string>("");
  const [tindakLanjut, setTindakLanjut] = useState<string>("");

  const handleSave = () => {
    console.log("Saving Rencana Tindak Lanjut:", { perencanaan, tindakLanjut });
  };

  return (
    <AccordionItem value="rencanaTindakLanjut" className="border rounded-md mb-2">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <Badge variant="outline">17</Badge>
          <Route className="w-4 h-4 text-amber-500" />
          Rencana Tindak Lanjut
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-6">
        {/* Info Alert */}
        <Alert variant="info">
          <AlertTriangle/>
          <AlertTitle className="font-bold">Penting!</AlertTitle>
          <AlertDescription>
            Tentukan disposisi pasien setelah perawatan di IGD
          </AlertDescription>
        </Alert>

        {/* 1. Jenis Perencanaan */}
        <div className="space-y-3">
          <Label className="font-bold flex items-center gap-2 text-sm">
            <ClipboardCheck className="w-4 h-4" /> Jenis Perencanaan:
          </Label>
          <RadioGroup 
            value={perencanaan} 
            onValueChange={setPerencanaan}
            disabled={!editable}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {[
              { id: "Preventif", title: "Preventif", desc: "Pencegahan penyakit/komplikasi", icon: <ShieldCheck className="w-8 h-8 text-blue-500" /> },
              { id: "Kuratif", title: "Kuratif", desc: "Penyembuhan/pengobatan", icon: <Stethoscope className="w-8 h-8 text-emerald-500" /> },
              { id: "Rehabilitatif", title: "Rehabilitatif", desc: "Pemulihan fungsi tubuh", icon: <Accessibility className="w-8 h-8 text-sky-500" /> },
              { id: "Paliatif", title: "Paliatif", desc: "Perawatan suportif & nyaman", icon: <HeartPulse className="w-8 h-8 text-amber-500" /> },
            ].map((item) => (
              <Label
                key={item.id}
                htmlFor={item.id}
                className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${
                  editable ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-70"
                } ${perencanaan === item.id ? "border-blue-500 bg-blue-50/50" : ""}`}
              >
                <RadioGroupItem value={item.id} id={item.id} disabled={!editable} />
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* 2. Rencana Detail */}
        <div className="space-y-2">
          <Label htmlFor="perencanaanDetail" className="font-bold text-sm">Rencana Detail:</Label>
          <Textarea 
            id="perencanaanDetail" 
            placeholder="Jelaskan rencana terapi secara detail..." 
            className="min-h-[80px]"
            disabled={!editable}
          />
        </div>

        {/* 3. Pilihan Rencana Tindak Lanjut (Disposisi) */}
        <div className="space-y-3">
          <Label className="font-bold flex items-center gap-2 text-sm">
            <Route className="w-4 h-4" /> Pilih Rencana Tindak Lanjut:
          </Label>
          <RadioGroup 
            value={tindakLanjut} 
            onValueChange={setTindakLanjut}
            disabled={!editable}
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            {[
              { id: "RawatInap", title: "Rawat Inap", desc: "Perawatan intensif", icon: <Bed />, color: "text-blue-600" },
              { id: "RawatJalan", title: "Rawat Jalan", desc: "Boleh pulang", icon: <Footprints />, color: "text-emerald-600" },
              { id: "Dirujuk", title: "Dirujuk", desc: "Ke RS lain", icon: <Ambulance />, color: "text-amber-600" },
              { id: "APS", title: "APS", desc: "Pulang Paksa", icon: <UserX />, color: "text-slate-600" },
              { id: "Meninggal", title: "Meninggal", desc: "Meninggal dunia", icon: <Cross />, color: "text-black", bg: "bg-slate-100" },
            ].map((item) => (
              <Label
                key={item.id}
                htmlFor={item.id}
                className={`flex flex-col items-center text-center p-3 border rounded-lg transition-colors ${
                    editable ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-70"
                } ${tindakLanjut === item.id ? "border-blue-500 ring-1 ring-blue-500" : ""} ${item.bg || ""}`}
              >
                <RadioGroupItem value={item.id} id={item.id} className="sr-only" disabled={!editable} />
                <div className={`${item.color} mb-2`}>
                  {React.cloneElement(item.icon as React.ReactElement)}
                </div>
                <div className="font-bold text-xs uppercase">{item.title}</div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-1">{item.desc}</div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* 4. Detail Form */}
        <Card className="border-sky-200 overflow-hidden">
          <CardHeader className="bg-sky-500 text-white py-2 px-4 flex flex-row items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">Detail Rencana</span>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Indikasi Rawat Inap / Catatan:</Label>
              <Textarea 
                placeholder="Jelaskan indikasi rawat inap, tujuan rujukan, atau informasi tambahan lainnya..." 
                disabled={!editable}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ruang/Kelas (jika rawat inap):</Label>
                <select 
                    className="w-full border rounded-md p-2 text-sm bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!editable}
                >
                  <option>Pilih Ruang/Kelas</option>
                  <option>VIP</option>
                  <option>Kelas 1</option>
                  <option>Kelas 2</option>
                  <option>Kelas 3</option>
                  <option>ICU</option>
                  <option>HCU</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>RS Tujuan Rujukan (jika dirujuk):</Label>
                <Input 
                    placeholder="Nama rumah sakit tujuan" 
                    disabled={!editable}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {editable && (
            <div className="flex justify-end pt-3 border-t">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" /> Simpan Rencana Tindak Lanjut
                </Button>
            </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}