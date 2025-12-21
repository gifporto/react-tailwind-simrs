"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Info,
  Save,
  Loader2,
  CalendarIcon,
  ChevronDownIcon,
  Stethoscope
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
  initialData?: any;
  editable?: boolean;
}

export default function EdukasiDischarge({ initialData, editable = false }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  // State Form sesuai Payload LENGKAP
  const [formData, setFormData] = useState({
    perlu_kontrol: "tidak",
    tanggal_kontrol: undefined as Date | undefined,
    poli_tujuan: "",
    catatan_kontrol: "",
    edukasi_diet_nutrisi: "",
    edukasi_aktivitas: "",
    edukasi_obat: "",
    edukasi_tanda_bahaya: "",
    edukasi_perawatan_rumah: "",
    edukasi_diberikan: false,
    resep_diberikan: false,
    surat_kontrol_diberikan: false,
    // Tambahan data dokumen checkbox
    dokumen_resume_medis: false,
    dokumen_resep_obat: false,
    dokumen_hasil_lab: false,
    dokumen_radiologi: false,
    dokumen_surat_kontrol: false,
    dokumen_surat_rujukan: false,
    nama_pemberi_edukasi: ""
  });

  // Sinkronisasi data awal (Old Value)
  useEffect(() => {
    if (initialData) {
      setFormData({
        perlu_kontrol: initialData.perlu_kontrol || "tidak",
        tanggal_kontrol: initialData.tanggal_kontrol ? new Date(initialData.tanggal_kontrol) : undefined,
        poli_tujuan: initialData.poli_tujuan || "",
        catatan_kontrol: initialData.catatan_kontrol || "",
        edukasi_diet_nutrisi: initialData.edukasi_diet_nutrisi || "",
        edukasi_aktivitas: initialData.edukasi_aktivitas || "",
        edukasi_obat: initialData.edukasi_obat || "",
        edukasi_tanda_bahaya: initialData.edukasi_tanda_bahaya || "",
        edukasi_perawatan_rumah: initialData.edukasi_perawatan_rumah || "",
        edukasi_diberikan: !!initialData.edukasi_diberikan,
        resep_diberikan: !!initialData.resep_diberikan,
        surat_kontrol_diberikan: !!initialData.surat_kontrol_diberikan,
        // Sinkronisasi tambahan dokumen
        dokumen_resume_medis: !!initialData.dokumen_resume_medis,
        dokumen_resep_obat: !!initialData.dokumen_resep_obat,
        dokumen_hasil_lab: !!initialData.dokumen_hasil_lab,
        dokumen_radiologi: !!initialData.dokumen_radiologi,
        dokumen_surat_kontrol: !!initialData.dokumen_surat_kontrol,
        dokumen_surat_rujukan: !!initialData.dokumen_surat_rujukan,
        nama_pemberi_edukasi: initialData.nama_pemberi_edukasi || ""
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!id) return toast.error("ID tidak ditemukan");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        tanggal_kontrol: formData.tanggal_kontrol ? format(formData.tanggal_kontrol, "yyyy-MM-dd") : null,
        edukasi_perawatan_rumah: formData.edukasi_perawatan_rumah || null
      };

      await AsesmentMedicAPI.updateDischargePlan(id, payload);
      toast.success("Edukasi & Discharge Planning berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="edukasi" className="border rounded-lg">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-3">
          <Badge variant="outline">12</Badge>
          Edukasi & Discharge Planning
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-6">
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Pastikan pasien dan keluarga memahami instruksi perawatan pasca-IGD untuk mencegah komplikasi.
          </AlertDescription>
        </Alert>

        {/* Section 1: Rencana Kontrol */}
        <div className="space-y-4">
          <Label>
            <CalendarIcon className="w-4 h-4 text-primary" /> Rencana Kontrol Kembali
          </Label>

          <RadioGroup
            value={formData.perlu_kontrol}
            onValueChange={(v) => setFormData({ ...formData, perlu_kontrol: v })}
            className="flex gap-4"
            disabled={!editable || loading}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tidak" id="k-tidak" />
              <Label htmlFor="k-tidak" className="text-sm font-normal">Tidak Perlu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ya" id="k-ya" />
              <Label htmlFor="k-ya" className="text-sm font-normal">Perlu Kontrol</Label>
            </div>
          </RadioGroup>

          {formData.perlu_kontrol === "ya" && (
            <div className="p-4 rounded-lg border bg-muted/20 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label>Tanggal Kontrol</Label>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!editable || loading}
                      className={cn("w-full justify-between font-normal h-9", !formData.tanggal_kontrol && "text-muted-foreground")}
                    >
                      {formData.tanggal_kontrol ? format(formData.tanggal_kontrol, "dd/MM/yyyy") : "Pilih Tanggal"}
                      <ChevronDownIcon className="h-3 w-3 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_kontrol}
                      onSelect={(date) => { setFormData({ ...formData, tanggal_kontrol: date }); setOpenDate(false); }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Poli Tujuan</Label>
                <Select
                  disabled={!editable || loading}
                  value={formData.poli_tujuan}
                  onValueChange={(v) => setFormData({ ...formData, poli_tujuan: v })}
                >
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="Pilih Poli" />
                  </SelectTrigger>
                  <SelectContent>
                    {["IGD RSUP Dr. Sardjito", "Poli Umum", "Poli Bedah", "Poli Jantung", "Poli Paru", "Poli Saraf"].map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>Catatan Kontrol</Label>
                <Textarea
                  placeholder="Instruksi khusus saat kontrol..."
                  value={formData.catatan_kontrol}
                  onChange={(e) => setFormData({ ...formData, catatan_kontrol: e.target.value })}
                  disabled={!editable || loading}
                  className="min-h-[60px] bg-background text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Edukasi Pasien */}
        <div className="space-y-4">
          <Label className="text-sm font-bold flex items-center gap-2 border-b pb-2">
            <GraduationCap className="w-4 h-4 text-primary" /> Edukasi Pasien & Keluarga
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Edukasi Obat</Label>
              <Textarea
                className="text-sm min-h-[80px]"
                placeholder="Cara minum, dosis, efek samping..."
                value={formData.edukasi_obat}
                onChange={(e) => setFormData({ ...formData, edukasi_obat: e.target.value })}
                disabled={!editable}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Diet & Nutrisi</Label>
              <Textarea
                className="text-sm min-h-[80px]"
                placeholder="Pantangan makan, frekuensi makan..."
                value={formData.edukasi_diet_nutrisi}
                onChange={(e) => setFormData({ ...formData, edukasi_diet_nutrisi: e.target.value })}
                disabled={!editable}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Aktivitas & Mobilisasi</Label>
              <Textarea
                className="text-sm min-h-[80px]"
                placeholder="Batasan aktivitas, bed rest..."
                value={formData.edukasi_aktivitas}
                onChange={(e) => setFormData({ ...formData, edukasi_aktivitas: e.target.value })}
                disabled={!editable}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tanda Bahaya (Red Flags)</Label>
              <Textarea
                className="text-sm min-h-[80px]"
                placeholder="Kapan harus segera kembali ke IGD..."
                value={formData.edukasi_tanda_bahaya}
                onChange={(e) => setFormData({ ...formData, edukasi_tanda_bahaya: e.target.value })}
                disabled={!editable}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Perawatan di Rumah</Label>
            <Textarea
              className="text-sm min-h-[60px]"
              placeholder="Perawatan luka, kebersihan diri, dll..."
              value={formData.edukasi_perawatan_rumah}
              onChange={(e) => setFormData({ ...formData, edukasi_perawatan_rumah: e.target.value })}
              disabled={!editable}
            />
          </div>
        </div>

        {/* Section 3: Ringkasan Discharge */}
        <div className="p-4 rounded-lg border bg-blue-50/30 space-y-4">
          <Label>
            <Stethoscope className="w-4 h-4 text-blue-600" /> Ringkasan Discharge
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="e-berikan"
                checked={formData.edukasi_diberikan}
                onCheckedChange={(v) => setFormData({ ...formData, edukasi_diberikan: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="e-berikan" className="text-xs font-medium cursor-pointer">Edukasi telah dipahami</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="r-berikan"
                checked={formData.resep_diberikan}
                onCheckedChange={(v) => setFormData({ ...formData, resep_diberikan: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="r-berikan" className="text-xs font-medium cursor-pointer">Resep obat telah diberikan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="s-berikan"
                checked={formData.surat_kontrol_diberikan}
                onCheckedChange={(v) => setFormData({ ...formData, surat_kontrol_diberikan: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="s-berikan" className="text-xs font-medium cursor-pointer">Surat kontrol telah diberikan</Label>
            </div>
            {/* Checkbox tambahan dokumen */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doc-resume"
                checked={formData.dokumen_resume_medis}
                onCheckedChange={(v) => setFormData({ ...formData, dokumen_resume_medis: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="doc-resume" className="text-xs font-medium cursor-pointer">Resume Medis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doc-resep"
                checked={formData.dokumen_resep_obat}
                onCheckedChange={(v) => setFormData({ ...formData, dokumen_resep_obat: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="doc-resep" className="text-xs font-medium cursor-pointer">Resep Obat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doc-lab"
                checked={formData.dokumen_hasil_lab}
                onCheckedChange={(v) => setFormData({ ...formData, dokumen_hasil_lab: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="doc-lab" className="text-xs font-medium cursor-pointer">Hasil Lab</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doc-rad"
                checked={formData.dokumen_radiologi}
                onCheckedChange={(v) => setFormData({ ...formData, dokumen_radiologi: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="doc-rad" className="text-xs font-medium cursor-pointer">Hasil Radiologi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doc-skontol"
                checked={formData.dokumen_surat_kontrol}
                onCheckedChange={(v) => setFormData({ ...formData, dokumen_surat_kontrol: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="doc-skontol" className="text-xs font-medium cursor-pointer">Surat Kontrol (Dokumen)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="doc-srujukan"
                checked={formData.dokumen_surat_rujukan}
                onCheckedChange={(v) => setFormData({ ...formData, dokumen_surat_rujukan: !!v })}
                disabled={!editable}
              />
              <Label htmlFor="doc-srujukan" className="text-xs font-medium cursor-pointer">Surat Rujukan</Label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Nama Pemberi Edukasi</Label>
            <Input
              placeholder="Nama Dokter/Perawat..."
              value={formData.nama_pemberi_edukasi}
              onChange={(e) => setFormData({ ...formData, nama_pemberi_edukasi: e.target.value })}
              disabled={!editable}
            />
          </div>
        </div>

        {/* Action Button */}
        {editable && (
          <div className="pt-3 border-t flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={loading} className="min-w-[160px]">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Simpan Discharge Planning
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}