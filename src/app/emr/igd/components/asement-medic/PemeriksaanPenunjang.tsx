"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Microscope,
  ScanLine,
  HeartPulse,
  Stethoscope,
  Save,
  Info,
  Loader2,
} from "lucide-react";

import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
  initialData?: any;
  editable?: boolean;
}

export default function PemeriksaanPenunjang({ initialData, editable = false }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  // State disinkronkan dengan key payload API
  const [form, setForm] = useState({
    laboratorium_notes: "",
    radiologi_notes: "",
    ekg_notes: "",
    pemeriksaan_lain_notes: "",
  });

  // Load data awal jika ada
  useEffect(() => {
    if (initialData) {
      setForm({
        laboratorium_notes: initialData.laboratorium_notes || "",
        radiologi_notes: initialData.radiologi_notes || "",
        ekg_notes: initialData.ekg_notes || "",
        pemeriksaan_lain_notes: initialData.pemeriksaan_lain_notes || "",
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await AsesmentMedicAPI.updatePenunjang(id, form);
      toast.success("Pemeriksaan penunjang berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan data pemeriksaan penunjang");
    } finally {
      setLoading(false);
    }
  };

  const SECTIONS = [
    {
      key: "laboratorium_notes",
      label: "Laboratorium",
      icon: Microscope,
      placeholder: "Contoh: Hemoglobin 12.5 g/dl, Leukosit 7.800/ul...",
      rows: 4,
    },
    {
      key: "radiologi_notes",
      label: "Radiologi",
      icon: ScanLine,
      placeholder: "Contoh: Foto thorax PA: Cor dan pulmo normal...",
      rows: 4,
    },
    {
      key: "ekg_notes",
      label: "EKG (Elektrokardiogram)",
      icon: HeartPulse,
      placeholder: "Contoh: Irama sinus, frekuensi 78 x/menit...",
      rows: 3,
    },
    {
      key: "pemeriksaan_lain_notes",
      label: "Pemeriksaan Penunjang Lainnya",
      icon: Stethoscope,
      placeholder: "Contoh: USG Abdomen, Patologi Anatomi, dll...",
      rows: 3,
    },
  ];

  return (
    <AccordionItem value="penunjang" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-bold">13</Badge>
          <span>Pemeriksaan Penunjang & Hasil</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 space-y-6">
        <Alert variant="info">
          <Info className="h-4 w-4 text-sky-600" />
          <AlertDescription className="text-[11px] text-sky-800 font-medium">
            Dokumentasikan seluruh hasil pemeriksaan penunjang (Laboratorium, Radiologi, EKG, dll) secara detail.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((section) => (
            <Card key={section.key} className="shadow-none border-muted overflow-hidden">
              <CardHeader>
                <CardTitle className="font-semibold flex items-center gap-2">
                  <section.icon className="h-3.5 w-3.5 text-primary" />
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <Textarea
                  placeholder={section.placeholder}
                  className="text-xs resize-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent min-h-[100px]"
                  rows={section.rows}
                  value={form[section.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [section.key]: e.target.value }))
                  }
                  disabled={!editable || loading}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {editable && (
          <div className="pt-4 border-t flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="min-w-[160px] h-9 text-xs"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-2" />
              )}
              Simpan Penunjang
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}