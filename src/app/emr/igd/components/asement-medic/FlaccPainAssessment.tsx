"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Baby,
  Smile,
  Activity,
  Volume2,
  HelpingHand,
  Calculator,
  Info,
} from "lucide-react";

interface Props {
  editable?: boolean;
}

type Score = "0" | "1" | "2";

const SECTIONS = [
  {
    key: "face",
    label: "Face (Wajah)",
    icon: Smile,
    options: [
      { value: "0", text: "Ekspresi normal" },
      { value: "1", text: "Meringis sesekali" },
      { value: "2", text: "Meringis terus" },
    ],
  },
  {
    key: "legs",
    label: "Legs (Kaki)",
    icon: Activity,
    options: [
      { value: "0", text: "Santai / posisi normal" },
      { value: "1", text: "Gelisah / tegang" },
      { value: "2", text: "Menendang / kaki ditarik" },
    ],
  },
  {
    key: "activity",
    label: "Activity",
    icon: Baby,
    options: [
      { value: "0", text: "Tenang / nyaman" },
      { value: "1", text: "Menggeliat / tegang" },
      { value: "2", text: "Kaku / menyentak" },
    ],
  },
  {
    key: "cry",
    label: "Cry (Tangisan)",
    icon: Volume2,
    options: [
      { value: "0", text: "Tidak menangis" },
      { value: "1", text: "Merengek" },
      { value: "2", text: "Menangis keras" },
    ],
  },
  {
    key: "consolability",
    label: "Consolability",
    icon: HelpingHand,
    options: [
      { value: "0", text: "Mudah dihibur" },
      { value: "1", text: "Sulit dialihkan" },
      { value: "2", text: "Tidak dapat dihibur" },
    ],
  },
];

export default function FlaccPainAssessment({ editable = false }: Props) {
  const [scores, setScores] = useState<Record<string, Score>>({
    face: "0",
    legs: "0",
    activity: "0",
    cry: "0",
    consolability: "0",
  });

  const totalScore = useMemo(
    () => Object.values(scores).reduce((a, b) => a + Number(b), 0),
    [scores]
  );

  const interpretation = useMemo(() => {
    if (totalScore <= 3) return "Nyeri ringan";
    if (totalScore <= 6) return "Nyeri sedang";
    return "Nyeri berat";
  }, [totalScore]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="flacc" className="border rounded-md">
        <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            FLACC Behavioral Pain Scale
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 space-y-4">
          {/* info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Digunakan untuk bayi & anak usia 2 bulan – 7 tahun
            </AlertDescription>
          </Alert>

          {/* sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.key} className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">
                      {section.label}
                    </span>
                  </div>

                  <RadioGroup
                    value={scores[section.key]}
                    onValueChange={(val: Score) =>
                      setScores((prev) => ({
                        ...prev,
                        [section.key]: val,
                      }))
                    }
                    className="space-y-2"
                    disabled={!editable}
                  >
                    {section.options.map((opt) => (
                      <div
                        key={opt.value}
                        className="flex items-center gap-2 border rounded p-2"
                      >
                        <RadioGroupItem
                          value={opt.value}
                          id={`${section.key}-${opt.value}`}
                        />
                        <Label
                          htmlFor={`${section.key}-${opt.value}`}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Badge variant="secondary">{opt.value}</Badge>
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              );
            })}
          </div>

          {/* total */}
          <Card className="bg-primary/20">
            <div className="py-4 text-center space-y-1">
              <div className="flex justify-center items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  Total FLACC Score
                </span>
              </div>
              <div className="text-4xl font-bold">{totalScore}</div>
              <Badge variant="secondary">{interpretation}</Badge>
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
