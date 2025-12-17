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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GraduationCap,
  Info,
  Save,
} from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function EdukasiDischarge({ editable = false }: Props) {
  const [kontrol, setKontrol] = useState<"ya" | "tidak">("tidak");

  return (
    <Accordion type="single">
      <AccordionItem value="edukasi" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">12</Badge>
            Edukasi & Discharge Planning
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-4">
          {/* info */}
          <Alert className="bg-muted/40">
            <Info className="h-4 w-4" />
            <AlertTitle>Informasi</AlertTitle>
            <AlertDescription>
              Edukasi penting untuk keberhasilan perawatan dan pemulihan pasien
            </AlertDescription>
          </Alert>

          {/* rencana kontrol */}
          <div className="space-y-3">
            <Label className="font-semibold">
              Apakah pasien perlu kontrol kembali?
            </Label>

            <RadioGroup
              value={kontrol}
              onValueChange={(v) => setKontrol(v as "ya" | "tidak")}
              className="space-y-2"
              disabled={!editable}
            >
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="tidak" />
                Tidak Perlu Kontrol
              </Label>

              <Label className="flex items-center gap-2">
                <RadioGroupItem value="ya" />
                Perlu Kontrol
              </Label>
            </RadioGroup>

            {kontrol === "ya" && (
              <div className="space-y-3 border-l pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Tanggal Kontrol</Label>
                    <Input type="date" disabled={!editable} />
                  </div>
                  <div>
                    <Label>Poli Tujuan</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      disabled={!editable}
                    >
                      <option>Pilih Poli</option>
                      <option>Poli Umum</option>
                      <option>Poli Bedah</option>
                      <option>Poli Jantung</option>
                      <option>Poli Paru</option>
                      <option>Poli Saraf</option>
                      <option>Poli Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Catatan Kontrol</Label>
                  <Textarea
                    rows={2}
                    placeholder="Tujuan kontrol dan evaluasi lanjutan"
                    disabled={!editable}
                  />
                </div>
              </div>
            )}
          </div>

          {/* edukasi pasien */}
          <div className="space-y-3">
            <Label className="font-semibold">
              Edukasi Pasien & Keluarga
            </Label>

            <Textarea
              rows={3}
              placeholder="Edukasi Obat"
              disabled={!editable}
            />
            <Textarea
              rows={2}
              placeholder="Edukasi Diet & Nutrisi"
              disabled={!editable}
            />
            <Textarea
              rows={2}
              placeholder="Edukasi Aktivitas"
              disabled={!editable}
            />
            <Textarea
              rows={3}
              placeholder="Tanda Bahaya (Red Flags)"
              disabled={!editable}
            />
            <Textarea
              rows={2}
              placeholder="Perawatan di Rumah"
              disabled={!editable}
            />
          </div>

          {/* discharge */}
          <div className="space-y-2">
            <Label className="font-semibold">Ringkasan Discharge</Label>

            <Label className="flex items-center gap-2 text-sm">
              <Checkbox disabled={!editable} />
              Edukasi telah diberikan dan dipahami
            </Label>

            <Label className="flex items-center gap-2 text-sm">
              <Checkbox disabled={!editable} />
              Resep obat telah diberikan
            </Label>

            <Label className="flex items-center gap-2 text-sm">
              <Checkbox disabled={!editable} />
              Surat kontrol telah diberikan
            </Label>

            <div>
              <Label>Nama Pemberi Edukasi</Label>
              <Input
                placeholder="Nama dokter/perawat"
                disabled={!editable}
              />
            </div>
          </div>

          {/* aksi */}
          {editable && (
            <div className="pt-3 border-t flex justify-end">
              <Button size="sm">
                <Save className="h-4 w-4 mr-1" />
                Simpan Edukasi & Discharge Planning
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
