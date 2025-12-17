"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  ClipboardList,
  Save,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const Diagnosis: React.FC = () => {
  return (
    <AccordionItem value="diagnosis" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <Badge variant="outline">14</Badge>
          Diagnosis
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4">

          {/* Alert */}
          <div className="flex gap-2 rounded-md border border-muted bg-muted/30 p-3 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <span className="font-medium">Penting!</span>{" "}
              Tentukan diagnosis kerja dan diagnosis banding dengan tepat.
            </div>
          </div>

          {/* Diagnosis Kerja */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Diagnosis Kerja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                rows={5}
                placeholder={`Tuliskan diagnosis kerja beserta kode ICD-10:

Contoh:
1. I21.0 - Acute myocardial infarction
2. E11.9 - Type 2 diabetes mellitus

Diagnosis Banding:
- Unstable angina
- Acute coronary syndrome`}
              />
              <p className="text-xs text-muted-foreground">
                Gunakan kode ICD-10 untuk diagnosis utama dan tambahan
              </p>
            </CardContent>
          </Card>

          {/* Utama & Sekunder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Diagnosis Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="ICD-10 Code" />
                <Textarea
                  rows={2}
                  placeholder="Deskripsi diagnosis utama"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Diagnosis Sekunder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="ICD-10 Code (opsional)" />
                <Textarea
                  rows={2}
                  placeholder="Diagnosis penyerta / komplikasi"
                />
              </CardContent>
            </Card>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-2 border-t">
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Simpan Diagnosis
            </Button>
          </div>

        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default Diagnosis
