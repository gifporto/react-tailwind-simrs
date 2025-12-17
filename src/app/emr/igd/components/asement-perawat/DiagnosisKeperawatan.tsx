"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Stethoscope } from "lucide-react";

interface Props {
  editable?: boolean;
}

interface DiagnosisItem {
  id: number;
  code: string;
  title: string;
  description: string;
  related?: string[];
  evidence?: string[];
  riskFactors?: string[];
  interventions?: string[];
  collaborations?: string[];
}

const DIAGNOSIS: DiagnosisItem[] = [
  {
    id: 1,
    code: "D.0019",
    title: "Defisit Nutrisi",
    description: "Asupan nutrisi tidak cukup untuk memenuhi kebutuhan",
    related: [
      "Ketidakmampuan menelan makanan",
      "Ketidakmampuan mencerna makanan",
      "Ketidakmampuan mengabsorpsi nutrien",
      "Peningkatan kebutuhan metabolisme",
      "Faktor ekonomi",
      "Faktor psikologis",
    ],
    evidence: [
      "Berat badan menurun",
      "Cepat kenyang",
      "Nafsu makan menurun",
      "Otot pengunyahan lemah",
      "Membran mukosa pucat",
      "Serum albumin turun",
      "Diare",
    ],
    interventions: [
      "Identifikasi status nutrisi",
      "Monitor asupan makanan",
    ],
    collaborations: ["Kolaborasi dengan ahli gizi"],
  },
  {
    id: 13,
    code: "D.0077",
    title: "Nyeri Akut",
    description:
      "Pengalaman sensorik atau emosional akibat kerusakan jaringan dengan durasi < 3 bulan",
    related: [
      "Agen pencederaan fisiologis",
      "Agen pencederaan kimiawi",
      "Agen pencederaan fisik",
    ],
    evidence: [
      "Mengeluh nyeri",
      "Tampak meringis",
      "Bersikap protektif",
      "Gelisah",
      "Frekuensi nadi meningkat",
      "Tekanan darah meningkat",
      "Diaforesis",
    ],
    interventions: [
      "Identifikasi lokasi nyeri",
      "Berikan teknik nonfarmakologis",
    ],
    collaborations: ["Kolaborasi pemberian analgetik"],
  },
  {
    id: 18,
    code: "D.0142",
    title: "Risiko Infeksi",
    description: "Berisiko mengalami peningkatan terserang organisme patogenik",
    riskFactors: [
      "Penyakit kronis",
      "Efek prosedur invasif",
      "Malnutrisi",
      "Peningkatan paparan organisme",
    ],
    interventions: [
      "Monitor tanda dan gejala infeksi",
      "Ajarkan cara mencuci tangan",
    ],
    collaborations: ["Kolaborasi pemberian antibiotik"],
  },
  {
    id: 25,
    code: "D.0095",
    title: "Pola Nafas Tidak Efektif",
    description:
      "Inspirasi dan/atau ekspirasi yang tidak memberikan ventilasi adekuat",
    riskFactors: [
      "Depresi pusat pernapasan",
      "Hambatan upaya napas",
      "Gangguan neuromuskuler",
      "Penurunan energi",
      "Obesitas",
      "Efek agen farmakologis",
    ],
    interventions: [
      "Monitor pola napas",
      "Ajarkan teknik batuk efektif",
    ],
    collaborations: ["Kolaborasi pemberian bronkodilator"],
  },
  {
    id: 33,
    code: "D.0023",
    title: "Hipovolemia",
    description:
      "Penurunan volume cairan intravaskuler, interstisial, dan intraseluler",
    related: [
      "Kehilangan cairan aktif",
      "Kegagalan mekanisme regulasi",
      "Peningkatan permeabilitas kapiler",
      "Kekurangan intake cairan",
      "Evaporasi",
    ],
    interventions: ["Monitor intake dan output cairan"],
    collaborations: ["Kolaborasi pemberian cairan IV"],
  },
];

export default function DiagnosisKeperawatan({ editable = false }: Props) {
  const [activeDiagnosis, setActiveDiagnosis] = useState<number[]>([]);

  const toggleDiagnosis = (id: number) => {
    setActiveDiagnosis((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const isActive = (id: number) => activeDiagnosis.includes(id);

  return (
    <Accordion type="single">
      <AccordionItem value="diagnosis-keperawatan" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">6B</Badge>
            Diagnosis Keperawatan (Perawat)
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-3">
          {DIAGNOSIS.map((item) => (
            <Accordion key={item.id} type="single">
              <AccordionItem
                value={String(item.id)}
                className="border rounded-md"
              >
                <AccordionTrigger className="px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isActive(item.id)}
                      onCheckedChange={() => toggleDiagnosis(item.id)}
                      disabled={!editable}
                    />
                    <span className="font-medium">
                      {item.title} ({item.code})
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Pengertian:</strong> {item.description}
                  </p>

                  {item.related && (
                    <Section
                      title="Berhubungan Dengan"
                      items={item.related}
                      disabled={!isActive(item.id)}
                    />
                  )}

                  {item.evidence && (
                    <Section
                      title="Dibuktikan Dengan"
                      items={item.evidence}
                      disabled={!isActive(item.id)}
                    />
                  )}

                  {item.riskFactors && (
                    <Section
                      title="Faktor Risiko"
                      items={item.riskFactors}
                      disabled={!isActive(item.id)}
                    />
                  )}

                  {item.interventions && (
                    <Section
                      title="Intervensi"
                      items={item.interventions}
                      disabled={!isActive(item.id)}
                    />
                  )}

                  {item.collaborations && (
                    <Section
                      title="Kolaborasi"
                      items={item.collaborations}
                      disabled={!isActive(item.id)}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

          {editable && (
            <div className="pt-3 border-t flex justify-end">
              <Button size="sm">
                <Save className="h-4 w-4 mr-1" />
                Simpan Diagnosis Keperawatan
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Section({
  title,
  items,
  disabled,
}: {
  title: string;
  items: string[];
  disabled: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="font-semibold text-sm">{title}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {items.map((item, i) => (
          <Label
            key={i}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox disabled={disabled} />
            {item}
          </Label>
        ))}
      </div>
    </div>
  );
}
