"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Printer, Pencil, Save, X } from "lucide-react";

// tab components
import AsesmenMedic from "./asement-medic/Index";
import AsesmenPerawat from "./asement-perawat/Index";
import AsesmenTriase from "./asesment-tringe/index";

export default function Asesment() {
  const [editMode, setEditMode] = useState(false);

  return (
    <Card className="mt-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            Asesmen Awal Pasien Gawat Darurat Terintegrasi
          </CardTitle>
          <CardDescription>
            Lengkapi data asesmen medis, perawat, dan triase
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {!editMode ? (
            <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={() => setEditMode(false)}>
                <Save className="w-4 h-4 mr-1" />
                Simpan
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditMode(false)}
              >
                <X className="w-4 h-4 mr-1" />
                Batal
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-1" />
            Cetak
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* info bar */}
        <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            Pilih tab untuk melengkapi asesmen
          </span>
          <Badge variant="secondary">Tersimpan</Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="medis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medis">Medis</TabsTrigger>
            <TabsTrigger value="perawat">Perawat</TabsTrigger>
            <TabsTrigger value="triase">Triase</TabsTrigger>
          </TabsList>

          <TabsContent value="medis" className="pt-4">
            <AsesmenMedic editable={editMode} />
          </TabsContent>

          <TabsContent value="perawat" className="pt-4">
            <AsesmenPerawat editable={editMode} />
          </TabsContent>

          <TabsContent value="triase" className="pt-4">
            <AsesmenTriase editable={editMode} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
