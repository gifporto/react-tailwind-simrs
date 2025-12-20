"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Printer, Pencil, Save, X, Loader2 } from "lucide-react";

// API
import { AsesmentMedicAPI } from "@/lib/api";

// Sub-components Medis
import Alergi from "./asement-medic/Alergi";
import Anamnesa from "./asement-medic/Anamnesa";
import AssessmentKeluar from "./asement-medic/AssessmentKeluar";
import Diagnosis from "./asement-medic/Diagnosis";
import EdukasiDischarge from "./asement-medic/EdukasiDischarge";
import FlaccPainAssessment from "./asement-medic/FlaccPainAssessment";
import KeadaanUmum from "./asement-medic/KeadaanUmum";
import Kesadaran from "./asement-medic/Kesadaran";
import NumericPainScale from "./asement-medic/NumericPainScale";
import PemeriksaanPenunjang from "./asement-medic/PemeriksaanPenunjang";
import PhysicalExam from "./asement-medic/PhysicalExam";
import { Prescription } from "./asement-medic/Prescription";
import StatusPsikologis from "./asement-medic/StatusPsikologis";
import RencanaTindakLanjut from "./asement-medic/RencanaTindakLanjut";
import SkriningNyeri from "./asement-medic/SkriningNyeri";
import TindakanTerapi from "./asement-medic/TindakanTerapi";
import TandaVital from "./asement-medic/TandaVital";
import WongBakerScale from "./asement-medic/WongBakerScale";

// Tab components lainnya
import AsesmenPerawat from "./asement-perawat/Index";
import AsesmenTriase from "./asesment-tringe/index";

export default function Asesment() {
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataAsesmen, setDataAsesmen] = useState<any>(null);

  // 1. Fetch data saat halaman dimuat
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await AsesmentMedicAPI.getAsesment(id);
        setDataAsesmen(response.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="mt-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            Asesmen Awal Pasien Gawat Darurat Terintegrasi
          </CardTitle>
          <CardDescription>
            No. RM: {dataAsesmen?.norm} | No. REG: {dataAsesmen?.no_reg}
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
              <Button size="sm" variant="ghost" onClick={() => setEditMode(false)}>
                <X className="w-4 h-4 mr-1" />
                Batal
              </Button>
            </>
          )}

          <Button size="sm" variant="ghost" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" />
            Cetak
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info Bar */}
        <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-2">
          <span className="text-sm text-muted-foreground capitalize">
            Dokter Jaga: {dataAsesmen?.dokter_jaga || "-"}
          </span>
          <Badge variant={dataAsesmen?.status === "draft" ? "outline" : "default"}>
            {dataAsesmen?.status || "Draft"}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="medis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medis">Medis</TabsTrigger>
            <TabsTrigger value="perawat">Perawat</TabsTrigger>
            <TabsTrigger value="triase">Triase</TabsTrigger>
          </TabsList>

          <TabsContent value="medis" className="pt-4 space-y-4">
            <Accordion type="multiple" className="w-full space-y-4">
              {/* Distribusi data spesifik ke masing-masing Child */}
              <Anamnesa
                editable={editMode}
                initialData={dataAsesmen?.anamnesa}
              />

              <Alergi
                editable={editMode}
                initialData={dataAsesmen?.status_alergi}
              />

              <StatusPsikologis
                editable={editMode}
                initialData={dataAsesmen?.status_psikologis}
              />

              <KeadaanUmum
                editable={editMode}
                initialData={dataAsesmen?.keadaan_umum}
              />

              <Kesadaran
                editable={editMode}
                initialData={dataAsesmen?.kesadaran}
              />

              <TandaVital
                editable={editMode}
                initialData={dataAsesmen?.vital_signs}
              />

              <SkriningNyeri
                editable={editMode}
                initialData={dataAsesmen?.skrining_nyeri}
              />
              <NumericPainScale
                editable={editMode}
                initialData={dataAsesmen?.skrining_nyeri}
              />
              <WongBakerScale
                editable={editMode}
                initialData={dataAsesmen?.skrining_nyeri}
              />
              <FlaccPainAssessment
                editable={editMode}
                initialData={dataAsesmen?.skrining_nyeri}
              />

              <PhysicalExam initialData={dataAsesmen?.pemeriksaan_fisik} />

              <EdukasiDischarge
                editable={editMode}
                initialData={dataAsesmen?.edukasi_discharge}
              />

              <PemeriksaanPenunjang
                editable={editMode}
                initialData={dataAsesmen?.pemeriksaan_penunjang}
              />

              <Diagnosis initialData={dataAsesmen?.diagnosis} />
              <Prescription />

              <TindakanTerapi
                editable={editMode}
                initialData={dataAsesmen?.perencanaan_tindakan}
              />

              <RencanaTindakLanjut
                editable={editMode}
                initialData={dataAsesmen?.rencana_tindak_lanjut}
              />

              <AssessmentKeluar
                editable={editMode}
                initialData={dataAsesmen?.kondisi_keluar_igd}
              />
            </Accordion>
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