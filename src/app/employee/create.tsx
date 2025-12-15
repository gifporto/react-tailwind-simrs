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
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Add New Employee</CardTitle>
        <p className="text-sm text-muted-foreground">Fill in the employee information below</p>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive flex items-center gap-2">
                <span>⚠</span> {error}
              </p>
            </div>
          )}

          {/* GRID 2 KOLOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nama */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name" className="font-medium">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-enhanced"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="font-medium">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="employee@hospital.com"
                value={form.email}
                onChange={handleChange}
                required
                className="input-enhanced"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password" className="font-medium">Password <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="input-enhanced"
              />
            </div>

            {/* Nomor Telepon */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="phone_number" className="font-medium">Phone Number <span className="text-destructive">*</span></Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="08xxxxxxxxxx"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="input-enhanced"
              />
            </div>

            {/* Alamat Domisili */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label htmlFor="address_domicile" className="font-medium">Current Address <span className="text-destructive">*</span></Label>
              <Input
                id="address_domicile"
                name="address_domicile"
                placeholder="Enter current residential address"
                value={form.address_domicile}
                onChange={handleChange}
                required
                className="input-enhanced"
              />
            </div>

            {/* Alamat KTP */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label htmlFor="address_ktp" className="font-medium">ID Card Address <span className="text-destructive">*</span></Label>
              <Input
                id="address_ktp"
                name="address_ktp"
                placeholder="Address as per ID card"
                value={form.address_ktp}
                onChange={handleChange}
                required
                className="input-enhanced"
              />
            </div>

            {/* Departement */}
            <div className="flex flex-col space-y-2 md:col-span-2">
              <Label className="font-medium">Department <span className="text-destructive">*</span></Label>
              <Select
                onValueChange={(val) =>
                  setForm({ ...form, departement_id: val })
                }
                value={form.departement_id}
              >
                <SelectTrigger className="w-full input-enhanced">
                  <SelectValue placeholder={deptLoading ? "Loading departments..." : "Select a department"} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Departments</SelectLabel>

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
          <div className="flex gap-3 mt-8 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employee")}
              className="min-w-[100px]"
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              disabled={loading}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 min-w-[100px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Saving...
                </span>
              ) : "Save Employee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
