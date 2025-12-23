"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, isValid } from "date-fns";
import { 
  LogOut, Save, Loader2, Activity, UserCheck, 
  FileText, Truck, ChevronDownIcon 
} from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
  initialData?: any;
  editable?: boolean;
  onSuccess?: () => void;
}

const LIST_DOKUMEN = [
  "Surat Rujukan",
  "Resume Medis",
  "Hasil Pemeriksaan Penunjang",
  "Surat Kontrol",
  "Resep Obat"
];

export default function KondisiMeninggalkanIGD({ initialData, editable = false, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    diserahkan_kepada: "",
    keadaan_umum_keluar: "Baik",
    td_keluar: "",
    rr_keluar: "",
    nadi_keluar: "",
    suhu_keluar: "",
    spo2_keluar: "",
    dokumen_diserahkan: [] as string[],
    alasan_keluar: "",
    transportasi_pulang: "kendaraan_pribadi"
  });

  // State khusus Date & Time untuk UI Picker
  const [dateKeluar, setDateKeluar] = useState<Date | undefined>(new Date());
  const [timeKeluar, setTimeKeluar] = useState("16:00:00");

  useEffect(() => {
    if (initialData) {
      setFormData({
        diserahkan_kepada: initialData.diserahkan_kepada || "",
        keadaan_umum_keluar: initialData.keadaan_umum_keluar || "Baik",
        td_keluar: initialData.td_keluar || "",
        rr_keluar: initialData.rr_keluar || "",
        nadi_keluar: initialData.nadi_keluar || "",
        suhu_keluar: initialData.suhu_keluar || "",
        spo2_keluar: initialData.spo2_keluar || "",
        dokumen_diserahkan: initialData.dokumen_diserahkan || [],
        alasan_keluar: initialData.alasan_keluar || "",
        transportasi_pulang: initialData.transportasi_pulang || "kendaraan_pribadi",
      });

      // FIX: Handle Old Value Tanggal ISO
      if (initialData.tanggal_keluar) {
        const d = new Date(initialData.tanggal_keluar);
        if (isValid(d)) setDateKeluar(d);
      }
      
      if (initialData.waktu_keluar) {
        setTimeKeluar(initialData.waktu_keluar);
      }
    }
  }, [initialData]);

  const handleCheckboxChange = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      dokumen_diserahkan: prev.dokumen_diserahkan.includes(doc)
        ? prev.dokumen_diserahkan.filter(d => d !== doc)
        : [...prev.dokumen_diserahkan, doc]
    }));
  };

  const handleSave = async () => {
    if (!id) return toast.error("ID tidak ditemukan");
    if (!dateKeluar) return toast.error("Pilih tanggal keluar");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        tanggal_keluar: format(dateKeluar, "yyyy-MM-dd"),
        waktu_keluar: timeKeluar
      };

      await AsesmentMedicAPI.updateKondisiMeninggalkan(id, payload);
      toast.success("Kondisi meninggalkan IGD berhasil disimpan");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="kondisiMeninggalkan" className="border rounded-lg">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">18</Badge>
          Kondisi Meninggalkan IGD
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Administrasi Keluar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-bold">Administrasi Keluar</h4>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <Label className="px-1 text-xs">Tanggal Keluar</Label>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!editable}
                      className={cn(
                        "w-full justify-between font-normal",
                        !dateKeluar && "text-muted-foreground"
                      )}
                    >
                      {dateKeluar ? format(dateKeluar, "dd/MM/yyyy") : "Pilih Tanggal"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateKeluar}
                      onSelect={(date) => {
                        setDateKeluar(date);
                        setOpenDate(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2 w-32">
                <Label className="px-1 text-xs">Waktu</Label>
                <Input 
                  type="time" 
                  step="1"
                  value={timeKeluar} 
                  onChange={(e) => setTimeKeluar(e.target.value)}
                  disabled={!editable}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Pasien Diserahkan Kepada</Label>
              <Input 
                placeholder="Nama petugas / Keluarga / Tim Medis" 
                value={formData.diserahkan_kepada}
                onChange={(e) => setFormData({...formData, diserahkan_kepada: e.target.value})}
                disabled={!editable}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Alasan Keluar / Ringkasan</Label>
              <Textarea 
                placeholder="Alasan pasien keluar IGD..."
                value={formData.alasan_keluar}
                onChange={(e) => setFormData({...formData, alasan_keluar: e.target.value})}
                disabled={!editable}
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* Section 2: Tanda Vital Terakhir */}
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="flex gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <CardTitle>Status Klinis Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <Label className="mb-4">Keadaan Umum</Label>
                <RadioGroup 
                  value={formData.keadaan_umum_keluar}
                  onValueChange={(val) => setFormData({...formData, keadaan_umum_keluar: val})}
                  className="flex gap-4"
                  disabled={!editable}
                >
                  {["Baik", "Sedang", "Lemah"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <RadioGroupItem value={item} id={`ku-${item}`} />
                      <Label htmlFor={`ku-${item}`} className="text-xs font-normal cursor-pointer">{item}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">TD (mmHg)</Label>
                  <Input placeholder="90/60" className="h-8 text-xs" value={formData.td_keluar} onChange={(e) => setFormData({...formData, td_keluar: e.target.value})} disabled={!editable} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">Nadi (x/m)</Label>
                  <Input type="text" className="h-8 text-xs" value={formData.nadi_keluar} onChange={(e) => setFormData({...formData, nadi_keluar: e.target.value})} disabled={!editable} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">Suhu (°C)</Label>
                  <Input type="text" className="h-8 text-xs" value={formData.suhu_keluar} onChange={(e) => setFormData({...formData, suhu_keluar: e.target.value})} disabled={!editable} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">RR (x/m)</Label>
                  <Input type="text" className="h-8 text-xs" value={formData.rr_keluar} onChange={(e) => setFormData({...formData, rr_keluar: e.target.value})} disabled={!editable} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">SpO2 (%)</Label>
                  <Input type="text" className="h-8 text-xs" value={formData.spo2_keluar} onChange={(e) => setFormData({...formData, spo2_keluar: e.target.value})} disabled={!editable} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 3: Dokumen */}
          <div className="space-y-3 p-4 border rounded-lg bg-background">
            <div className="flex items-center gap-2 pb-2 border-b mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold">Dokumen yang Diserahkan</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIST_DOKUMEN.map((doc) => (
                <div key={doc} className="flex items-center space-x-2">
                  <Checkbox 
                    id={doc} 
                    checked={formData.dokumen_diserahkan.includes(doc)}
                    onCheckedChange={() => handleCheckboxChange(doc)}
                    disabled={!editable}
                  />
                  <Label htmlFor={doc} className="text-xs font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {doc}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Transportasi */}
          <div className="space-y-3 p-4 border rounded-lg bg-background">
            <div className="flex items-center gap-2 pb-2 border-b mb-2">
              <Truck className="w-4 h-4 text-orange-600" />
              <h4 className="text-sm font-bold">Transportasi Pulang</h4>
            </div>
            <RadioGroup 
              value={formData.transportasi_pulang}
              onValueChange={(val) => setFormData({...formData, transportasi_pulang: val})}
              className="grid grid-cols-1 gap-2"
              disabled={!editable}
            >
              {[
                { id: "ambulance", label: "Ambulance" },
                { id: "kendaraan_pribadi", label: "Kendaraan Pribadi" },
                { id: "kendaraan_jenazah", label: "Kendaraan Jenazah" }
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.id} id={item.id} />
                  <Label htmlFor={item.id} className="text-xs font-normal cursor-pointer">{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {editable && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={loading} className="gap-2 min-w-[160px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Kondisi Akhir
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}