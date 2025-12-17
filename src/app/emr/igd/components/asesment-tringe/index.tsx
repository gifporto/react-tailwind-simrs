"use client";

import TriageAssessmentTable from "./triage";

interface Props {
  editable?: boolean;
}

export default function AsesmenPerawat({ editable = false }: Props) {
  return (
    <div className="space-y-4">
      <TriageAssessmentTable/>
    </div>
  );
}
