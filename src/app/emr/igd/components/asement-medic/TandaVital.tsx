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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, PlusCircle, Trash2, Calendar, Clock, Weight, Ruler, Save } from "lucide-react";

interface VitalSignEntry {
  id: number;
  tanggal: string;
  waktu: string;
  td: string;
  rr: string;
  nadi: string;
  suhu: string;
  spo2: string;
  bb: string;
  tb: string;
  catatan: string;
}

interface Props {
  editable?: boolean;
}

export default function TandaVital({ editable = false }: Props) {
  const [entries, setEntries] = useState<VitalSignEntry[]>([
    { id: 1, tanggal: "", waktu: "", td: "", rr: "", nadi: "", suhu: "", spo2: "", bb: "", tb: "", catatan: "" }
  ]);

  const addEntry = () => {
    const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
    setEntries([...entries, { id: newId, tanggal: "", waktu: "", td: "", rr: "", nadi: "", suhu: "", spo2: "", bb: "", tb: "", catatan: "" }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  return (
    <AccordionItem value="tandaVital" className="border rounded-md mb-2">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">6</Badge>
          <HeartPulse className="w-4 h-4 text-red-500" />
          Tanda-Tanda Vital (TTV)
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-6">
        <Alert className="bg-sky-50 border-sky-200">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-sky-600" />
            <div>
              <p className="font-semibold text-sky-900">VITAL SIGN - Tanda-Tanda Vital Pasien</p>
              <p className="text-xs text-sky-700">Monitor dan catat tanda vital pasien secara berkala</p>
            </div>
          </div>
        </Alert>

        <div className="flex justify-between items-center">
          <h5 className="font-bold flex items-center gap-2 italic">Input Vital Sign</h5>
          {editable && (
            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600 hover:bg-emerald-50" onClick={addEntry}>
              <PlusCircle className="w-4 h-4 mr-1" /> Tambah Form
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {entries.map((entry, index) => (
            <Card key={entry.id} className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 py-2 px-4 flex-row justify-between items-center space-y-0 border-b">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold">Vital Sign #{index + 1}</span>
                </div>
                {editable && entries.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeEntry(entry.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1 font-bold"><Calendar className="w-3 h-3" /> Tanggal <span className="text-red-500">*</span></Label>
                    <Input type="date" disabled={!editable} required />
                  </div>
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1 font-bold"><Clock className="w-3 h-3" /> Waktu <span className="text-red-500">*</span></Label>
                    <Input type="time" disabled={!editable} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="font-bold"><Badge className="bg-red-500 h-5 px-1 mr-1">TD</Badge> Tekanan Darah</Label>
                    <div className="flex items-center"><Input placeholder="120/80" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">mmHg</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold"><Badge className="bg-blue-500 h-5 px-1 mr-1">RR</Badge> Respirasi</Label>
                    <div className="flex items-center"><Input type="number" placeholder="20" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">x/m</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold"><Badge className="bg-emerald-500 h-5 px-1 mr-1">N</Badge> Nadi</Label>
                    <div className="flex items-center"><Input type="number" placeholder="80" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">x/m</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold"><Badge className="bg-amber-500 h-5 px-1 mr-1">S</Badge> Suhu</Label>
                    <div className="flex items-center"><Input type="number" placeholder="36.5" step="0.1" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">°C</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="font-bold"><Badge variant="outline" className="h-5 px-1 mr-1">SPO₂</Badge> Saturasi</Label>
                    <div className="flex items-center"><Input type="number" placeholder="98" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">%</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold"><Weight className="w-3 h-3 inline mr-1" /> Berat Badan</Label>
                    <div className="flex items-center"><Input type="number" placeholder="70" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">kg</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold"><Ruler className="w-3 h-3 inline mr-1" /> Tinggi Badan</Label>
                    <div className="flex items-center"><Input type="number" placeholder="170" disabled={!editable} /><span className="ml-2 text-xs text-muted-foreground">cm</span></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="font-bold">Catatan Tambahan</Label>
                  <Textarea placeholder="Kondisi pasien saat pengukuran..." disabled={!editable} rows={2} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editable && (
          <div className="flex justify-end pt-3 border-t">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Simpan Semua Data Vital Sign
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}