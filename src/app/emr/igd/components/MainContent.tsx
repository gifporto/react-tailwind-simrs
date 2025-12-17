"use client"

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
} from "lucide-react"

/* =====================
   Dummy Data
===================== */
const kunjungan = {
  no_reg: "REG-001",
  tgl_periksa: "16 Desember 2025",
  jam: "09:30",
  poli: "IGD",
  dokter: "dr. Andi Wijaya",
  caraMasuk: "Datang Sendiri",
  tipePasien: "Umum",
  norm: "RM-123456",
  pasien: {
    nama: "Budi Santoso",
    nik: "317xxxxxxxxx",
    no_bpjs: "000111222333",
    sex: "L",
    tmp_lahir: "Jakarta",
    tgl_lahir: "20 Mei 1990",
    hp: "08123456789",
    alamat: "Jakarta Timur",
  },
}

export default function MainContent() {
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
                <p>{kunjungan.tgl_periksa}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {kunjungan.jam} WIB
                </p>
              </Info>

              <Info label="Unit Tujuan">{kunjungan.poli}</Info>
              <Info label="Dokter">{kunjungan.dokter}</Info>
              <Info label="Cara Masuk">{kunjungan.caraMasuk}</Info>
              <Info label="Tipe Pasien">
                <Badge variant="outline">{kunjungan.tipePasien}</Badge>
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
              Informasi identitas pasien
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Info label="No. Rekam Medis">
                <Badge variant="secondary">{kunjungan.norm}</Badge>
              </Info>
              <Info label="Nama">{kunjungan.pasien.nama}</Info>
              <Info label="NIK">{kunjungan.pasien.nik}</Info>
              <Info label="BPJS">
                {kunjungan.pasien.no_bpjs || "Tidak ada"}
              </Info>
              <Info label="TTL">
                {kunjungan.pasien.tmp_lahir},{" "}
                {kunjungan.pasien.tgl_lahir}
              </Info>
              <Info label="No. HP">
                <a
                  href={`tel:${kunjungan.pasien.hp}`}
                  className="text-primary underline flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  {kunjungan.pasien.hp}
                </a>
              </Info>
              <Info label="Alamat" className="md:col-span-2">
                {kunjungan.pasien.alamat}
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
            <Button className="w-full gap-2">
              <Bed className="w-4 h-4" />
              Transfer Rawat Inap
            </Button>

            <Button variant="outline" className="w-full gap-2">
              <Edit className="w-4 h-4" />
              Edit Registrasi
            </Button>

            <Button variant="secondary" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>

            <Separator />

            <Button variant="destructive" className="w-full gap-2">
              <Trash2 className="w-4 h-4" />
              Hapus Registrasi
            </Button>
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
              <p className="font-semibold">{kunjungan.pasien.nama}</p>
              <p className="text-sm text-muted-foreground">
                {kunjungan.norm}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t pt-3 text-sm">
              <Summary label="BPJS" ok={!!kunjungan.pasien.no_bpjs} />
              <Summary label="HP" ok={!!kunjungan.pasien.hp} />
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
  className = "",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
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
