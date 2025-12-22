"use client"

import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { EmrIgdAPI } from "@/lib/api" // Sesuaikan path
import LoadingSkeleton from "@/components/LoadingSkeleton" // Sesuaikan path

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Ambulance,
  User,
  Phone,
  Clock,
  Bed,
  Edit,
  ArrowLeft,
  Trash2,
  Check,
  X,
  InfoIcon,
  AlertCircle,
  Mars,
  Venus,
} from "lucide-react"
import { Label } from "@/components/ui/label"

export default function EmrIgdDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  /* =====================
     FETCH DATA API
  ===================== */
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ["emr-igd-detail", id],
    queryFn: () => EmrIgdAPI.getDetail(id as string),
    enabled: !!id,
  })

  const kunjungan = apiResponse?.data

  // Format Tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (isLoading) return <LoadingSkeleton lines={20} />

  if (isError || !kunjungan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-bold">Data Tidak Ditemukan</h3>
        <p className="text-muted-foreground mb-6">Gagal memuat detail registrasi IGD.</p>
        <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ================= MAIN ================= */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* ===== REGISTRATION ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-destructive" />
              Detail EMR IGD
            </CardTitle>
            <CardDescription>
              Informasi kunjungan dan registrasi pasien IGD
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Info label="No. Registrasi">
                <Badge variant="destructive">{kunjungan.no_reg}</Badge>
              </Info>

              <Info label="Tanggal & Waktu">
                <p>{formatDate(kunjungan.tgl_periksa)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {kunjungan.jam} WIB
                </p>
              </Info>

              <Info label="Unit Tujuan">{kunjungan.poli?.desk_poli || "-"}</Info>
              <Info label="Dokter">
                <Badge variant="info">
                  <User className="w-3 h-3 mr-1" />
                  {kunjungan.dokter?.karyawan?.nama}
                </Badge>
              </Info>
              <Info label="Cara Masuk">{kunjungan.cara_masuk?.desk_cara_masuk || "-"}</Info>
              <Info label="Tipe Pasien">
                <Badge variant="outline">{kunjungan.tipe_pasien?.desk_tipe_pasien || "-"}</Badge>
              </Info>
            </div>
          </CardContent>
        </Card>

        {/* ===== PATIENT ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Data Pasien
            </CardTitle>
            <CardDescription>
              Informasi identitas lengkap pasien
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Baris 1 */}
              <Info label="No. Rekam Medis">
                <Badge variant="default">{kunjungan.pasien?.norm || "-"}</Badge>
              </Info>
              <Info label="Nama Lengkap">
                <p className="uppercase font-bold">{kunjungan.pasien?.nama || "-"}</p>
              </Info>

              {/* Baris 2 */}
              <Info label="NIK">{kunjungan.pasien?.nik || "-"}</Info>
              <Info label="No. BPJS">{kunjungan.pasien?.no_bpjs || "Tidak Ada"}</Info>

              {/* Baris 3 */}
              <Info label="IHS Number (SatuSehat)">
                <Badge variant="outline" className="font-mono">{kunjungan.pasien?.ihs_number || "-"}</Badge>
              </Info>
              <Info label="Jenis Kelamin">
                {kunjungan.pasien?.sex === "L" ? (
                  <span className="flex items-center gap-2">
                    <Mars className="w-4 h-4 text-blue-500" /> Laki-laki
                  </span>
                ) : kunjungan.pasien?.sex === "P" ? (
                  <span className="flex items-center gap-2">
                    <Venus className="w-4 h-4 text-pink-500" /> Perempuan
                  </span>
                ) : (
                  "-"
                )}
              </Info>

              {/* Baris 4 */}
              <Info label="Tempat, Tanggal Lahir">
                {kunjungan.pasien?.tmp_lahir || "-"}, {formatDate(kunjungan.pasien?.tgl_lahir)}
              </Info>
              <Info label="No. HP">
                <a
                  href={`tel:${kunjungan.pasien?.hp}`}
                  className="text-green-600 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  {kunjungan.pasien?.hp || "-"}
                </a>
              </Info>

              {/* Baris 5 (Data Tambahan dari JSON) */}
              <Info label="Agama">{kunjungan.pasien?.agama?.desk_agama || "-"}</Info>
              <Info label="Status Pernikahan">{kunjungan.pasien?.status_menikah?.desk_sts_menikah || "-"}</Info>

              {/* Baris 6 */}
              <Info label="Pendidikan">{kunjungan.pasien?.pendidikan?.desk_pendidikan || "-"}</Info>
              <Info label="Pekerjaan">{kunjungan.pasien?.pekerjaan?.desk_pekerjaan || "-"}</Info>

              {/* Baris 7 - Alamat Full Width */}
              <Info label="Alamat KTP" className="md:col-span-2">
                <p className="text-sm leading-relaxed">
                  {kunjungan.pasien?.alamat_ktp || "-"}
                  {kunjungan.pasien?.kelurahan_ktp && `, Kel. ${kunjungan.pasien.kelurahan_ktp}`}
                </p>
              </Info>

              <Info label="Alamat Domisili" className="md:col-span-2">
                <p className="text-sm leading-relaxed">
                  {kunjungan.pasien?.alamat_domisili || "Sama dengan KTP"}
                </p>
              </Info>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* ===== ACTIONS ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi</CardTitle>
            <CardDescription>
              Tindakan lanjutan untuk pasien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* <Button className="w-full gap-2">
              <Bed className="w-4 h-4" />
              Transfer Rawat Inap
            </Button>

            <Button variant="outline" className="w-full gap-2">
              <Edit className="w-4 h-4" />
              Edit Registrasi
            </Button> */}

            <Button
              variant="secondary"
              className="w-full gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>

            <Separator />

            {/* <Button variant="destructive" className="w-full gap-2">
              <Trash2 className="w-4 h-4" />
              Hapus Registrasi
            </Button> */}
          </CardContent>
        </Card>

        {/* ===== SUMMARY ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pasien</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>

            <div>
              <p className="font-semibold uppercase">{kunjungan.pasien?.nama}</p>
              <p className="text-sm text-muted-foreground">
                {kunjungan.norm}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t pt-3 text-sm">
              <Summary label="BPJS" ok={!!kunjungan.pasien?.no_bpjs} />
              <Summary label="HP" ok={!!kunjungan.pasien?.hp} />
              <Summary label="Valid" ok />
            </div>
          </CardContent>
        </Card>

        {/* ===== INFO ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              Informasi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Registrasi IGD bersifat urgent</p>
            <p>• Data dapat diubah sebelum pasien dipanggil</p>
            <p>• Pastikan kontak darurat tersedia</p>
            <p>• Simpan nomor registrasi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* =====================
   Helpers
===================== */
function Info({
  label,
  children,
  className = "flex flex-col space-y-1",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="font-medium">{children}</div>
    </div>
  )
}

function Summary({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      {ok ? (
        <Check className="mx-auto text-green-500 w-4 h-4" />
      ) : (
        <X className="mx-auto text-red-500 w-4 h-4" />
      )}
    </div>
  )
}