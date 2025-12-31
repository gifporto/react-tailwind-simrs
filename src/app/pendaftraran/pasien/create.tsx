import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { usePatientCreate } from "@/querys/patient";

export default function CreatePatientPage() {
  const navigate = useNavigate();
  const mutation = usePatientCreate();

  // State awal sesuai payload yang Anda minta
  const [formData, setFormData] = useState<any>({
    nik: "",
    nama: "",
    no_bpjs: "",
    ihs_number: "",
    tmp_lahir: "",
    tgl_lahir: "",
    sex: "",
    id_agama: "",
    id_sts_menikah: "",
    id_pendidikan: "",
    id_pekerjaan: "",
    alamat_ktp: "",
    id_kel_ktp: "",
    alamat_domisili: "",
    id_kel_domisili: "",
    hp: "",
    hp_2: "",
    email: "",
    nama_keluarga: "",
    nik_keluarga: "",
    alamat_keluarga: "",
    id_kel_keluarga: "",
    hp_keluarga: "",
    id_hub_keluarga: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSameAsKtp = (checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        alamat_domisili: formData.alamat_ktp,
        id_kel_domisili: formData.id_kel_ktp,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama || !formData.nik) {
      return toast.error("Nama dan NIK wajib diisi");
    }

    try {
      await mutation.mutateAsync(formData);
      toast.success("Pasien baru berhasil didaftarkan");
      navigate("/daftar/pasien");
    } catch (error) {
      toast.error("Gagal mendaftarkan pasien");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Tambah Pasien Baru</h1>
            <p className="text-sm text-muted-foreground">
              Lengkapi data rekam medis pasien di bawah ini.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? "Menyimpan..." : "Simpan Pasien"}
        </Button>
      </div>

      <form className="grid grid-cols-1 gap-6">
        {/* SEKSI 1: IDENTITAS PRIBADI */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identitas Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 lg:col-span-2">
              <Label>
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                name="nama"
                placeholder="Masukkan nama sesuai KTP"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>
                NIK <span className="text-red-500">*</span>
              </Label>
              <Input
                name="nik"
                maxLength={16}
                placeholder="16 digit NIK"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Select onValueChange={(v) => handleSelect("sex", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih L/P" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tempat Lahir</Label>
              <Input
                name="tmp_lahir"
                placeholder="Kota lahir"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Lahir</Label>
              <Input name="tgl_lahir" type="date" onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Agama</Label>
              <Select onValueChange={(v) => handleSelect("id_agama", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Islam</SelectItem>
                  <SelectItem value="2">Kristen</SelectItem>
                  <SelectItem value="3">Katolik</SelectItem>
                  {/* Tambahkan sesuai master data */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>No. BPJS</Label>
              <Input
                name="no_bpjs"
                placeholder="000..."
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor HP</Label>
              <Input name="hp" placeholder="0812..." onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        {/* SEKSI 2: ALAMAT */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Alamat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Alamat Lengkap (KTP)</Label>
              <Textarea
                name="alamat_ktp"
                placeholder="Jl. Nama Jalan, No. Rumah, RT/RW"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
              <Checkbox id="sameAsKtp" onCheckedChange={handleSameAsKtp} />
              <label
                htmlFor="sameAsKtp"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Alamat domisili sama dengan alamat KTP
              </label>
            </div>

            <div className="space-y-2">
              <Label>Alamat Domisili</Label>
              <Textarea
                name="alamat_domisili"
                value={formData.alamat_domisili}
                placeholder="Alamat tempat tinggal saat ini"
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEKSI 3: KELUARGA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Kontak Keluarga / Penanggung Jawab
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Keluarga</Label>
              <Input name="nama_keluarga" onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Hubungan Keluarga</Label>
              <Select onValueChange={(v) => handleSelect("id_hub_keluarga", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Hubungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Orang Tua</SelectItem>
                  <SelectItem value="2">Suami/Istri</SelectItem>
                  <SelectItem value="3">Anak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>No. HP Keluarga</Label>
              <Input name="hp_keluarga" onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>NIK Keluarga</Label>
              <Input
                name="nik_keluarga"
                onChange={handleChange}
                maxLength={16}
              />
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="flex justify-end gap-4 pb-10">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Batal
        </Button>
        <Button size="lg" onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Mendaftarkan..." : "Simpan Data Pasien"}
        </Button>
      </div>
    </div>
  );
}
