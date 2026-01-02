import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import { SearchKelurahan } from "@/components/search/search-kelurahan";

export default function CreatePatientPage() {
  const navigate = useNavigate();
  const mutation = usePatientCreate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
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
    },
  });

  const alamatKtpWatch = watch("alamat_ktp");
  const idKelKtpWatch = watch("id_kel_ktp");

  const onSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
      toast.success("Pasien baru berhasil didaftarkan");
      navigate("/daftar/pasien");
    } catch (error: any) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.data;
        Object.keys(serverErrors).forEach((key) => {
          setError(key as any, {
            type: "server",
            message: serverErrors[key][0],
          });
        });
        toast.error("Mohon periksa kembali inputan Anda");
      }
    }
  };

  const FieldError = ({ name }: { name: string }) => {
    const error = (errors as any)[name];
    if (!error) return null;
    return (
      <p className="text-xs font-medium text-destructive mt-1">
        {error.message}
      </p>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Tambah Pasien Baru</h1>
        </div>
        <Button
          onClick={handleSubmit(onSubmit, (errors) =>
            console.log("Validasi Gagal:", errors)
          )}
          disabled={mutation.isPending}
        >
          <Save className="w-4 h-4" />{" "}
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
              <Label>Nama Lengkap *</Label>
              <Controller
                name="nama"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.nama ? "border-destructive" : ""}
                  />
                )}
              />
              <FieldError name="nama" />
            </div>
            <div className="space-y-2">
              <Label>NIK *</Label>
              <Controller
                name="nik"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    maxLength={16}
                    className={errors.nik ? "border-destructive" : ""}
                  />
                )}
              />
              <FieldError name="nik" />
            </div>
            <div className="space-y-2">
              <Label>No. BPJS</Label>
              <Controller
                name="no_bpjs"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              <FieldError name="no_bpjs" />
            </div>
            <div className="space-y-2">
              <Label>IHS Number</Label>
              <Controller
                name="ihs_number"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label>Jenis Kelamin *</Label>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={errors.sex ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Pilih L/P" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError name="sex" />
            </div>
            <div className="space-y-2">
              <Label>Tempat Lahir</Label>
              <Controller
                name="tmp_lahir"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Lahir *</Label>
              <Controller
                name="tgl_lahir"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    className={errors.tgl_lahir ? "border-destructive" : ""}
                  />
                )}
              />
              <FieldError name="tgl_lahir" />
            </div>
            <div className="space-y-2">
              <Label>Agama</Label>
              <Controller
                name="id_agama"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Islam</SelectItem>
                      <SelectItem value="2">Kristen</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Status Menikah</Label>
              <Controller
                name="id_sts_menikah"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0001">Belum Menikah</SelectItem>
                      <SelectItem value="0002">Menikah</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Pendidikan</Label>
              <Controller
                name="id_pendidikan"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">SD</SelectItem>
                      <SelectItem value="3">SMA</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Pekerjaan</Label>
              <Controller
                name="id_pekerjaan"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">PNS</SelectItem>
                      <SelectItem value="3">Swasta</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEKSI 2: ALAMAT */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Alamat & Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nomor HP *</Label>
                <Controller
                  name="hp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className={errors.hp ? "border-destructive" : ""}
                    />
                  )}
                />
                <FieldError name="hp" />
              </div>
              <div className="space-y-2">
                <Label>Nomor HP 2</Label>
                <Controller
                  name="hp_2"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} type="email" />}
                />
                <FieldError name="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kelurahan (KTP) *</Label>
              <Controller
                name="id_kel_ktp"
                control={control}
                render={({ field }) => (
                  <SearchKelurahan
                    {...field}
                    placeholder="Cari kelurahan sesuai KTP..."
                    className={
                      errors.id_kel_ktp
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                )}
              />
              <FieldError name="id_kel_ktp" />
            </div>
            <div className="space-y-2">
              <Label>Alamat Lengkap (KTP) *</Label>
              <Controller
                name="alamat_ktp"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className={errors.alamat_ktp ? "border-destructive" : ""}
                  />
                )}
              />
              <FieldError name="alamat_ktp" />
            </div>
            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
              <Checkbox
                id="sameAsKtp"
                onCheckedChange={(c) => {
                  if (c) {
                    setValue("alamat_domisili", alamatKtpWatch);
                    setValue("id_kel_domisili", idKelKtpWatch);
                  }
                }}
              />
              <label
                htmlFor="sameAsKtp"
                className="text-sm font-medium cursor-pointer"
              >
                Alamat domisili sama dengan KTP
              </label>
            </div>
            <div className="space-y-2">
              <Label>Alamat Domisili</Label>
              <Controller
                name="alamat_domisili"
                control={control}
                render={({ field }) => <Textarea {...field} />}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEKSI 3: KELUARGA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Penanggung Jawab</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Keluarga</Label>
              <Controller
                name="nama_keluarga"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label>NIK Keluarga</Label>
              <Controller
                name="nik_keluarga"
                control={control}
                render={({ field }) => <Input {...field} maxLength={16} />}
              />
            </div>
            <div className="space-y-2">
              <Label>No. HP Keluarga</Label>
              <Controller
                name="hp_keluarga"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label>Hubungan Keluarga</Label>
              <Controller
                name="id_hub_keluarga"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Hubungan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Orang Tua</SelectItem>
                      <SelectItem value="2">Suami/Istri</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Alamat Keluarga</Label>
              <Controller
                name="alamat_keluarga"
                control={control}
                render={({ field }) => <Textarea {...field} />}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
