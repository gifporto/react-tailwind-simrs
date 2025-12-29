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
    Trash,
    RefreshCcw,
    Send,
} from "lucide-react";
import { toast } from "sonner";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, PlusCircle } from "lucide-react";

export default function EmrRadiologiDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [alertConfig, setAlertConfig] = useState<{
        open: boolean;
        title: string;
        description: string;
        action: () => void;
        variant: "default" | "destructive";
    }>({
        open: false,
        title: "",
        description: "",
        action: () => { },
        variant: "default"
    });

    const [detailForms, setDetailForms] = useState<{ [key: string]: any }>({});

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

    const publishMutation = useMutation({
        mutationFn: () => EmrRadiologyAPI.publish(id as string),
        onSuccess: () => {
            toast.success("Hasil radiologi telah dipublikasi");
            queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });
        },
    });

    const completeMutation = useMutation({
        mutationFn: () => EmrRadiologyAPI.complete(id as string, new FormData()), // Approve tanpa input body
        onSuccess: () => {
            toast.success("Order radiologi telah diselesaikan");
            queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });
        },
    });

    // Mutation untuk Restart Order
    const restartMutation = useMutation({
        mutationFn: () => EmrRadiologyAPI.restart(id as string),
        onSuccess: () => {
            toast.success("Order berhasil di-restart ke status Ordered");
            queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });
        },
        onError: () => toast.error("Gagal melakukan restart order")
    });

    // Mutation untuk Hapus File di Detail
    const deleteFileMutation = useMutation({
        mutationFn: ({ idDetail, fileName }: { idDetail: string, fileName: string }) =>
            EmrRadiologyAPI.deleteFile(id as string, idDetail, fileName),
        onSuccess: () => {
            toast.success("File berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });
        },
        onError: () => toast.error("Gagal menghapus file")
    });

    const openAlert = (title: string, description: string, action: () => void, variant: "default" | "destructive" = "default") => {
        setAlertConfig({ open: true, title, description, action, variant });
    };

    // Helper untuk konversi Base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Fungsi Handle Submit Per Detail
    const handleProcessDetail = async (idDetail: string) => {
        const data = detailForms[idDetail];
        if (!data?.dokter_radiologi_id) {
            toast.error("Pilih dokter radiologi terlebih dahulu");
            return;
        }

        try {
            const payload = {
                hasil: data.hasil,
                kesan: data.kesan,
                saran: data.saran,
                dokter_radiologi_id: data.dokter_radiologi_id,
                documents: data.documents || []
            };

            await EmrRadiologyAPI.processDetail(id as string, idDetail, payload);

            toast.success("Berhasil memproses detail pemeriksaan");

            // PENTING: Invalidate query untuk memicu fetch ulang data detail
            // Ini akan mengupdate status badge (misal dari PROSES ke SELESAI) 
            // dan memperbarui daftar file yang ada di server.
            await queryClient.invalidateQueries({ queryKey: ["emr-radiologi-detail", id] });

            // Opsional: Bersihkan list preview file lokal karena file sudah masuk ke server (item.hasil.documents)
            setDetailForms(prev => ({
                ...prev,
                [idDetail]: {
                    ...prev[idDetail],
                    documents: [],
                    filePreviews: []
                }
            }));

        } catch (error) {
            toast.error("Gagal memproses data");
        }
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
            case "published":
                return "default";
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
                            <CardTitle className="flex items-center gap-2 text-primary">
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
                            <Label className="mb-2 block">Daftar Pemeriksaan (Klik untuk isi hasil)</Label>
                            <Accordion type="single" collapsible className="w-full border rounded-lg px-4">
                                {order.details?.map((item: any) => {
                                    // Inisialisasi state jika belum ada (Old Value)
                                    if (!detailForms[item.id]) {
                                        setDetailForms(prev => ({
                                            ...prev,
                                            [item.id]: {
                                                hasil: item.hasil?.hasil || "",
                                                kesan: item.hasil?.kesan || "",
                                                saran: item.hasil?.saran || "",
                                                dokter_radiologi_id: item.hasil?.dokter_radiologi_id?.toString() || "",
                                                documents: [], // File baru selalu mulai dari kosong
                                                filePreviews: [] // Untuk UI penanda file terpilih
                                            }
                                        }));
                                    }

                                    const currentFormData = detailForms[item.id] || {};

                                    const isReadOnly = item.status.toLowerCase() === "selesai" || order.status.toLowerCase() === "ordered" || order.status.toLowerCase() === "publised";

                                    return (
                                        <AccordionItem key={item.id} value={item.id.toString()}>
                                            <AccordionTrigger className="hover:no-underline">
                                                <div className="flex justify-between items-center w-full pr-4">
                                                    <span className="text-sm font-medium">{item.pemeriksaan?.nama}</span>
                                                    <Badge className="text-[10px]" variant={`${getStatusVariant(item.status)}`}>
                                                        {item.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="border-t pt-4 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Dokter Radiologi</Label>
                                                        <Select
                                                            disabled={isReadOnly} // <--- Disable di sini
                                                            value={currentFormData.dokter_radiologi_id}
                                                            onValueChange={(v) => setDetailForms({
                                                                ...detailForms,
                                                                [item.id]: { ...currentFormData, dokter_radiologi_id: v }
                                                            })}
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
                                                        <Label>Hasil Pemeriksaan</Label>
                                                        <Textarea
                                                            disabled={isReadOnly} // <--- Disable di sini
                                                            value={currentFormData.hasil}
                                                            onChange={(e) => setDetailForms({
                                                                ...detailForms,
                                                                [item.id]: { ...currentFormData, hasil: e.target.value }
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Kesan</Label>
                                                        <Textarea
                                                            disabled={isReadOnly} // <--- Disable di sini
                                                            value={currentFormData.kesan}
                                                            onChange={(e) => setDetailForms({
                                                                ...detailForms,
                                                                [item.id]: { ...currentFormData, kesan: e.target.value }
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Saran</Label>
                                                        <Textarea
                                                            disabled={isReadOnly} // <--- Disable di sini
                                                            value={currentFormData.saran}
                                                            onChange={(e) => setDetailForms({
                                                                ...detailForms,
                                                                [item.id]: { ...currentFormData, saran: e.target.value }
                                                            })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* MULTI FILE INPUT SECTION */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Lampiran Gambar / Dokumen (Base64)</Label>
                                                        {!isReadOnly && ( // <--- Sembunyikan tombol upload jika ReadOnly
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 gap-1"
                                                                onClick={() => {
                                                                    const input = document.getElementById(`file-upload-${item.id}`) as HTMLInputElement;
                                                                    input?.click();
                                                                }}
                                                            >
                                                                <PlusCircle className="w-4 h-4" /> Tambah File
                                                            </Button>
                                                        )}
                                                        <input
                                                            id={`file-upload-${item.id}`}
                                                            type="file"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const base64 = await fileToBase64(file);
                                                                    setDetailForms({
                                                                        ...detailForms,
                                                                        [item.id]: {
                                                                            ...currentFormData,
                                                                            documents: [...(currentFormData.documents || []), base64],
                                                                            filePreviews: [...(currentFormData.filePreviews || []), file.name]
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                    {/* List File Preview (Hanya muncul jika bukan ReadOnly) */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {currentFormData.filePreviews?.map((name: string, idx: number) => (
                                                            <Badge key={idx} variant="secondary" className="gap-2">
                                                                {name}
                                                                {!isReadOnly && (
                                                                    <X className="w-3 h-3 cursor-pointer" onClick={() => {
                                                                        const newDocs = [...currentFormData.documents];
                                                                        const newPrevs = [...currentFormData.filePreviews];
                                                                        newDocs.splice(idx, 1);
                                                                        newPrevs.splice(idx, 1);
                                                                        setDetailForms({
                                                                            ...detailForms,
                                                                            [item.id]: { ...currentFormData, documents: newDocs, filePreviews: newPrevs }
                                                                        });
                                                                    }} />
                                                                )}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    {/* Tampilkan Old Documents */}
                                                    {item.hasil?.documents?.length > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-muted-foreground">File Terupload (Server):</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.hasil.documents.map((doc: any, idx: number) => (
                                                                    <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border text-[11px]">
                                                                        <a href={doc.url} target="_blank" className="text-blue-600 underline truncate max-w-[150px]">
                                                                            {doc.filename}
                                                                        </a>
                                                                        {!isReadOnly && (
                                                                            <button
                                                                                onClick={() => deleteFileMutation.mutate({
                                                                                    idDetail: item.id,
                                                                                    fileName: doc.filename
                                                                                })}
                                                                                className="text-destructive hover:text-red-700 ml-1"
                                                                                disabled={deleteFileMutation.isPending}
                                                                            >
                                                                                <Trash className="w-3 h-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Sembunyikan Button Simpan jika ReadOnly */}
                                                {!isReadOnly && (
                                                    <Button
                                                        className="w-full mt-2"
                                                        size="sm"
                                                        onClick={() => handleProcessDetail(item.id)}
                                                    >
                                                        Simpan Hasil {item.pemeriksaan?.nama}
                                                    </Button>
                                                )}

                                                {isReadOnly && item.status.toLowerCase() === "selesai" && (
                                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-xs justify-center">
                                                        <CheckCircle2 className="w-4 h-4" /> Hasil telah dikunci (Status Selesai)
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
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

            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Aksi Petugas</CardTitle></CardHeader>
                    <CardContent className="space-y-3">

                        {order.status === "ordered" && (
                            <Button className="w-full gap-2" onClick={() => openAlert("Proses Order", "Ubah status menjadi Proses?", () => processMutation.mutate())}>
                                <PlayCircle className="w-4 h-4" /> Proses Sekarang
                            </Button>
                        )}

                        {order.status === "proses" && (
                            <Button className="w-full bg-green-600 gap-2" onClick={() => openAlert("Selesaikan Order", "Apakah semua hasil sudah benar dan siap diselesaikan?", () => completeMutation.mutate())}>
                                <CheckCircle2 className="w-4 h-4" /> Approve & Selesai
                            </Button>
                        )}

                        {order.status === "selesai" && (
                            <Button className="w-full bg-indigo-600 gap-2 font-bold" onClick={() => openAlert("Publish Hasil", "Kirim hasil ini agar dapat dilihat oleh dokter pengirim?", () => publishMutation.mutate())}>
                                <Send className="w-4 h-4" /> Publish Hasil
                            </Button>
                        )}

                        {(order.status.toLowerCase() !== "ordered" && order.status.toLowerCase() !== "proses" && order.status.toLowerCase() !== "dibatalkan") && (
                            <Button variant="outline" className="w-full gap-2 text-yellow-600 border-yellow-200" onClick={() => openAlert("Restart Order", "Mengulang status ke Ordered akan menghapus status proses saat ini.", () => restartMutation.mutate())}>
                                <RefreshCcw className="w-4 h-4" /> Restart
                            </Button>
                        )}

                        <Separator />

                        {(order.status.toLowerCase() !== "published" && order.status.toLowerCase() !== "dibatalkan") && (
                            <Button variant="destructive" className="w-full gap-2" onClick={() => openAlert("Batalkan Order", "Tindakan ini permanen. Yakin?", () => abortMutation.mutate(), "destructive")}>
                                <Trash2 className="w-4 h-4" /> Batalkan Order
                            </Button>
                        )}

                        <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </Button>

                    </CardContent>
                </Card>

                {/* RINGKASAN STATUS */}
                <Card>
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${order.status === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
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

            <AlertDialog open={alertConfig.open} onOpenChange={(o) => setAlertConfig(prev => ({ ...prev, open: o }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={alertConfig.action}
                            className={alertConfig.variant === "destructive" ? "bg-destructive text-white" : ""}
                        >
                            Lanjutkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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