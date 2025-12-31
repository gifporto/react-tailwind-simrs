import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { usePatient } from "@/querys/patient";
import GenderBadge from "@/components/gender-badge";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ambil data detail pasien
  const { data: response, isLoading } = usePatient(id as string);
  const patient = response?.data;

  if (isLoading) return <LoadingSkeleton />;
  if (!patient)
    return <div className="p-8 text-center">Data pasien tidak ditemukan.</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {patient.nama}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="font-mono">
                {patient.norm}
              </Badge>

              <GenderBadge gender={patient.sex} />
            </div>
          </div>
        </div>
        <Button onClick={() => navigate(`/daftar/pasien/edit/${id}`)}>
          Edit Profil Pasien
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Informasi Utama */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Informasi Demografi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <DetailItem label="NIK" value={patient.nik || "-"} />
              <DetailItem label="No. BPJS" value={patient.no_bpjs || "-"} />
              <DetailItem
                label="Tempat, Tgl Lahir"
                value={`${patient.tmp_lahir || "-"}, ${patient.tgl_lahir}`}
              />
              <DetailItem
                label="Agama"
                value={patient.agama?.desk_agama || "-"}
              />
              <DetailItem
                label="Pendidikan"
                value={patient.pendidikan?.desk_pendidikan || "-"}
              />
              <DetailItem
                label="Pekerjaan"
                value={patient.pekerjaan?.desk_pekerjaan || "-"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Alamat & Domisili
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Alamat KTP
                </p>
                <p className="text-sm">{patient.alamat_ktp}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Kel. {patient.kelurahan_ktp?.desk_kel || "-"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Alamat Domisili
                </p>
                <p className="text-sm">{patient.alamat_domisili}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Kel. {patient.kelurahan_domisili?.desk_kel || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Kontak & Keluarga */}
        <div className="space-y-6">
          <Card className="bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Kontak Pasien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem label="No. HP Utma" value={patient.hp} isBold />
              <DetailItem label="No. HP 2" value={patient.hp_2 || "-"} />
              <DetailItem label="Email" value={patient.email || "-"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Penanggung Jawab
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Nama Keluarga"
                value={patient.nama_keluarga || "-"}
              />
              <DetailItem
                label="No. HP Keluarga"
                value={patient.hp_keluarga || "-"}
              />
              <DetailItem
                label="Hubungan"
                value={getHubunganKeluarga(patient.id_hub_keluarga)}
              />
            </CardContent>
          </Card>

          <Card className="border-dashed border-2">
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Didaftarkan:</span>
                <span>{patient.insert_date}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Update Terakhir:</span>
                <span>
                  {new Date(patient.last_update).toLocaleString("id-ID")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Komponen Pembantu agar kode bersih
function DetailItem({
  label,
  value,
  isBold = false,
}: {
  label: string;
  value: string;
  isBold?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p
        className={`text-sm ${
          isBold ? "font-bold text-blue-700" : "font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// Skeleton saat loading
function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[300px] md:col-span-2" />
        <Skeleton className="h-[300px]" />
      </div>
    </div>
  );
}

// Fungsi dummy untuk mapping ID hubungan (sesuaikan dengan master data Anda)
function getHubunganKeluarga(id: string) {
  const map: Record<string, string> = {
    "1": "Orang Tua",
    "2": "Suami/Istri",
    "3": "Anak",
    "4": "Saudara",
  };
  return map[id] || "Lainnya";
}
