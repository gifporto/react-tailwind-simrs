"use client";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PatientsAPI } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

    if (name.startsWith("addresses.")) {
      const key = name.split(".")[1];
      setPatient({
        ...patient,
        addresses: {
          ...patient.addresses,
          [key]: value,
        },
      });
    } else {
      setPatient({
        ...patient,
        [name]: value,
      });
    }
  };

  const handlePhonesChange = (e: any) => {
    const value = e.target.value;
    const phonesArray = value.split(",").map((phone: string) => phone.trim()).filter((phone: string) => phone);
    setPatient({
      ...patient,
      phones: phonesArray,
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
        <LoadingSkeleton lines={8} />
      </Card>
    );
  }

  if (!patient) {
    return <Card className="text-center text-gray-500">Data tidak ditemukan</Card>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0000-00-00") return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return "-";
    }
  };

  const formatGender = (gender: string) => {
    if (gender === "L") return "Laki-laki";
    if (gender === "P") return "Perempuan";
    return "-";
  };

  const renderField = (label: string, name: string, value: any, type: string = "text") => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {isEditing ? (
        <Input 
          name={name} 
          value={value ?? ""} 
          onChange={handleChange}
          type={type}
        />
      ) : (
        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{value || "-"}</p>
      )}
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">
              {isEditing ? "Edit Data Pasien" : "Detail Pasien"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              NORM: <span className="font-medium">{patient.norm || "-"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={patient.gender === "L" ? "default" : "secondary"}>
              {formatGender(patient.gender)}
            </Badge>
            <Badge variant="outline">
              {patient.age || 0} tahun
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identitas Utama */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Identitas Utama</h3>
            {renderField("Nama Lengkap", "name", patient.name)}
            {renderField("NIK", "nik", patient.nik)}
            {renderField("No. BPJS", "bpjs_number", patient.bpjs_number)}
            {renderField("No. IHS", "ihs_number", patient.ihs_number)}
            {renderField("Tanggal Lahir", "birth_date", patient.birth_date, "date")}
            {renderField("Nama Keluarga", "family_name", patient.family_name)}
            {renderField("Email", "email", patient.email, "email")}
          </div>

          {/* Kontak & Alamat */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Kontak & Alamat</h3>
            
            {/* Telepon */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nomor Telepon</Label>
              {isEditing ? (
                <Input 
                  value={patient.phones?.join(", ") || ""} 
                  onChange={handlePhonesChange}
                  placeholder="Pisahkan dengan koma untuk multiple nomor"
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                  {patient.phones?.length > 0 ? patient.phones.join(", ") : "-"}
                </p>
              )}
            </div>

            {/* Alamat KTP */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alamat KTP</Label>
              {isEditing ? (
                <Input 
                  name="addresses.ktp" 
                  value={patient.addresses?.ktp ?? ""} 
                  onChange={handleChange}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                  {patient.addresses?.ktp || "-"}
                </p>
              )}
            </div>

            {/* Alamat Domisili */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alamat Domisili</Label>
              {isEditing ? (
                <Input 
                  name="addresses.domisili" 
                  value={patient.addresses?.domisili ?? ""} 
                  onChange={handleChange}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                  {patient.addresses?.domisili || "-"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informasi Audit */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Informasi Audit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Dibuat pada:</span>
              <p className="text-muted-foreground">{formatDate(patient.created_at)}</p>
            </div>
            <div>
              <span className="font-medium">Diperbarui pada:</span>
              <p className="text-muted-foreground">{formatDate(patient.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={() => navigate("/master/pasien")}>
            Kembali
          </Button>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Data
            </Button>
          ) : (
            <>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>

              <Button variant="secondary" onClick={handleCancel}>
                Batal
              </Button>
            </>
          )}

          {!isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Hapus Pasien
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Data Pasien?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus semua data pasien secara permanen.
                    Data yang sudah dihapus tidak dapat dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}