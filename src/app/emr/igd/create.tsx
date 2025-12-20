"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { EmrIgdAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  CalendarIcon,
  Save,
  ArrowLeft,
  Stethoscope,
  Loader2,
  User,
  ClipboardList,
} from "lucide-react";

export default function EmrIgdCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);

  // Form State
//   const [formData, setFormData] = React.useState({
//     nik: "",
//     nama: "",
//     sex: "",
//     norm: "",
//     tmp_lahir: "",
//     tgl_lahir: "",
//     tgl_periksa: format(new Date(), "yyyy-MM-dd"),
//     id_poli: "",
//     id_dokter: "",
//     id_cara_masuk: "",
//     id_tipe_pasien: "",
//     id_hak_kelas: "",
//     no_bpjs: "",
//     ihs_number: "",
//     no_hp: "",
//     id_agama: "",
//     id_sts_menikah: "",
//     id_sts_wn: "",
//     id_suku: "",
//     id_pendidikan: "",
//     id_pekerjaan: "",
//     id_hub_penanggung: "",
//     nama_penanggung: "",
//     almt_penanggung: "",
//     nik_penanggung: "",
//     hp_penanggung: "",
//     pasien_baru: "Y",
//   });
  
  // Default Value untuk Development Test
  const [formData, setFormData] = React.useState({
    nik: "1234567890123456",
    nama: "John Doe",
    sex: "L",
    norm: "83274823",
    tmp_lahir: "Jakarta",
    tgl_lahir: "1990-01-01",
    tgl_periksa: "2025-12-18",
    id_poli: "1",
    id_dokter: "1",
    id_cara_masuk: "1",
    id_tipe_pasien: "1",
    id_hak_kelas: "1",
    no_bpjs: "0001234567890",
    ihs_number: "IHS123456",
    no_hp: "081234567890",
    id_agama: "1",
    id_sts_menikah: "1",
    id_sts_wn: "1",
    id_suku: "1",
    id_pendidikan: "2",
    id_pekerjaan: "2",
    id_hub_penanggung: "1",
    nama_penanggung: "Jane Doe",
    almt_penanggung: "Jakarta",
    nik_penanggung: "9876543210987654",
    hp_penanggung: "081987654321",
    pasien_baru: "Y",
  });

  const [tglLahir, setTglLahir] = React.useState<Date | undefined>(undefined);
  const [tglPeriksa, setTglPeriksa] = React.useState<Date | undefined>(new Date());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Validasi input angka jika type="number" tapi menggunakan Input text untuk UX lebih baik
    if (e.target.dataset.numberonly === "true") {
      const re = /^[0-9\b]+$/;
      if (value !== "" && !re.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await EmrIgdAPI.create(formData);
      navigate("/emr/igd");
      toast.success("Data IGD berhasil disimpan!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data IGD");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-6"
    >
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl text-primary">Registrasi IGD</CardTitle>
              <p className="text-sm text-muted-foreground">Lengkapi data pemeriksaan pasien</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* SECTION 1: IDENTITAS PASIEN */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                  <User className="h-5 w-5" /> Identitas Pasien
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>No. RM (NORM) *</Label>
                    <Input name="norm" value={formData.norm} onChange={handleChange} required data-numberonly="true" placeholder="Hanya angka" />
                  </div>
                  <div className="space-y-2">
                    <Label>NIK *</Label>
                    <Input name="nik" value={formData.nik} onChange={handleChange} required data-numberonly="true" maxLength={16} placeholder="16 digit angka" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nama Lengkap *</Label>
                  <Input name="nama" value={formData.nama} onChange={handleChange} required placeholder="Contoh: Budi Santoso" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jenis Kelamin *</Label>
                    <Select onValueChange={(v) => handleSelectChange("sex", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>No. HP</Label>
                    <Input name="no_hp" type="tel" value={formData.no_hp} onChange={handleChange} data-numberonly="true" placeholder="0812..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tempat Lahir</Label>
                    <Input name="tmp_lahir" value={formData.tmp_lahir} onChange={handleChange} placeholder="Kota lahir" />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label className="mb-1">Tanggal Lahir</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between font-normal">
                          {tglLahir ? format(tglLahir, "dd/MM/yyyy") : "Pilih Tanggal"}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={tglLahir}
                          onSelect={(date) => {
                            setTglLahir(date);
                            if (date) handleSelectChange("tgl_lahir", format(date, "yyyy-MM-dd"));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATA KUNJUNGAN */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Data Kunjungan
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <Label className="mb-1">Tanggal Periksa</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between font-normal border-primary/30">
                          {tglPeriksa ? format(tglPeriksa, "dd/MM/yyyy") : "Pilih Tanggal"}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={tglPeriksa}
                          onSelect={(date) => {
                            setTglPeriksa(date);
                            if (date) handleSelectChange("tgl_periksa", format(date, "yyyy-MM-dd"));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Pasien Baru?</Label>
                    <Select defaultValue="Y" onValueChange={(v) => handleSelectChange("pasien_baru", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Ya (Baru)</SelectItem>
                        <SelectItem value="N">Tidak (Lama)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Poli</Label>
                    <Input name="id_poli" value={formData.id_poli} onChange={handleChange} data-numberonly="true" placeholder="Angka" />
                  </div>
                  <div className="space-y-2">
                    <Label>ID Dokter</Label>
                    <Input name="id_dokter" value={formData.id_dokter} onChange={handleChange} data-numberonly="true" placeholder="Angka" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipe Pasien</Label>
                    <Input name="id_tipe_pasien" value={formData.id_tipe_pasien} onChange={handleChange} data-numberonly="true" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cara Masuk</Label>
                    <Input name="id_cara_masuk" value={formData.id_cara_masuk} onChange={handleChange} data-numberonly="true" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>No. BPJS</Label>
                    <Input name="no_bpjs" value={formData.no_bpjs} onChange={handleChange} data-numberonly="true" />
                  </div>
                  <div className="space-y-2">
                    <Label>IHS Number</Label>
                    <Input name="ihs_number" value={formData.ihs_number} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: PENANGGUNG JAWAB */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">Data Penanggung Jawab</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Nama Penanggung</Label>
                  <Input name="nama_penanggung" value={formData.nama_penanggung} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>NIK Penanggung</Label>
                  <Input name="nik_penanggung" value={formData.nik_penanggung} onChange={handleChange} data-numberonly="true" maxLength={16} />
                </div>
                <div className="space-y-2">
                  <Label>Hubungan (ID)</Label>
                  <Input name="id_hub_penanggung" value={formData.id_hub_penanggung} onChange={handleChange} data-numberonly="true" />
                </div>
                <div className="space-y-2">
                  <Label>HP Penanggung</Label>
                  <Input name="hp_penanggung" value={formData.hp_penanggung} onChange={handleChange} data-numberonly="true" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alamat Penanggung</Label>
                <Input name="almt_penanggung" value={formData.almt_penanggung} onChange={handleChange} />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[150px]">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Simpan Data
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}