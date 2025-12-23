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
import { AsesmentMedicAPI, AsesmentTriageAPI } from "@/lib/api";

// Sub-components Medis
import Alergi from "./asement-medic/Alergi";
import Anamnesa from "./asement-medic/Anamnesa";
import Diagnosis from "./asement-medic/Diagnosis";
import EdukasiDischarge from "./asement-medic/EdukasiDischarge";
import FlaccPainAssessment from "./asement-medic/FlaccPainAssessment";
import KeadaanUmum from "./asement-medic/KeadaanUmum";
import Kesadaran from "./asement-medic/Kesadaran";
import NumericPainScale from "./asement-medic/NumericPainScale";
import PemeriksaanPenunjang from "./asement-medic/PemeriksaanPenunjang";
import PhysicalExam from "./asement-medic/PhysicalExam";
import StatusPsikologis from "./asement-medic/StatusPsikologis";
import RencanaTindakLanjut from "./asement-medic/RencanaTindakLanjut";
import SkriningNyeri from "./asement-medic/SkriningNyeri";
import TindakanTerapi from "./asement-medic/TindakanTerapi";
import TandaVital from "./asement-medic/TandaVital";
import WongBakerScale from "./asement-medic/WongBakerScale";

// Sub-komponen Perawat
import AsesmenRisikoJatuh from "./asement-perawat/AsesmenRisikoJatuh";
import DiagnosisKeperawatan from "./asement-perawat/DiagnosisKeperawatan";
import FaktorSosioKulturalSpiritual from "./asement-perawat/FaktorSosioKulturalSpiritual";
import RiwayatPenyakitSekarang from "./asement-perawat/RiwayatPenyakitSekarang";
import SkriningGizi from "./asement-perawat/SkriningGizi";
import StatusFungsional from "./asement-perawat/StatusFungsional";

// Import komponen table untuk Tab Triase
import TriageAssessmentTable from "./asesment-tringe/triage";

// Tab components lainnya
import KondisiMeninggalkanIGD from "./asement-medic/KondisiMeniggalkanIgd";
import Prescription from "./asement-medic/ResepObat";
import OrderRadiologi from "@/components/orderRadiologi";
import OrderLab from "@/components/orderLab";

export default function Asesment() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeAsesmenTab") || "medis";
    }
    return "medis";
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataAsesmen, setDataAsesmen] = useState<any>(null);

  // State untuk menyimpan data Triage lama (old values)
  const [dataTriage, setDataTriage] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("activeAsesmenTab", activeTab);
  }, [activeTab]);

  // 1. Fetch data saat halaman dimuat
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        if (activeTab === "triase") {
          // Hanya hit API Triage jika tab triase aktif
          const resTriage = await AsesmentTriageAPI.getList(id);
          if (resTriage?.data?.penilaian_triage) {
            setDataTriage(resTriage.data.penilaian_triage);
          }
        } else {
          // Hit API Medis jika tab Medis atau Perawat aktif 
          // (Asumsi: Data Perawat & Medis berada di endpoint yang sama)
          const resMedis = await AsesmentMedicAPI.getAsesment(id);
          setDataAsesmen(resMedis.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data asesmen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, activeTab]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="mt-4 shadow-sm border-slate-200">
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-slate-800">
            Asesmen Awal Pasien Gawat Darurat Terintegrasi
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            No. RM: {dataAsesmen?.norm || dataTriage?.no_rm || "-"} | No. REG: {dataAsesmen?.no_reg || dataTriage?.no_kunjungan || "-"}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {!editMode ? (
            <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="bg-white">
              <Pencil className="w-4 h-4 mr-1" />
              Mode Edit
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={() => setEditMode(false)}>
              <X className="w-4 h-4 mr-1" />
              Batal Edit
            </Button>
          )}

          <Button size="sm" variant="secondary" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" />
            Cetak Asesmen
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Info Bar */}
        {/* <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-3">
          <div className="flex gap-6 text-sm">
            <span className="text-slate-600">
              <span className="font-semibold">Dokter Jaga:</span> {dataAsesmen?.dokter_jaga || dataTriage?.petugas_triage || "-"}
            </span>
            <span className="text-slate-600">
              <span className="font-semibold">Poli:</span> {dataAsesmen?.poli || "IGD"}
            </span>
          </div>
          <Badge variant={dataAsesmen?.status === "draft" ? "outline" : "default"} className="px-3">
            {dataAsesmen?.status?.toUpperCase() || "NEW"}
          </Badge>
        </div> */}

        {/* Tabs Utama */}
        <Tabs value={activeTab}
          onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
            <TabsTrigger value="triase" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Triase</TabsTrigger>
            <TabsTrigger value="medis" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Medis</TabsTrigger>
            <TabsTrigger value="perawat" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Perawat</TabsTrigger>
          </TabsList>
          {/* TAB TRIASE */}
          <TabsContent value="triase" className="pt-4">
            <TriageAssessmentTable
              editable={editMode}
              initialData={dataTriage}
            />
          </TabsContent>

          {/* TAB MEDIS */}
          <TabsContent value="medis" className="pt-4 space-y-4">
            <Accordion type="multiple" className="w-full space-y-4">
              <Anamnesa editable={editMode} initialData={dataAsesmen?.anamnesa} />
              <Alergi editable={editMode} initialData={dataAsesmen?.status_alergi} />
              <StatusPsikologis editable={editMode} initialData={dataAsesmen?.status_psikologis} />
              <KeadaanUmum editable={editMode} initialData={dataAsesmen?.keadaan_umum} />
              <Kesadaran editable={editMode} initialData={dataAsesmen?.kesadaran} />
              <TandaVital editable={editMode} initialData={dataAsesmen?.vital_signs} />
              <SkriningNyeri editable={editMode} initialData={dataAsesmen?.skrining_nyeri} />
              <NumericPainScale editable={editMode} initialData={dataAsesmen?.skrining_nyeri} />
              <WongBakerScale editable={editMode} initialData={dataAsesmen?.skrining_nyeri} />
              <FlaccPainAssessment editable={editMode} initialData={dataAsesmen?.skrining_nyeri} />
              <PhysicalExam editable={editMode} initialData={dataAsesmen?.pemeriksaan_fisik} />
              <PemeriksaanPenunjang editable={editMode} initialData={dataAsesmen?.pemeriksaan_penunjang} />
              
              <Diagnosis editable={editMode} initialData={dataAsesmen?.diagnosis} />
              <Prescription editable={editMode} initialData={dataAsesmen?.reseps} />
              <TindakanTerapi editable={editMode} initialData={dataAsesmen?.perencanaan_tindakan} />
              <RencanaTindakLanjut editable={editMode} initialData={dataAsesmen?.rencana_tindak_lanjut} />
              <KondisiMeninggalkanIGD editable={editMode} initialData={dataAsesmen?.kondisi_keluar_igd} />
              <EdukasiDischarge editable={editMode} initialData={dataAsesmen?.edukasi_discharge} />
            </Accordion>
          </TabsContent>

          {/* TAB PERAWAT */}
          <TabsContent value="perawat" className="pt-4 space-y-4">
            <Accordion type="multiple" className="w-full space-y-4">
              <DiagnosisKeperawatan editable={editMode} />
              <FaktorSosioKulturalSpiritual editable={editMode} />
              <AsesmenRisikoJatuh editable={editMode} />
              <RiwayatPenyakitSekarang editable={editMode} />
              <SkriningGizi editable={editMode} />
              <StatusFungsional editable={editMode} />
            </Accordion>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}