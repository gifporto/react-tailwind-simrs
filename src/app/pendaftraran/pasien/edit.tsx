import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { usePatient, usePatientUpdate } from "@/querys/patient";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpdatePatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data Fetching & Mutation
  const { data: response, isLoading } = usePatient(id as string);
  const mutation = usePatientUpdate(id as string);

  // State untuk menampung payload sesuai format Anda
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (response?.data) {
      setFormData(response.data);
    }
  }, [response]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ id, ...formData });
      toast.success("Data pasien berhasil diperbarui");
      navigate(`/daftar/pasien/detail/${id}`);
    } catch (error) {
      toast.error("Gagal memperbarui data");
    }
  };

  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Ubah Data Pasien</h1>
          <p className="text-sm text-muted-foreground">ID Pasien: {id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* IDENTITAS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Identitas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                name="nama"
                value={formData.nama || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input
                name="nik"
                value={formData.nik || ""}
                onChange={handleChange}
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Select
                onValueChange={(v) => handleSelect("sex", v)}
                value={formData.sex}
              >
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
              <Label>Tanggal Lahir</Label>
              <Input
                name="tgl_lahir"
                type="date"
                value={formData.tgl_lahir || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* KONTAK & ALAMAT */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kontak & Alamat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nomor HP</Label>
                <Input
                  name="hp"
                  value={formData.hp || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alamat KTP</Label>
              <Textarea
                name="alamat_ktp"
                value={formData.alamat_ktp || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* KELUARGA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Keluarga</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Penanggung Jawab</Label>
              <Input
                name="nama_keluarga"
                value={formData.nama_keluarga || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>No. HP Keluarga</Label>
              <Input
                name="hp_keluarga"
                value={formData.hp_keluarga || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Alamat Keluarga</Label>
              <Textarea
                name="alamat_keluarga"
                value={formData.alamat_keluarga || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
