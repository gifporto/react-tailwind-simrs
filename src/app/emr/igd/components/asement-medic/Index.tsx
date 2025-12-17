"use client";

import { Accordion } from "@/components/ui/accordion";
import Alergi from "./Alergi";
import Anamnesa from "./Anamnesa";
import AssessmentKeluar from "./AssessmentKeluar";
import Diagnosis from "./Diagnosis";
import EdukasiDischarge from "./EdukasiDischarge";
import FlaccPainAssessment from "./FlaccPainAssessment";
import KeadaanUmum from "./KeadaanUmum";
import Kesadaran from "./Kesadaran";
import NumericPainScale from "./NumericPainScale";
import PemeriksaanPenunjang from "./PemeriksaanPenunjang";
import PhysicalExam from "./PhysicalExam";
import { Prescription } from "./Prescription";
import StatusPsikologis from "./StatusPsikologis";
import RencanaTindakLanjut from "./RencanaTindakLanjut";
import SkriningNyeri from "./SkriningNyeri";
import TindakanTerapi from "./TindakanTerapi";
import TandaVital from "./TandaVital";
import WongBakerScale from "./WongBakerScale";

interface Props {
  editable?: boolean;
}

export default function AsesmenMedic({ editable = false }: Props) {
  return (
    <div className="space-y-4">
      <Accordion type="multiple">
        <Anamnesa editable={editable} />
        <Alergi editable={editable} />
        <StatusPsikologis />
        <KeadaanUmum editable={editable} />
        <Kesadaran editable={editable} />
        <TandaVital editable={editable} />
        <SkriningNyeri editable={editable} />
        <NumericPainScale editable={editable} />
        <WongBakerScale editable={editable} />
        <FlaccPainAssessment editable={editable} />
        <PhysicalExam />
        <EdukasiDischarge editable={editable} />
        <PemeriksaanPenunjang editable={editable} />
        <Diagnosis />
        <Prescription />
        <TindakanTerapi editable={editable} />
        <RencanaTindakLanjut editable={editable} />
        <AssessmentKeluar editable={editable} />

      </Accordion>
    </div>
  );
}
