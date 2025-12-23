"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmrLabAPI, DoctorAPI } from "@/lib/api";
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
    Beaker,
    User,
    Phone,
    Clock,
    ArrowLeft,
    Trash2,
    Check,
    AlertCircle,
    FileText,
    PlayCircle,
    CheckCircle2,
    FlaskConical,
} from "lucide-react";
import { toast } from "sonner";

export default function EmrLabDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State untuk form "Complete"
    const [showResultForm, setShowResultForm] = useState(false);
    const [formData, setFormData] = useState({
        catatan: "",
        dokter_lab_id: "", 
    });

    /* =====================
       FETCH DATA API
    ===================== */
    const { data: apiResponse, isLoading, isError } = useQuery({
        queryKey: ["emr-lab-detail", id],
        queryFn: () => EmrLabAPI.getDetail(id as string),
        enabled: !!id,
    });

    const order = apiResponse?.data;

    const { data: doctorResponse } = useQuery({
        queryKey: ["master-doctors"],
        queryFn: () => DoctorAPI.getList(1, 100),
    });

    const doctors = doctorResponse?.data || [];

    /* =====================
       MUTATIONS (ACTIONS)
    ===================== */
    const processMutation = useMutation({
        mutationFn: () => EmrLabAPI.process(id as string),
        onSuccess: () => {
            toast.success("Order Laboratorium sedang diproses");
            queryClient.invalidateQueries({ queryKey: ["emr-lab-detail", id] });
        },
    });

    const abortMutation = useMutation({
        mutationFn: () => EmrLabAPI.abort(id as string),
        onSuccess: () => {
            toast.error("Order Laboratorium dibatalkan");
            navigate(-1);
        },
    });

    const completeMutation = useMutation({
        mutationFn: () => EmrLabAPI.complete(id as string),
        onSuccess: () => {
            toast.success("Hasil laboratorium berhasil diselesaikan");
            setShowResultForm(false);
            queryClient.invalidateQueries({ queryKey: ["emr-lab-detail", id] });
        },
    });

    if (isLoading) return <LoadingSkeleton lines={20} />;

    if (isError || !order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-bold">Data Laboratorium Tidak Ditemukan</h3>
                <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* ================= MAIN CONTENT ================= */}
            <div className="col-span-12 lg:col-span-8 space-y-6">

                {/* ORDER INFO */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-indigo-600">
                                <Beaker className="w-5 h-5" />
                                Detail Order Laboratorium
                            </CardTitle>
                            <CardDescription>No. Order: {order.no_order}</CardDescription>
                        </div>
                        <Badge variant={order.status === 'selesai' ? 'success' : 'info'}>
                            {order.status.toUpperCase()}
                        </Badge>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <Info label="Tanggal Order">{order.created_at}</Info>
                        <Info label="Dokter Pengirim">
                            <Badge variant="info">
                                <User className="w-3 h-3 mr-1" />
                                {order.dokter?.nama}
                            </Badge>
                        </Info>
                        <div className="md:col-span-2">
                            <Label className="mb-2 block">Daftar Item Pemeriksaan</Label>
                            <div className="border rounded-lg divide-y overflow-hidden">
                                <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-xs font-bold uppercase text-muted-foreground">
                                    <div className="col-span-5">Nama Pemeriksaan</div>
                                    <div className="col-span-3">Rentang Normal</div>
                                    <div className="col-span-2">Satuan</div>
                                    <div className="col-span-2 text-right">Status</div>
                                </div>
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="p-3 grid grid-cols-12 gap-2 items-center text-sm">
                                        <div className="col-span-5 font-medium">
                                            {item.nama_test} <span className="text-xs text-muted-foreground block">{item.kode_test}</span>
                                        </div>
                                        <div className="col-span-3 text-xs">{item.rentang_normal || "-"}</div>
                                        <div className="col-span-2 text-xs">{item.satuan_test || "-"}</div>
                                        <div className="col-span-2 text-right">
                                            <Badge variant="outline" className="text-[10px]">{item.status}</Badge>
                                        </div>
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

                {/* HASIL / CATATAN (JIKA ADA) */}
                {order.catatan && (
                    <Card className="border-indigo-100 bg-indigo-50/20">
                        <CardHeader>
                            <CardTitle className="text-indigo-700 flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4" /> Catatan Laboratorium
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm italic">"{order.catatan}"</p>
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
                                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => processMutation.mutate()}
                                disabled={processMutation.isPending}
                            >
                                <PlayCircle className="w-4 h-4" /> Proses Sekarang
                            </Button>
                        )}

                        {order.status === "proses" && !showResultForm && (
                            <Button
                                className="w-full gap-2 bg-green-600 hover:bg-green-700"
                                onClick={() => setShowResultForm(true)}
                            >
                                <CheckCircle2 className="w-4 h-4" /> Verifikasi & Selesai
                            </Button>
                        )}

                        <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Button>

                        <Separator />

                        {order.status !== "selesai" && order.status !== "dibatalkan" && (
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
                                        <AlertDialogTitle>Batalkan Order Lab?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Order <strong>{order.no_order}</strong> untuk pasien {order.pasien?.nama} akan dibatalkan. Tindakan ini tidak dapat diulang.
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
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${order.status === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <FlaskConical className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status Pemeriksaan</p>
                            <h3 className="text-xl font-bold capitalize">{order.status}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t pt-4 text-xs">
                            <Summary label="Order" ok={true} />
                            <Summary label="Selesai" ok={order.status === "selesai"} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ================= MODAL FORM COMPLETE ================= */}
            <Dialog open={showResultForm} onOpenChange={setShowResultForm}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Selesaikan Order Lab</DialogTitle>
                        <DialogDescription>Pastikan seluruh item tes telah divalidasi oleh dokter analis.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Petugas Verifikator / Dokter Lab</Label>
                            <Select
                                value={formData.dokter_lab_id}
                                onValueChange={(v) => setFormData({ ...formData, dokter_lab_id: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Dokter/Analis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doc: any) => (
                                        <SelectItem key={doc.id} value={doc.id.toString()}>{doc.nama_dokter}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex gap-3 text-amber-800 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Dengan menekan tombol simpan, status order akan berubah menjadi <strong>Selesai</strong> dan hasil akan dikirim ke dokter pengirim.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowResultForm(false)}>Batal</Button>
                        <Button onClick={() => completeMutation.mutate()} className="bg-green-600" disabled={completeMutation.isPending}>
                            {completeMutation.isPending ? "Memproses..." : "Simpan & Selesaikan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

/* =====================
   Helpers
===================== */
function Info({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className="flex flex-col space-y-1">
            <Label className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">{label}</Label>
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