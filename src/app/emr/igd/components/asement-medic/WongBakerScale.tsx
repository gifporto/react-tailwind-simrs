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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Smile, Info, HelpCircle, Save } from "lucide-react";

interface Props {
  editable?: boolean;
}

const faceOptions = [
  { value: "0", emoji: "😊", label: "Tidak Sakit", color: "peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 border-emerald-200 text-emerald-700" },
  { value: "2", emoji: "🙂", label: "Sedikit", color: "peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 border-emerald-200 text-emerald-700" },
  { value: "4", emoji: "😐", label: "Lumayan", color: "peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 border-amber-200 text-amber-700" },
  { value: "6", emoji: "😣", label: "Cukup Sakit", color: "peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 border-amber-200 text-amber-700" },
  { value: "8", emoji: "😢", label: "Sangat Sakit", color: "peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 border-red-200 text-red-700" },
  { value: "10", emoji: "😭", label: "Terburuk", color: "peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 border-red-200 text-red-700" },
];

export default function WongBakerScale({ editable = false }: Props) {
  const [score, setScore] = useState<string>("");

  const handleSave = () => {
    console.log("Simpan Wong-Baker Scale:", score);
  };

  return (
    <AccordionItem value="wongBakerScale" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">9</Badge>
          <Smile className="w-4 h-4 text-amber-500" />
          Wong-Baker FACES® Pain Rating Scale
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-6">
        <Alert className="bg-sky-50 border-sky-200 border-l-4">
          <Info className="w-4 h-4 text-sky-600" />
          <AlertDescription className="text-sky-800 italic text-xs">
            Untuk anak-anak usia 3+ tahun atau pasien dengan kesulitan verbal
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label className="font-bold flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Pilih wajah yang menunjukkan seberapa sakit yang Anda rasakan
          </Label>

          <RadioGroup
            value={score}
            onValueChange={setScore}
            disabled={!editable}
            className="grid grid-cols-3 md:grid-cols-6 gap-2"
          >
            {faceOptions.map((item) => (
              <div key={item.value} className="relative">
                <RadioGroupItem
                  value={item.value}
                  id={`wong-${item.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`wong-${item.value}`}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all text-center h-full min-h-[120px] ${
                    item.color
                  } ${!editable ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-50"}`}
                >
                  <span className="text-4xl md:text-5xl mb-2">{item.emoji}</span>
                  <span className="font-bold text-sm block">{item.value}</span>
                  <span className="text-[10px] md:text-xs leading-tight">{item.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {editable && (
          <div className="flex justify-end pt-3 border-t">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Simpan Wong Baker FACES
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}