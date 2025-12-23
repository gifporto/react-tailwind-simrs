"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner"; 
import { Save, Loader2 } from "lucide-react";

import { AsesmentMedicAPI } from "@/lib/api"; 

interface AnamnesaData {
  keluhan_utama: string;
  riwayat_sekarang: string;
  riwayat_dahulu: string;
  riwayat_keluarga: string;
  obat_dikonsumsi: string;
  alergi: string; // "ada" atau "tidak_ada" sesuai response API
  alergi_keterangan: string;
}

interface Props {
  initialData?: AnamnesaData; 
  editable?: boolean;
  onSuccess?: () => void;
}

export default function Anamnesa({ initialData, editable = false, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<AnamnesaData>({
    keluhan_utama: "",
    riwayat_sekarang: "",
    riwayat_dahulu: "",
    riwayat_keluarga: "",
    obat_dikonsumsi: "",
    alergi: "tidak_ada",
    alergi_keterangan: "",
  });

  // Sinkronisasi data dari parent/API
  useEffect(() => {
    if (initialData) {
      setForm({
        keluhan_utama: initialData.keluhan_utama || "",
        riwayat_sekarang: initialData.riwayat_sekarang || "",
        riwayat_dahulu: initialData.riwayat_dahulu || "",
        riwayat_keluarga: initialData.riwayat_keluarga || "",
        obat_dikonsumsi: initialData.obat_dikonsumsi || "",
        alergi: initialData.alergi || "tidak_ada",
        alergi_keterangan: initialData.alergi_keterangan || "",
      });
    }
  }, [initialData]);

  const handleChange = (key: keyof AnamnesaData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) {
      toast.error("ID tidak ditemukan");
      return;
    }
    
    try {
      setLoading(true);
      await AsesmentMedicAPI.updateAnamnesa(id, form);
      toast.success("Anamnesa berhasil diperbarui");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="anamnesa" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">1</Badge>
          Anamnesa
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        {/* Keluhan Utama */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Keluhan Utama</Label>
          <Textarea
            rows={2}
            placeholder="Contoh: Demam tinggi sejak 3 hari..."
            value={form.keluhan_utama}
            onChange={(e) => handleChange("keluhan_utama", e.target.value)}
            disabled={!editable || loading}
          />
        </div>

        {/* Riwayat Penyakit Sekarang */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Riwayat Penyakit Sekarang</Label>
          <Textarea
            rows={3}
            placeholder="Jelaskan kronologi keluhan..."
            value={form.riwayat_sekarang}
            onChange={(e) => handleChange("riwayat_sekarang", e.target.value)}
            disabled={!editable || loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Riwayat Penyakit Dahulu</Label>
            <Textarea
              rows={2}
              value={form.riwayat_dahulu}
              onChange={(e) => handleChange("riwayat_dahulu", e.target.value)}
              disabled={!editable || loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Riwayat Penyakit Keluarga</Label>
            <Textarea
              rows={2}
              value={form.riwayat_keluarga}
              onChange={(e) => handleChange("riwayat_keluarga", e.target.value)}
              disabled={!editable || loading}
            />
          </div>
        </div>

        {/* Status Alergi */}
        <div className="space-y-3 p-3 border rounded-md bg-muted/20">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Apakah ada Alergi?</Label>
            <RadioGroup
              disabled={!editable || loading}
              value={form.alergi}
              onValueChange={(val) => handleChange("alergi", val)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ada" id="ada" />
                <Label htmlFor="ada" className="font-normal">Ya (Ada)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tidak_ada" id="tidak_ada" />
                <Label htmlFor="tidak_ada" className="font-normal">Tidak Ada</Label>
              </div>
            </RadioGroup>
          </div>

          {form.alergi === "ada" && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-destructive">Keterangan Alergi</Label>
              <Textarea
                rows={2}
                placeholder="Sebutkan alergi obat, makanan, atau lainnya..."
                value={form.alergi_keterangan}
                onChange={(e) => handleChange("alergi_keterangan", e.target.value)}
                disabled={!editable || loading}
              />
            </div>
          )}
        </div>

        {/* Obat yang dikonsumsi */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Obat yang Sedang Dikonsumsi</Label>
          <Textarea
            rows={2}
            value={form.obat_dikonsumsi}
            onChange={(e) => handleChange("obat_dikonsumsi", e.target.value)}
            disabled={!editable || loading}
          />
        </div>

        {/* Tombol Aksi */}
        {editable && (
          <div className="pt-3 border-t flex justify-end">
            <Button 
              type="button" 
              size="sm" 
              onClick={handleSave} 
              disabled={loading || !id}
              className="relative z-10 min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Anamnesa
                </>
              )}
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}