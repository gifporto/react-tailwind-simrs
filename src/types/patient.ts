// src/types/patient.ts
export interface Patient {
  id: number
  norm: string | null
  name: string
  nik: string | null
  bpjs_number: string | null
  gender: "L" | "P" | null
  birth_date: string | null
  age: number | null
  phones: string[]
}
