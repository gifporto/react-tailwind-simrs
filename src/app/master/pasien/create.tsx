"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { PatientsAPI } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePatientPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    norm: "",
    nik: "",
    bpjs_number: "",
    ihs_number: "",
    gender: "",
    name: "",
    email: "",
    phones: "",
    addresses: {
      ktp: "",
      domisili: "",
    },
    birth_date: "",
    family_name: "",
  });

  const [saving, setSaving] = React.useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name.startsWith("addresses.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        addresses: {
          ...formData.addresses,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert phones string to array
      const payload = {
        ...formData,
        phones: formData.phones
          .split(",")
          .map((phone) => phone.trim())
          .filter((phone) => phone),
      };

      await PatientsAPI.create(payload);
      toast.success("Pasien berhasil ditambahkan!");
      navigate("/master/pasien?created=1");
    } catch (err: any) {
      toast.error("Gagal menambahkan pasien");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl text-primary">Tambah Pasien Baru</CardTitle>
        <p className="text-sm text-muted-foreground">
          Lengkapi form berikut untuk menambahkan data pasien baru
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identitas Utama */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Identitas Utama</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">NORM <span className="text-destructive">*</span></Label>
                <Input
                  name="norm"
                  value={formData.norm}
                  onChange={handleChange}
                  placeholder="Nomor Rekam Medis"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap pasien"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">NIK</Label>
                <Input
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="Nomor Induk Kependudukan"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">No. BPJS</Label>
                <Input
                  name="bpjs_number"
                  value={formData.bpjs_number}
                  onChange={handleChange}
                  placeholder="Nomor BPJS"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">No. IHS</Label>
                <Input
                  name="ihs_number"
                  value={formData.ihs_number}
                  onChange={handleChange}
                  placeholder="Nomor IHS"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Jenis Kelamin <span className="text-destructive">*</span></Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data Tambahan */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Data Tambahan</h3>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tanggal Lahir</Label>
                <Input
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nama Keluarga</Label>
                <Input
                  name="family_name"
                  value={formData.family_name}
                  onChange={handleChange}
                  placeholder="Nama keluarga/ayah/ibu"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alamat@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nomor Telepon</Label>
                <Input
                  name="phones"
                  value={formData.phones}
                  onChange={handleChange}
                  placeholder="Pisahkan dengan koma untuk multiple nomor"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Alamat KTP</Label>
                <Input
                  name="addresses.ktp"
                  value={formData.addresses.ktp}
                  onChange={handleChange}
                  placeholder="Alamat sesuai KTP"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Alamat Domisili</Label>
                <Input
                  name="addresses.domisili"
                  value={formData.addresses.domisili}
                  onChange={handleChange}
                  placeholder="Alamat tempat tinggal saat ini"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/master/pasien")}
            >
              Kembali
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Pasien"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}