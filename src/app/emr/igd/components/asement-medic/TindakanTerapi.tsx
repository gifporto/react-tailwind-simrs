"use client";

import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Syringe, Info, HeartPulse, Clock, UserRound, Save } from "lucide-react";

interface Props {
  editable?: boolean;
}

export default function TindakanTerapi({ editable = false }: Props) {
  return (
    <AccordionItem value="tindakanTerapi" className="border rounded-md mb-2">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">16</Badge>
          <Syringe className="w-4 h-4 text-primary" />
          Tindakan & Terapi di IGD
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Dokumentasikan semua tindakan medis dan terapi yang telah diberikan di IGD
          </AlertDescription>
        </Alert>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary text-primary-foreground py-2 px-4 flex-row items-center gap-2 space-y-0">
            <HeartPulse className="w-4 h-4" />
            <span className="text-sm font-semibold">Tindakan Medis & Terapi</span>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <Label htmlFor="TindakanIGDNotes" className="font-bold">Detail Tindakan:</Label>
            <Textarea
              id="TindakanIGDNotes"
              disabled={!editable}
              placeholder="Dokumentasikan tindakan dan terapi (Resusitasi, Infus, Oksigen, Obat Emergency, dll)"
              rows={8}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-emerald-200">
            <CardHeader className="bg-emerald-600 text-white py-2 px-4 flex-row items-center gap-2 space-y-0">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Waktu Tindakan</span>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <Label>Mulai:</Label>
                <Input type="time" disabled={!editable} />
              </div>
              <div className="space-y-1">
                <Label>Selesai:</Label>
                <Input type="time" disabled={!editable} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader className="bg-sky-600 text-white py-2 px-4 flex-row items-center gap-2 space-y-0">
              <UserRound className="w-4 h-4" />
              <span className="text-sm font-semibold">Petugas</span>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <Label>Dokter:</Label>
                <Input placeholder="Nama dokter" disabled={!editable} />
              </div>
              <div className="space-y-1">
                <Label>Perawat:</Label>
                <Input placeholder="Nama perawat" disabled={!editable} />
              </div>
            </CardContent>
          </Card>
        </div>

        {editable && (
          <div className="flex justify-end pt-3 border-t">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> Simpan Tindakan IGD
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}