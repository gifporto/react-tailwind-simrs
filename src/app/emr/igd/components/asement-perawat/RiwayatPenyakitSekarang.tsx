"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function RiwayatPenyakitSekarang({
  editable = false,
}: Props) {
  // dummy state
  const [catatan, setCatatan] = useState("");

  return (
    <Accordion type="single">
      <AccordionItem
        value="riwayat-penyakit-sekarang"
        className="border rounded-md"
      >
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            Riwayat Penyakit Sekarang
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="riwayat-penyakit-sekarang">
              Catatan Riwayat Penyakit Sekarang
            </Label>
            <Textarea
              id="riwayat-penyakit-sekarang"
              rows={5}
              placeholder="Tuliskan riwayat penyakit sekarang yang dialami pasien..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              disabled={!editable}
            />
          </div>

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
