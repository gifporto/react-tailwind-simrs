"use client";

import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Frown, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Save 
} from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function SkriningNyeri({ editable = false }: Props) {
  const [hasPain, setHasPain] = useState<string>("tidak");

  const handleSave = () => {
    console.log("Simpan Skrining Nyeri:", { skrining_nyeri: hasPain });
  };

  return (
    <AccordionItem value="skriningNyeri" className="border rounded-md mb-2">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <Badge variant="outline">7</Badge>
          <Frown className="w-4 h-4 text-orange-500" />
          Skrining Nyeri
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        {/* Info Alert */}
        <Alert variant="warning">
          <AlertTriangle />
          <AlertDescription>
            Penilaian nyeri penting untuk penanganan yang tepat
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label className="font-bold text-base">Apakah pasien merasakan nyeri?</Label>
          
          <RadioGroup
            value={hasPain}
            onValueChange={setHasPain}
            disabled={!editable}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Opsi: Tidak Ada Nyeri */}
            <div className="relative">
              <RadioGroupItem
                value="tidak"
                id="nyeri-tidak"
                className="peer sr-only"
              />
              <Label
                htmlFor="nyeri-tidak"
                className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 border-slate-200 hover:bg-slate-50 ${
                  !editable && "opacity-70 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  Tidak ada nyeri
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  Pasien tidak merasakan nyeri
                </span>
              </Label>
            </div>

            {/* Opsi: Ada Nyeri */}
            <div className="relative">
              <RadioGroupItem
                value="ya"
                id="nyeri-ada"
                className="peer sr-only"
              />
              <Label
                htmlFor="nyeri-ada"
                className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 border-slate-200 hover:bg-slate-50 ${
                  !editable && "opacity-70 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  Ada nyeri
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  Lanjutkan dengan penilaian skala nyeri
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Feedback visual jika ada nyeri (Simulasi script toggle) */}
        {hasPain === "ya" && (
          <div className="mt-4 p-4 border border-dashed border-orange-300 rounded-md bg-orange-50 animate-in fade-in slide-in-from-top-1">
            <p className="text-sm text-orange-800 font-medium italic">
              * Silakan lengkapi bagian Skala Nyeri (Numeric/Wong-Baker) yang muncul di bawah.
            </p>
          </div>
        )}

        {editable && (
          <div className="flex justify-end mt-4 pt-3 border-t">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Simpan Skrining Nyeri
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}