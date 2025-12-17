"use client";

import React, { useState } from "react";
import {
    Accordion,
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
import { 
  Brain, 
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
} from "lucide-react";

export default function StatusPsikologis() {
  // Mock data sesuai struktur data asli yang diberikan
  const [data, setData] = useState({
    emosi_tenang: true,
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

  const handleSave = () => {
    console.log("Saving Status Psikologis:", data);
  };

  return (
    <AccordionItem value="statusPsikologis" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
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
              <div className="flex items-center space-x-2">
                <Checkbox id="tenang" checked={data.emosi_tenang} />
                <Label htmlFor="tenang" className="flex items-center gap-2 cursor-pointer">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tenang
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cemas" checked={data.emosi_cemas} />
                <Label htmlFor="cemas" className="flex items-center gap-2 cursor-pointer">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Cemas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="takut" checked={data.emosi_takut} />
                <Label htmlFor="takut" className="flex items-center gap-2 cursor-pointer">
                  <Frown className="w-4 h-4 text-amber-500" /> Takut
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="marah" checked={data.emosi_marah} />
                <Label htmlFor="marah" className="flex items-center gap-2 cursor-pointer">
                  <Angry className="w-4 h-4 text-red-500" /> Marah
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sedih" checked={data.emosi_sedih} />
                <Label htmlFor="sedih" className="flex items-center gap-2 cursor-pointer">
                  <AlertCircle className="w-4 h-4 text-sky-500" /> Sedih
                </Label>
              </div>
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="bunuhDiri" checked={data.risiko_bunuh_diri} />
                  <Label htmlFor="bunuhDiri" className="flex items-center gap-2 cursor-pointer text-red-600 font-bold">
                    <Skull className="w-4 h-4" /> Kecenderungan bunuh diri
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bahayaDiri" checked={data.risiko_bahaya_diri} />
                  <Label htmlFor="bahayaDiri" className="flex items-center gap-2 cursor-pointer text-red-600 font-bold">
                    <UserMinus className="w-4 h-4" /> Membahayakan diri sendiri
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bahayaOrangLain" checked={data.risiko_bahaya_orang_lain} />
                  <Label htmlFor="bahayaOrangLain" className="flex items-center gap-2 cursor-pointer text-red-600 font-bold">
                    <Users2 className="w-4 h-4" /> Membahayakan orang lain
                  </Label>
                </div>
                <div className="flex items-center space-x-2 pt-1 border-t mt-1">
                  <Checkbox id="masalahPerilaku" checked={data.risiko_masalah_perilaku} />
                  <Label htmlFor="masalahPerilaku" className="flex items-center gap-2 cursor-pointer">
                    <Ban className="w-4 h-4 text-amber-500" /> Ada masalah perilaku
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tidakMasalah" checked={data.risiko_tidak_masalah} />
                  <Label htmlFor="tidakMasalah" className="flex items-center gap-2 cursor-pointer">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tidak ada masalah
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4 pt-3 border-t">
          <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" /> Simpan Status Psikologis
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}