"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Save } from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function FaktorSosioKulturalSpiritual({
  editable = false,
}: Props) {
  // dummy state
  const [status, setStatus] = useState<"tidak" | "ada">("tidak");
  const [catatan, setCatatan] = useState("");

  const hasFactor = status === "ada";

  return (
    <Accordion type="single">
      <AccordionItem
        value="sosio-kultural-spiritual"
        className="border rounded-md"
      >
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            Faktor Sosio Kultural Spiritual
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-4">
          {/* info */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
              Faktor sosio kultural dan spiritual dapat memengaruhi proses
              perawatan pasien.
            </AlertDescription>
          </Alert>

          {/* pilihan */}
          <RadioGroup
            value={status}
            onValueChange={(val) => setStatus(val as "tidak" | "ada")}
            className="space-y-3"
            disabled={!editable}
          >
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="kultural-tidak"
                className="flex items-center gap-2"
              >
                <RadioGroupItem value="tidak" id="kultural-tidak" />
                <CheckCircle2 className="h-4 w-4" />
                Tidak ada
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Label
                htmlFor="kultural-ada"
                className="flex items-center gap-2"
              >
                <RadioGroupItem value="ada" id="kultural-ada" />
                <AlertTriangle className="h-4 w-4" />
                Ada
              </Label>
            </div>
          </RadioGroup>

          {/* catatan */}
          {hasFactor && (
            <div className="space-y-2">
              <Label>Catatan (jika ada)</Label>
              <Textarea
                rows={3}
                placeholder="Jelaskan faktor sosio kultural dan spiritual..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                disabled={!editable}
              />
            </div>
          )}

          {/* aksi */}
          {editable && (
            <div className="pt-3 border-t flex justify-end">
              <Button size="sm">
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
