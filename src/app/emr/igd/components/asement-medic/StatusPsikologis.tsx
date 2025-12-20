"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Smile, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Frown, 
  Angry, 
  Skull, 
  UserMinus, 
  Users2, 
  Ban,
  Loader2,
} from "lucide-react";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

interface PsikologiData {
  emosi_tenang: boolean;
  emosi_cemas: boolean;
  emosi_takut: boolean;
  emosi_marah: boolean;
  emosi_sedih: boolean;
  risiko_bunuh_diri: boolean;
  risiko_bahaya_diri: boolean;
  risiko_bahaya_orang_lain: boolean;
  risiko_masalah_perilaku: boolean;
  risiko_tidak_masalah: boolean;
}

interface Props {
  initialData?: PsikologiData;
  editable?: boolean;
}

export default function StatusPsikologis({ initialData, editable = false }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<PsikologiData>({
    emosi_tenang: false,
    emosi_cemas: false,
    emosi_takut: false,
    emosi_marah: false,
    emosi_sedih: false,
    risiko_bunuh_diri: false,
    risiko_bahaya_diri: false,
    risiko_bahaya_orang_lain: false,
    risiko_masalah_perilaku: false,
    risiko_tidak_masalah: true,
  });

  // Sinkronisasi data awal dari API melalui Parent
  useEffect(() => {
    if (initialData) {
      setForm({
        emosi_tenang: !!initialData.emosi_tenang,
        emosi_cemas: !!initialData.emosi_cemas,
        emosi_takut: !!initialData.emosi_takut,
        emosi_marah: !!initialData.emosi_marah,
        emosi_sedih: !!initialData.emosi_sedih,
        risiko_bunuh_diri: !!initialData.risiko_bunuh_diri,
        risiko_bahaya_diri: !!initialData.risiko_bahaya_diri,
        risiko_bahaya_orang_lain: !!initialData.risiko_bahaya_orang_lain,
        risiko_masalah_perilaku: !!initialData.risiko_masalah_perilaku,
        risiko_tidak_masalah: !!initialData.risiko_tidak_masalah,
      });
    }
  }, [initialData]);

  const handleToggle = (key: keyof PsikologiData) => {
    if (!editable) return;
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
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
      await AsesmentMedicAPI.updatePsikologi(id, form);
      toast.success("Status Psikologis berhasil diperbarui");
    } catch (error) {
      console.error("Update Psikologi Error:", error);
      toast.error("Gagal menyimpan status psikologis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="statusPsikologis" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">3</Badge>
          Status Psikologis
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          
          {/* Section: Status Emosi */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 py-3">
              <Smile className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-sm">Status Emosi</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "tenang", label: "Tenang", key: "emosi_tenang", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                { id: "cemas", label: "Cemas", key: "emosi_cemas", icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
                { id: "takut", label: "Takut", key: "emosi_takut", icon: <Frown className="w-4 h-4 text-amber-500" /> },
                { id: "marah", label: "Marah", key: "emosi_marah", icon: <Angry className="w-4 h-4 text-red-500" /> },
                { id: "sedih", label: "Sedih", key: "emosi_sedih", icon: <AlertCircle className="w-4 h-4 text-sky-500" /> },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={form[item.key as keyof PsikologiData]} 
                    onCheckedChange={() => handleToggle(item.key as keyof PsikologiData)}
                    disabled={!editable || loading}
                  />
                  <Label htmlFor={item.id} className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                    {item.icon} {item.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section: Penilaian Risiko */}
          <div className="space-y-3">
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle className="text-xs font-bold uppercase">Prioritas Tinggi</AlertTitle>
              <AlertDescription className="text-xs">
                Segera laporkan jika ditemukan indikasi bahaya.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 py-3">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span className="font-semibold text-sm">Penilaian Risiko</span>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "bunuhDiri", label: "Kecenderungan bunuh diri", key: "risiko_bunuh_diri", icon: <Skull className="w-4 h-4" />, danger: true },
                  { id: "bahayaDiri", label: "Membahayakan diri sendiri", key: "risiko_bahaya_diri", icon: <UserMinus className="w-4 h-4" />, danger: true },
                  { id: "bahayaOrangLain", label: "Membahayakan orang lain", key: "risiko_bahaya_orang_lain", icon: <Users2 className="w-4 h-4" />, danger: true },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item.id} 
                      checked={form[item.key as keyof PsikologiData]} 
                      onCheckedChange={() => handleToggle(item.key as keyof PsikologiData)}
                      disabled={!editable || loading}
                    />
                    <Label htmlFor={item.id} className={`flex items-center gap-2 cursor-pointer text-sm ${item.danger ? 'text-red-600 font-bold' : 'font-normal'}`}>
                      {item.icon} {item.label}
                    </Label>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2 pt-1 border-t mt-1">
                  <Checkbox 
                    id="masalahPerilaku" 
                    checked={form.risiko_masalah_perilaku} 
                    onCheckedChange={() => handleToggle("risiko_masalah_perilaku")}
                    disabled={!editable || loading}
                  />
                  <Label htmlFor="masalahPerilaku" className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                    <Ban className="w-4 h-4 text-amber-500" /> Ada masalah perilaku
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tidakMasalah" 
                    checked={form.risiko_tidak_masalah} 
                    onCheckedChange={() => handleToggle("risiko_tidak_masalah")}
                    disabled={!editable || loading}
                  />
                  <Label htmlFor="tidakMasalah" className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tidak ada masalah
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Button */}
        {editable && (
          <div className="flex justify-end mt-4 pt-3 border-t">
            <Button 
              onClick={handleSave} 
              size="sm" 
              variant="default"
              disabled={loading || !id}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Simpan Status Psikologis
                </>
              )}
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}