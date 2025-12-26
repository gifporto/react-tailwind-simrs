"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmrRadiologyAPI, DoctorAPI } from "@/lib/api";
import LoadingSkeleton from "@/components/LoadingSkeleton";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Radio,
    User,
    Phone,
    Clock,
    ArrowLeft,
    Trash2,
    Check,
    X,
    InfoIcon,
    AlertCircle,
    Mars,
    Venus,
    FileText,
    PlayCircle,
    CheckCircle2,
    Download,
} from "lucide-react";
import { toast } from "sonner";

export default function EmrRadiologiDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State untuk form "Complete"
    const [showResultForm, setShowResultForm] = useState(false);
    const [formData, setFormData] = useState({
        kesimpulan: "",
        temuan: "",
        saran: "",
        dokter_radiologi_id: "", // Default sesuai data contoh
        file_lampiran: null as File | null,
    });

    /* =====================
       FETCH DATA API
    ===================== */
    const { data: apiResponse, isLoading, isError } = useQuery({
        queryKey: ["emr-radiologi-detail", id],
        queryFn: () => EmrRadiologyAPI.getDetail(id as string),
        enabled: !!id,
    });

    const order = apiResponse?.data;

    const { data: doctorResponse } = useQuery({
        queryKey: ["master-doctors"],
        queryFn: () => DoctorAPI.getList(1, 100), // Ambil limit besar agar semua dokter muncul
    });

    const doctors = doctorResponse?.data || [];

    /* =====================
       MUTATIONS (ACTIONS)
    ===================== */
    const processMutation = useMutation({
        mutationFn: () => EmrRadiologyAPI.process(id as string),
        onSuccess: () => {
            toast.success("Order sedang diproses");
            queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });
        },
    });

    const abortMutation = useMutation({
        mutationFn: () => EmrRadiologyAPI.abort(id as string),
        onSuccess: () => {
            toast.error("Order dibatalkan");
            navigate(-1);
        },
    });

    const completeMutation = useMutation({
        mutationFn: (payload: FormData) =>
            EmrRadiologyAPI.complete(id as string, payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            }),
        onSuccess: () => {
            toast.success("Hasil radiologi berhasil disimpan");
            setShowResultForm(false);
            queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });
        },
    });

    const handleCompleteSubmit = () => {
        const data = new FormData();
        data.append("kesimpulan", formData.kesimpulan);
        data.append("temuan", formData.temuan);
        data.append("saran", formData.saran);
        data.append("dokter_radiologi_id", formData.dokter_radiologi_id);
        if (formData.file_lampiran) {
            data.append("file_lampiran", formData.file_lampiran);
        }
        completeMutation.mutate(data);
    };

    if (isLoading) return <LoadingSkeleton lines={20} />;

    if (isError || !order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-bold">Data Tidak Ditemukan</h3>
                <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
            </div>
        );
    }

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "selesai":
                return "success";
            case "ordered":
                return "info";
            case "dibatalkan":
                return "destructive";
            case "proses":
                return "warning";
            default:
                return "outline";
        }
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* ================= MAIN CONTENT ================= */}
            <div className="col-span-12 lg:col-span-8 space-y-6">

                {/* ORDER INFO */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-blue-600">
                                <Radio className="w-5 h-5" />
                                Detail Order Radiologi
                            </CardTitle>
                            <CardDescription>No. Order: {order.no_order}</CardDescription>
                        </div>
                        <Badge variant={`${getStatusVariant(order.status)}`}>
                            {order.status.toUpperCase()}
                        </Badge>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <Info label="Tanggal Order">{order.tanggal_order}</Info>
                        <Info label="Dokter Pengirim">
                            <Badge variant="info">
                                <User className="w-3 h-3 mr-1" />
                                {order.dokter?.nama}
                            </Badge>
                        </Info>
                        <div className="md:col-span-2">
                            <Label className="mb-2 block">Daftar Pemeriksaan</Label>
                            <div className="border rounded-lg divide-y">
                                {order.details?.map((item: any) => (
                                    <div key={item.id} className="p-3 flex justify-between items-center text-sm">
                                        <span>{item.pemeriksaan?.nama} ({item.pemeriksaan?.kode})</span>
                                        <Badge className="text-[10px]" variant={`${getStatusVariant(item.status)}`}>
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PATIENT INFO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <User className="w-4 h-4" /> Data Pasien
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <Info label="Nama Lengkap" className="uppercase font-bold">{order.pasien?.nama}</Info>
                        <Info label="No. Rekam Medis"><Badge variant="outline">{order.pasien?.norm}</Badge></Info>
                        <Info label="Jenis Kelamin">
                            {order.pasien?.sex === "L" ? "Laki-laki" : "Perempuan"}
                        </Info>
                        <Info label="Kontak">
                            <span className="flex items-center gap-1 text-green-600">
                                <Phone className="w-3 h-3" /> {order.pasien?.hp || "-"}
                            </span>
                        </Info>
                    </CardContent>
                </Card>

                {/* HASIL PEMERIKSAAN (JIKA SUDAH ADA) */}
                {(order.status === "selesai" || order.hasil) && (
                    <Card className="border-green-200 bg-green-50/30">
                        <CardHeader>
                            <CardTitle className="text-green-700 flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Hasil Pemeriksaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Info label="Temuan">{order.hasil?.temuan}</Info>
                            <Info label="Dokter Radiologi">
                                <Badge variant="info">
                                    <User className="w-3 h-3 mr-1" />
                                    {order.hasil?.dokter_radiologi.nama}
                                </Badge>
                            </Info>
                            <Info label="Kesimpulan" className="font-semibold">{order.hasil?.kesimpulan}</Info>
                            <Info label="Saran">{order.hasil?.saran || "-"}</Info>
                            {order.hasil?.file_lampiran && (
                                <Button variant="outline" size="sm" asChild className="mt-2">
                                    <a href={order.hasil.file_lampiran} target="_blank" rel="noreferrer">
                                        <Download className="w-4 h-4 mr-2" /> Lihat Lampiran
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Aksi Petugas</CardTitle></CardHeader>
                    <CardContent className="space-y-3">

                        {order.status === "ordered" && (
                            <Button
                                className="w-full gap-2 bg-blue-600"
                                onClick={() => processMutation.mutate()}
                                disabled={processMutation.isPending}
                            >
                                <PlayCircle className="w-4 h-4" /> Proses Sekarang
                            </Button>
                        )}

                        {order.status === "proses" && !showResultForm && (
                            <Button
                                className="w-full gap-2 bg-green-600"
                                onClick={() => setShowResultForm(true)}
                            >
                                <CheckCircle2 className="w-4 h-4" /> Isi Hasil & Selesai
                            </Button>
                        )}

                        <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Button>

                        <Separator />

                        {order.status !== "selesai" && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="w-full gap-2"
                                        disabled={abortMutation.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {abortMutation.isPending ? "Membatalkan..." : "Batalkan Order"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tindakan ini tidak dapat dibatalkan. Ini akan membatalkan order radiologi
                                            untuk pasien <strong>{order.pasien?.nama}</strong> secara permanen.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Kembali</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => abortMutation.mutate()}
                                            className="bg-destructive text-white hover:bg-destructive/90"
                                        >
                                            Ya, Batalkan Order
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardContent>
                </Card>

                {/* RINGKASAN STATUS */}
                <Card>
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${order.status === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Radio className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status Pemeriksaan</p>
                            <h3 className="text-xl font-bold capitalize">{order.status}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t pt-4 text-xs">
                            <Summary label="Order" ok={true} />
                            <Summary label="Hasil" ok={order.status === "selesai"} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ================= MODAL FORM HASIL ================= */}
            <Dialog open={showResultForm} onOpenChange={setShowResultForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Input Hasil Radiologi</DialogTitle>
                        <DialogDescription>Lengkapi temuan dan kesimpulan medis berikut.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Dokter Radiologi</Label>
                            <Select
                                value={formData.dokter_radiologi_id}
                                onValueChange={(v) => setFormData({ ...formData, dokter_radiologi_id: v })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Dokter" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doc: any) => (
                                        <SelectItem key={doc.id} value={doc.id.toString()}>{doc.nama_dokter}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Temuan</Label>
                            <Textarea
                                placeholder="Deskripsikan temuan..."
                                onChange={(e) => setFormData({ ...formData, temuan: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Kesimpulan</Label>
                            <Textarea
                                placeholder="Kesimpulan diagnosa..."
                                onChange={(e) => setFormData({ ...formData, kesimpulan: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Saran (Opsional)</Label>
                            <Input
                                placeholder="Masukkan saran jika ada..."
                                onChange={(e) => setFormData({ ...formData, saran: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>File Lampiran</Label>
                            <Input
                                type="file"
                                onChange={(e) => setFormData({ ...formData, file_lampiran: e.target.files?.[0] || null })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowResultForm(false)}>Batal</Button>
                        <Button onClick={handleCompleteSubmit} disabled={completeMutation.isPending}>
                            {completeMutation.isPending ? "Menyimpan..." : "Simpan Hasil"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

/* =====================
   Helpers (Sama seperti struktur IGD Anda)
===================== */
function Info({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className="flex flex-col space-y-1">
            <Label className="text-muted-foreground">{label}</Label>
            <div className={`font-medium ${className}`}>{children}</div>
        </div>
    );
}

function Summary({ label, ok }: { label: string; ok?: boolean }) {
    return (
        <div>
            <p className="text-muted-foreground mb-1">{label}</p>
            {ok ? <Check className="mx-auto text-green-500 w-4 h-4" /> : <Clock className="mx-auto text-muted-foreground w-4 h-4" />}
        </div>
    );
}