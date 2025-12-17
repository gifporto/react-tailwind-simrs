"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Props {
  editable?: boolean;
}

type MorseKey = "riwayatJatuh" | "diagnosaSekunder";

export default function AsesmenRisikoJatuh({ editable = false }: Props) {
  // dummy state (sesuai data HTML)
  const [scores, setScores] = useState<Record<MorseKey, number>>({
    riwayatJatuh: 0,
    diagnosaSekunder: 0,
  });

  const totalScore = scores.riwayatJatuh + scores.diagnosaSekunder;

  const kategori =
    totalScore === 0
      ? "Tidak Ada Risiko"
      : totalScore <= 24
      ? "Risiko Rendah"
      : totalScore <= 44
      ? "Risiko Sedang"
      : "Risiko Tinggi";

  const setScore = (key: MorseKey, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Accordion type="single">
      <AccordionItem value="risiko-jatuh" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            Asesmen Risiko Jatuh
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="border rounded-md p-3">
            <h4 className="text-sm font-semibold mb-3">
              Morse Fall Scale (Pasien Dewasa)
            </h4>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faktor Risiko</TableHead>
                  <TableHead>Skala</TableHead>
                  <TableHead>Poin</TableHead>
                  <TableHead className="text-center">Skor Pasien</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Riwayat jatuh */}
                <TableRow>
                  <TableCell>Riwayat jatuh</TableCell>
                  <TableCell>
                    <RadioGroup
                      defaultValue="0"
                      onValueChange={(v) => setScore("riwayatJatuh", Number(v))}
                      disabled={!editable}
                      className="flex gap-4"
                    >
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="25" /> Ya
                      </Label>
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="0" /> Tidak
                      </Label>
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <div>Ya: 25</div>
                    <div>Tidak: 0</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input readOnly value={scores.riwayatJatuh} className="text-center" />
                  </TableCell>
                </TableRow>

                {/* Diagnosa sekunder */}
                <TableRow>
                  <TableCell>Diagnosa sekunder (≥ 2 diagnosa medis)</TableCell>
                  <TableCell>
                    <RadioGroup
                      defaultValue="0"
                      onValueChange={(v) =>
                        setScore("diagnosaSekunder", Number(v))
                      }
                      disabled={!editable}
                      className="flex gap-4"
                    >
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="15" /> Ya
                      </Label>
                      <Label className="flex items-center gap-2">
                        <RadioGroupItem value="0" /> Tidak
                      </Label>
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <div>Ya: 15</div>
                    <div>Tidak: 0</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input readOnly value={scores.diagnosaSekunder} className="text-center" />
                  </TableCell>
                </TableRow>
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Total Skor
                  </TableCell>
                  <TableCell>
                    <Input readOnly value={totalScore} className="text-center font-semibold" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Kategori Risiko
                  </TableCell>
                  <TableCell>
                    <Input
                      readOnly
                      value={kategori}
                      className="text-center font-semibold"
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {editable && (
            <div className="pt-3 border-t flex justify-end">
              <Button size="sm">
                <Save className="h-4 w-4 mr-1" />
                Simpan Asesmen
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
