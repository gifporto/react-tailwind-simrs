"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeAPI, DepartementAPI } from "@/lib/api";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function EmployeeCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    address_domicile: "",
    address_ktp: "",
    phone_number: "",
    departement_id: "",
  });

  const [departements, setDepartements] = React.useState<any[]>([]);
  const [deptLoading, setDeptLoading] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // LOAD DEPARTEMENTS
  React.useEffect(() => {
    const loadDepartements = async () => {
      try {
        const result = (await DepartementAPI.getList()) as any;
        setDepartements(result.data);
      } catch (err) {
        console.error("Gagal load departement", err);
      } finally {
        setDeptLoading(false);
      }
    };
    loadDepartements();
  }, []);

  // FORM CHANGE
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT FORM
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...form };

      await EmployeeAPI.create(payload);

      navigate("/employee?created=1");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal membuat data employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Employee</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}

          {/* GRID 2 KOLOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nama */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nama Lengkap"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nomor Telepon */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="phone_number">Nomor Telepon</Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="08xxxx"
                value={form.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            {/* Alamat Domisili */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label htmlFor="address_domicile">Alamat Domisili</Label>
              <Input
                id="address_domicile"
                name="address_domicile"
                placeholder="Alamat Domisili"
                value={form.address_domicile}
                onChange={handleChange}
                required
              />
            </div>

            {/* Alamat KTP */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label htmlFor="address_ktp">Alamat KTP</Label>
              <Input
                id="address_ktp"
                name="address_ktp"
                placeholder="Alamat sesuai KTP"
                value={form.address_ktp}
                onChange={handleChange}
                required
              />
            </div>

            {/* Departement */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label>Departement</Label>
              <Select
                onValueChange={(val) =>
                  setForm({ ...form, departement_id: val })
                }
                value={form.departement_id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={deptLoading ? "Loading..." : "Pilih Departement"} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pilih Departement</SelectLabel>

                    {!deptLoading &&
                      departements.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name}
                        </SelectItem>
                      ))}

                    {deptLoading && (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employee")}
            >
              Kembali
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
