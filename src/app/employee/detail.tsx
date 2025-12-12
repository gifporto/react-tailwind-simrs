"use client";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeAPI } from "@/lib/api";

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

export default function EmployeeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const employeeId = String(id);

  const [employee, setEmployee] = React.useState<any>(null);
  const [originalEmployee, setOriginalEmployee] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const loadDetail = async () => {
      try {
        const result: any = await EmployeeAPI.getDetail(employeeId);
        setEmployee(result.data);
        setOriginalEmployee(result.data); // simpan versi original
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [employeeId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name.startsWith("user.")) {
      const key = name.split(".")[1];
      setEmployee({
        ...employee,
        user: {
          ...employee.user,
          [key]: value,
        },
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await EmployeeAPI.update(employeeId, employee);
      toast.success("Employee berhasil diperbarui!");
      setIsEditing(false);
      setOriginalEmployee(employee);
    } catch (err) {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEmployee(originalEmployee); // balikan data ke versi awal
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await EmployeeAPI.delete(employeeId);
      navigate("/employee?deleted=1");
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

  if (!employee) {
    return <Card className="text-center text-gray-500">Data tidak ditemukan</Card>;
  }

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
        <CardTitle>
          {isEditing ? "Edit Employee" : "Detail Employee"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderField("Nama", "user.name", employee.user?.name)}
        {renderField("Email", "user.email", employee.user?.email)}
        {renderField("No Telepon", "phone_number", employee.phone_number)}
        {renderField("Alamat Domisili", "address_domicile", employee.address_domicile)}
        {renderField("Alamat KTP", "address_ktp", employee.address_ktp)}
        {renderField("Pendidikan", "education", employee.education)}

        {/* Experiences */}
        <div>
          <Label>Work Experiences</Label>
          {isEditing ? (
            <Input
              value={employee.work_experiences?.join(", ") ?? ""}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  work_experiences: e.target.value.split(",").map((v) => v.trim()),
                })
              }
            />
          ) : (
            <p className="text-sm mt-1 text-gray-700">
              {employee.work_experiences?.join(", ") || "-"}
            </p>
          )}
        </div>

        {/* Trainings */}
        <div>
          <Label>Trainings</Label>
          {isEditing ? (
            <Input
              value={employee.trainings?.join(", ") ?? ""}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  trainings: e.target.value.split(",").map((v) => v.trim()),
                })
              }
            />
          ) : (
            <p className="text-sm mt-1 text-gray-700">
              {employee.trainings?.join(", ") || "-"}
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate("/employee")}>
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
                  <AlertDialogTitle>Hapus Employee?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data yang sudah dihapus tidak dapat dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
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
