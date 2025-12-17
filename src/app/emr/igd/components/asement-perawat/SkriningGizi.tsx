"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function SkriningGizi({ editable = false }: Props) {
  const [bb, setBb] = useState<number | "">("");
  const [tb, setTb] = useState<number | "">("");

  const [mst1, setMst1] = useState<number>(2);
  const [mst2, setMst2] = useState<number>(1);

  const bmi = useMemo(() => {
    if (!bb || !tb) return "";
    const m = Number(tb) / 100;
    return (Number(bb) / (m * m)).toFixed(1);
  }, [bb, tb]);

  const kategoriBmi = useMemo(() => {
    if (!bmi) return "";
    const v = Number(bmi);
    if (v < 18.5) return "Kurus";
    if (v < 25) return "Normal";
    if (v < 30) return "Gemuk";
    return "Obesitas";
  }, [bmi]);

  const totalMst = mst1 + mst2;
  const kategoriMst =
    totalMst <= 1
      ? "Risiko Rendah"
      : totalMst === 2
      ? "Risiko Sedang"
      : "Risiko Tinggi";

  return (
    <Accordion type="single">
      <AccordionItem value="skrining-gizi" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            Skrining Gizi
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-6">
          {/* BB / TB / BMI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label>Berat Badan (kg)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={bb}
                onChange={(e) =>
                  setBb(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={!editable}
              />
            </div>

            <div className="space-y-1">
              <Label>Tinggi Badan (cm)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={tb}
                onChange={(e) =>
                  setTb(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={!editable}
              />
            </div>

            <div className="space-y-1">
              <Label>BMI</Label>
              <Input readOnly value={bmi} />
            </div>

            <div className="space-y-1">
              <Label>Kategori BMI</Label>
              <Input readOnly value={kategoriBmi} />
            </div>
          </div>

          {/* MST */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">
              MST (Malnutrition Screening Tool)
            </h4>

            {/* ================= MST 1 ================= */}
            <Card className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    1. Penurunan Berat Badan (6 bulan terakhir)
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Apakah pasien mengalami penurunan BB yang tidak diinginkan?
                  </p>

                  <RadioGroup
                    value={String(mst1)}
                    onValueChange={(v) => setMst1(Number(v))}
                    disabled={!editable}
                    className="space-y-2"
                  >
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="0" />
                      Tidak ada penurunan berat badan
                    </Label>
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="2" />
                      Tidak yakin / baju terasa longgar
                    </Label>
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="1" />
                      Ya, 1–5 kg
                    </Label>
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="2" />
                      Ya, 6–10 kg
                    </Label>
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="3" />
                      Ya, 11–15 kg
                    </Label>
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="4" />
                      Ya, &gt;15 kg
                    </Label>
                  </RadioGroup>
                </div>

                <div className="text-center min-w-[80px]">
                  <div className="text-xs text-muted-foreground">Skor</div>
                  <div className="text-lg font-semibold">{mst1}</div>
                </div>
              </div>
            </Card>

            {/* ================= MST 2 ================= */}
            <Card className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold">
                    2. Asupan Makanan
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Apakah asupan makanan berkurang karena penurunan nafsu makan /
                    kesulitan menerima makanan?
                  </p>

                  <RadioGroup
                    value={String(mst2)}
                    onValueChange={(v) => setMst2(Number(v))}
                    disabled={!editable}
                    className="space-y-2"
                  >
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="0" />
                      Tidak
                    </Label>
                    <Label className="flex items-center gap-2">
                      <RadioGroupItem value="1" />
                      Ya
                    </Label>
                  </RadioGroup>
                </div>

                <div className="text-center min-w-[80px]">
                  <div className="text-xs text-muted-foreground">Skor</div>
                  <div className="text-lg font-semibold">{mst2}</div>
                </div>
              </div>
            </Card>

            {/* ================= TOTAL ================= */}
            <Card className="p-4 flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm font-semibold">Total Skor MST</div>
                <div className="text-sm text-muted-foreground">
                  Kategori Risiko: <strong>{kategoriMst}</strong>
                </div>
              </div>
              <div className="text-2xl font-bold">{totalMst}</div>
            </Card>
          </div>

          {editable && (
            <div className="pt-3 border-t flex justify-end">
              <Button size="sm">
                <Save className="h-4 w-4 mr-1" />
                Simpan Skrining Gizi
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
