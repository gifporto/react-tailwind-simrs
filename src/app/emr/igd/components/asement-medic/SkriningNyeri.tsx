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
import { Frown, AlertTriangle, CheckCircle2, AlertCircle, Save, Loader2 } from "lucide-react";
import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
  initialData?: any;
  editable?: boolean;
  onSuccess?: () => void;
}

export default function SkriningNyeri({ initialData, editable = false, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [hasPain, setHasPain] = useState<string>("tidak");

  useEffect(() => {
    if (initialData?.skrining_nyeri) {
      setHasPain(initialData.skrining_nyeri);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await AsesmentMedicAPI.updateSkriningNeyri(id, { skrining_nyeri: hasPain });
      toast.success("Skrining nyeri diperbarui");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="skriningNyeri" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">7</Badge>
          Skrining Nyeri
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            Penilaian nyeri penting untuk penanganan yang tepat.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Apakah pasien merasakan nyeri?</Label>
          <RadioGroup value={hasPain} onValueChange={setHasPain} disabled={!editable || loading} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label htmlFor="nyeri-tidak" className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${hasPain === "tidak" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
              <div className="flex items-center gap-2 font-bold text-emerald-700">
                <RadioGroupItem value="tidak" id="nyeri-tidak" className="sr-only" />
                <CheckCircle2 className="w-5 h-5" /> Tidak ada nyeri
              </div>
            </Label>
            <Label htmlFor="nyeri-ada" className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${hasPain === "ya" ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
              <div className="flex items-center gap-2 font-bold text-red-700">
                <RadioGroupItem value="ya" id="nyeri-ada" className="sr-only" />
                <AlertCircle className="w-5 h-5" /> Ada nyeri
              </div>
            </Label>
          </RadioGroup>
        </div>

        {editable && (
          <div className="flex justify-end mt-4 pt-3 border-t">
            <Button onClick={handleSave} disabled={loading} size="sm">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Skrining Nyeri
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}