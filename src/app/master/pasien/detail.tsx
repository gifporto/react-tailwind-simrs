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
      navigate("/master/pasien?deleted=1");
    } catch (err) {
      console.error("Delete error:", err);
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

  const renderField = (label: string, name: string, value: any) => (
    <div className="mt-2">
      <Label>{label}</Label>

      {isEditing ? (
        <Input name={name} value={value ?? ""} onChange={handleChange} />
      ) : (
        <p className="mt-1 text-sm text-gray-700">{value || "-"}</p>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Data Pasien" : "Detail Pasien"}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold">Identitas Utama</h3>
            <div className="mt-2">
              <Label>NORM</Label>
              <p className="mt-1 text-sm text-gray-700 font-mono">{patient.norm || "-"}</p>
            </div>
            {renderField("Nama", "nama", patient.nama)}
            {renderField("NIK", "nik", patient.nik)}
            {renderField("No. BPJS", "no_bpjs", patient.no_bpjs)}
            {renderField("No. IHS", "ihs_number", patient.ihs_number)}
            {renderField("Jenis Kelamin", "sex", formatGender(patient.sex))}
            {renderField("Tempat Lahir", "tmp_lahir", patient.tmp_lahir)}
            {renderField("Tanggal Lahir", "tgl_lahir", formatDate(patient.tgl_lahir))}
          </div>

          <div>
            <h3 className="text-lg font-semibold">Kontak & Alamat</h3>
            {renderField("HP", "hp", patient.hp)}
            {renderField("HP 2", "hp_2", patient.hp_2)}
            {renderField("Email", "email", patient.email)}
            {renderField("Alamat KTP", "alamat_ktp", patient.alamat_ktp)}
            {renderField("Alamat Domisili", "alamat_domisili", patient.alamat_domisili)}
            {renderField("Nama Keluarga", "nama_keluarga", patient.nama_keluarga)}
            {renderField("HP Keluarga", "hp_keluarga", patient.hp_keluarga)}
            <div className="mt-2">
              <Label>Hub Keluarga</Label>
              <p className="mt-1 text-sm text-gray-700">{patient.hub_keluarga?.desk_hub_keluarga || "-"}</p>
            </div>
            <div className="mt-2">
              <Label>Tipe Pasien</Label>
              <p className="mt-1 text-sm text-gray-700">{patient.tipe_pasien?.desk_tipe_pasien || "-"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Informasi Audit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
            <div>
              <Label>Dibuat pada</Label>
              <p className="mt-1 text-sm text-gray-700">{formatDate(patient.created_at || patient.insert_date)}</p>
            </div>
            <div>
              <Label>Terakhir diupdate</Label>
              <p className="mt-1 text-sm text-gray-700">{formatDate(patient.last_update || patient.updated_at)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate("/master/pasien")}>
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