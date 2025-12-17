"use client";

import AsesmenRisikoJatuh from "./AsesmenRisikoJatuh";
import DiagnosisKeperawatan from "./DiagnosisKeperawatan";
import FaktorSosioKulturalSpiritual from "./FaktorSosioKulturalSpiritual";
import RiwayatPenyakitSekarang from "./RiwayatPenyakitSekarang";
import SkriningGizi from "./SkriningGizi";
import StatusFungsional from "./StatusFungsional";

interface Props {
  editable?: boolean;
}

export default function AsesmenPerawat({ editable = false }: Props) {
  return (
    <div className="space-y-4">
      <DiagnosisKeperawatan editable={editable} />
      <FaktorSosioKulturalSpiritual editable={editable} />
      <AsesmenRisikoJatuh editable={editable} />
      <RiwayatPenyakitSekarang editable={editable} />
      <SkriningGizi editable={editable} />
      <StatusFungsional editable={editable} />
    </div>
  );
}
