"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Smile, Info, Save, Loader2 } from "lucide-react";
import { AsesmentMedicAPI } from "@/lib/api";

export default function WongBakerScale({ initialData, editable = false }: { initialData?: any, editable?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<string>("0");

  useEffect(() => {
    if (initialData?.wong_baker_scale != null) {
      setScore(initialData.wong_baker_scale.toString());
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await AsesmentMedicAPI.updateSkriningNeyri(id, { wong_baker_scale: Number(score) });
      toast.success("Wong-Baker diperbarui");
    } catch (error) {
      toast.error("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="wongBakerScale" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">9</Badge>
          Wong-Baker FACES®
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        <Alert className="bg-sky-50 border-sky-200">
          <Info className="w-4 h-4 text-sky-600" />
          <AlertDescription className="text-sky-800 text-xs">Untuk anak usia 3+ atau pasien kendala verbal.</AlertDescription>
        </Alert>
        <RadioGroup value={score} onValueChange={setScore} disabled={!editable || loading} className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {["0", "2", "4", "6", "8", "10"].map((v) => (
            <Label key={v} className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${score === v ? "border-primary bg-primary/5" : "border-muted"}`}>
              <RadioGroupItem value={v} className="sr-only" />
              <span className="text-3xl mb-1">{v === "0" ? "😊" : v === "2" ? "🙂" : v === "4" ? "😐" : v === "6" ? "😣" : v === "8" ? "😢" : "😭"}</span>
              <span className="font-bold text-sm">{v}</span>
            </Label>
          ))}
        </RadioGroup>
        {editable && (
          <div className="flex justify-end pt-3 border-t"><Button onClick={handleSave} disabled={loading} size="sm"><Save className="w-4 h-4 mr-2" /> Simpan</Button></div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}