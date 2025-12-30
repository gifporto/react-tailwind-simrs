"use client";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PatientsAPI } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { User } from "lucide-react";

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const patientId = String(id);

  const [patient, setPatient] = React.useState<any>(null);
  const [originalPatient, setOriginalPatient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const loadDetail = async () => {
      try {
        const result: any = await PatientsAPI.getDetail(patientId);
        // API returns data under different keys (e.g., nama, sex, tgl_lahir)
        setPatient(result.data);
        setOriginalPatient(result.data);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [patientId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await PatientsAPI.update(patientId, patient);
      toast.success("Pasien berhasil diperbarui!");
      setIsEditing(false);
      setOriginalPatient(patient);
    } catch (err) {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPatient(originalPatient);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await PatientsAPI.delete(patientId);
      navigate("/daftar/pasien");
      toast.success("Pasien berhasil dihapus!");
    } catch (err) {
      toast.error("Gagal menyimpan perubahan");
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSkeleton lines={6} />
      </Card>
    );
  }

  if (!patient) {
    return <Card className="text-center text-gray-500">Data tidak ditemukan</Card>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0000-00-00" || !dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return "-";
    }
  };

  const formatGender = (sex: string) => {
    if (sex === "L") return "Laki-laki";
    if (sex === "P") return "Perempuan";
    return "-";
  };

  const renderField = (
    label: string,
    name: string,
    value: any,
    editable: boolean = true
  ) => (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {isEditing && editable ? (
        <Input name={name} value={value ?? ""} onChange={handleChange} />
      ) : (
        <p className="text-sm">{value && value !== "" ? value : "-"}</p>
      )}
    </div>
  );


  return (
    <Card>
      <CardHeader className="border-b">
        <div
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary">{isEditing ? "Edit Data Pasien" : "Detail Pasien"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Edit form berikut untuk update data pasien" : "Menampilkan form data pasien"}

            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* ================= IDENTITAS UTAMA ================= */}
        <section>
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-6 flex items-center gap-2">
            Identitas Utama
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField("NORM", "norm", patient.norm, false)}
            {renderField("Nama Lengkap", "nama", patient.nama)}
            {renderField("Jenis Kelamin", "sex", formatGender(patient.sex), false)}

            {renderField("Tempat Lahir", "tmp_lahir", patient.tmp_lahir)}
            {renderField("Tanggal Lahir", "tgl_lahir", formatDate(patient.tgl_lahir), false)}
            {renderField("NIK", "nik", patient.nik)}

            {renderField("No BPJS", "no_bpjs", patient.no_bpjs)}
            {renderField("IHS Number", "ihs_number", patient.ihs_number)}
          </div>
        </section>

        {/* ================= KONTAK & ALAMAT ================= */}
        <section>
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-6 flex items-center gap-2">
            Kontak & Alamat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("No HP", "hp", patient.hp)}
            {renderField("No HP Alternatif", "hp_2", patient.hp_2)}
            {renderField("Email", "email", patient.email)}

            {renderField("Alamat KTP", "alamat_ktp", patient.alamat_ktp)}
            {renderField("Alamat Domisili", "alamat_domisili", patient.alamat_domisili)}
          </div>
        </section>

        {/* ================= DATA SOSIAL ================= */}
        <section>
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-6 flex items-center gap-2">
            Data Sosial
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField("Agama", "agama", patient.agama?.nama_agama || "-")}
            {renderField("Pendidikan", "pendidikan", patient.pendidikan?.desk_pendidikan || "-")}
            {renderField("Pekerjaan", "pekerjaan", patient.pekerjaan?.desk_pekerjaan || "-")}

            {renderField(
              "Status Menikah",
              "status_menikah",
              patient.status_menikah?.desk_status_menikah || "-"
            )}
            {renderField("Suku", "id_suku", patient.id_suku)}
            {renderField("Status WN", "id_sts_wn", patient.id_sts_wn)}
          </div>
        </section>

        {/* ================= DATA KELUARGA ================= */}
        <section>
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-6 flex items-center gap-2">
            Data Keluarga
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField("Nama Keluarga", "nama_keluarga", patient.nama_keluarga)}
            {renderField("NIK Keluarga", "nik_keluarga", patient.nik_keluarga)}
            {renderField("No HP Keluarga", "hp_keluarga", patient.hp_keluarga)}

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Hubungan Keluarga</Label>
              <p className="text-sm">
                {patient.hub_keluarga?.desk_hub_keluarga || "-"}
              </p>
            </div>

            {renderField("Alamat Keluarga", "alamat_keluarga", patient.alamat_keluarga)}
          </div>
        </section>

        {/* ================= TIPE PASIEN ================= */}
        <section>
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-6 flex items-center gap-2">
            Administrasi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Tipe Pasien</Label>
              <p className="text-sm">
                {patient.tipe_pasien?.desk_tipe_pasien || "-"}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Retensi</Label>
              <p className="text-sm">{patient.retensi === "Y" ? "Ya" : "Tidak"}</p>
            </div>
          </div>
        </section>

        {/* ================= AUDIT ================= */}
        <section>
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-6 flex items-center gap-2">
            Informasi Audit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-xs">Dibuat</Label>
              <p>{formatDate(patient.created_at || patient.insert_date)}</p>
            </div>

            <div>
              <Label className="text-xs">Terakhir Update</Label>
              <p>{formatDate(patient.last_update || patient.updated_at)}</p>
            </div>

            <div>
              <Label className="text-xs">Created By</Label>
              <p>{patient.created_by || "-"}</p>
            </div>
          </div>
        </section>

        {/* ================= ACTION ================= */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button variant="outline" onClick={() => navigate("/daftar/pasien")}>
            Kembali
          </Button>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Batal
              </Button>
            </>
          )}

          {!isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Hapus</Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Pasien?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data pasien <strong>{patient.nama}</strong> akan dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Ya, Hapus</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

      </CardContent>

    </Card>
  );
}