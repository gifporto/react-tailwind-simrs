"use client";

import { useState } from "react";
import {
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

export default function Alergi({ editable = false }: Props) {
  // dummy state
  const [statusAlergi, setStatusAlergi] = useState<"tidak" | "ya">("tidak");
  const [keterangan, setKeterangan] = useState("");

  const hasAlergi = statusAlergi === "ya";

  return (
    <AccordionItem value="alergi" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <Badge variant="outline">2</Badge>
          Alergi
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        {/* warning */}
        <Alert className="border-yellow-300 bg-yellow-50 text-yellow-900">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Penting</AlertTitle>
          <AlertDescription>
            Informasi alergi sangat penting untuk keselamatan pasien
          </AlertDescription>
        </Alert>

        {/* pilihan alergi */}
        <RadioGroup
          value={statusAlergi}
          onValueChange={(val) => setStatusAlergi(val as "ya" | "tidak")}
          className="space-y-3"
          disabled={!editable}
        >
          <div className="flex items-center space-x-2">
            <Label htmlFor="alergi-tidak" className="flex items-center gap-2">
              <RadioGroupItem value="tidak" id="alergi-tidak" />
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Tidak ada alergi
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="alergi-ada" className="flex items-center gap-2">
              <RadioGroupItem value="ya" id="alergi-ada" />
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Ada alergi
            </Label>
          </div>
        </RadioGroup>

        {/* detail alergi */}
        {hasAlergi && (
          <div className="space-y-2">
            <Label>Jelaskan Alergi</Label>
            <Textarea
              rows={3}
              placeholder="Contoh: alergi obat, makanan, dll"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              disabled={!editable}
            />
          </div>
        )}

        {/* aksi */}
        {editable && (
          <div className="pt-3 border-t flex justify-end">
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Simpan Alergi
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
