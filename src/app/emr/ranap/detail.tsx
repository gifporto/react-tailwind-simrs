"use client"

import React, { useState, useEffect, Activity } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { RanapAPI } from "@/lib/api"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
    Bed, User, Phone, Clock, ArrowLeft, InfoIcon, AlertCircle, Mars, Venus, Check, X, MapPin,
    Stethoscope,
    Radio,
    FlaskConical,
    ActivityIcon,
    HeartCrack,
    CopyPlus
} from "lucide-react"
import OrderRadiologi from "@/components/orderRadiologi"
import OrderLab from "@/components/orderLab"
import KunjunganLayanan from "@/components/kunjunganLayanan"
import KunjunganUnit from "@/components/kunjunganUnit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSkeleton from "@/components/LoadingSkeleton"
import TtvPage from "@/components/ttv"
import CpptPage from "@/components/cppt"

export default function RanapDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data: apiResponse, isLoading, isError } = useQuery({
        queryKey: ["ranap-detail", id],
        queryFn: () => RanapAPI.getDetail(id as string),
        enabled: !!id,
    })

    const data = apiResponse?.data

    const formatDate = (dateString: string) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    // State untuk menyimpan tab yang aktif
    const [activeTab, setActiveTab] = useState("layanan")

    // Load tab aktif dari localStorage saat komponen pertama kali dimuat
    useEffect(() => {
        const savedTab = localStorage.getItem(`ranap_tab_${id}`)
        if (savedTab) {
            setActiveTab(savedTab)
        }
    }, [id])

    // Fungsi untuk mengubah tab dan menyimpannya ke localStorage
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        localStorage.setItem(`ranap_tab_${id}`, value)
    }

    if (isLoading) return 
    <div>
        <LoadingSkeleton lines={6}/>
    </div>

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-bold">Data Tidak Ditemukan</h3>
                <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* INFO REGISTRASI */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bed className="w-5 h-5 text-primary" />
                            Detail Registrasi Ranap
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <Info label="No. Registrasi">
                            <Badge>{data.no_reg}</Badge>
                        </Info>
                        <Info label="Waktu Masuk">
                            <p>{formatDate(data.tgl_periksa)}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {data.jam}
                            </p>
                        </Info>
                        <Info label="Ruang / Poli">{data.poli?.desk_poli || "-"}</Info>
                        <Info label="Dokter DPJP">{data.dokter?.karyawan?.nama || "-"}</Info>
                        <Info label="Tipe Pasien">
                            <Badge variant="secondary">{data.tipe_pasien?.desk_tipe_pasien || "-"}</Badge>
                        </Info>
                        <Info label="Cara Masuk">{data.cara_masuk?.desk_cara_masuk || "-"}</Info>
                    </CardContent>
                </Card>

                {/* INFO PASIEN */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Data Pasien
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <Info label="Nama Pasien">
                            <p className="font-bold uppercase">{data.pasien?.nama}</p>
                            <p className="text-xs text-muted-foreground">RM: {data.pasien?.norm}</p>
                        </Info>
                        <Info label="NIK / No. BPJS">
                            <p className="text-sm">NIK: {data.pasien?.nik || "-"}</p>
                            <p className="text-sm text-blue-600">BPJS: {data.pasien?.no_bpjs || "-"}</p>
                        </Info>
                        <Info label="Jenis Kelamin">
                            {data.pasien?.sex === "L" ? "Laki-laki" : "Perempuan"}
                        </Info>
                        <Info label="Kontak">
                            <p className="flex items-center gap-1 text-green-600">
                                <Phone className="w-3 h-3" /> {data.pasien?.hp || "-"}
                            </p>
                        </Info>
                        <Info label="Alamat Domisili" className="md:col-span-2">
                            <p className="text-sm"><MapPin className="inline w-3 h-3 mr-1" /> {data.pasien?.alamat_domisili || "-"}</p>
                        </Info>
                    </CardContent>
                </Card>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Aksi</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full gap-2" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Button>
                        <Separator />
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <Label className="text-[10px] uppercase text-muted-foreground">Penanggung Jawab</Label>
                            <p className="text-sm font-medium">{data.nama_penanggung}</p>
                            <p className="text-xs text-muted-foreground">{data.hp_penanggung}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Status Integrasi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs">SatuSehat (IHS)</span>
                            {data.pasien?.ihs_number ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Antrean Online</span>
                            {data.antrol_terkirim ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* BAGIAN FITUR TABS */}
            <div className="col-span-12">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="w-full flex flex-wrap md:flex-row h-auto">
                        <TabsTrigger value="layanan" className="gap-2 py-2">
                            <ActivityIcon className="w-4 h-4" /> Tindakan
                        </TabsTrigger>
                        <TabsTrigger value="unit" className="gap-2 py-2">
                            <Stethoscope className="w-4 h-4" /> Kunjungan Unit
                        </TabsTrigger>
                        <TabsTrigger value="radiologi" className="gap-2 py-2">
                            <Radio className="w-4 h-4" /> Order Radiologi
                        </TabsTrigger>
                        <TabsTrigger value="lab" className="gap-2 py-2">
                            <FlaskConical className="w-4 h-4" /> Order Lab
                        </TabsTrigger>
                        <TabsTrigger value="ttv" className="gap-2 py-2">
                            <HeartCrack className="w-4 h-4" /> TTV
                        </TabsTrigger>
                        <TabsTrigger value="cppt" className="gap-2 py-2">
                            <CopyPlus className="w-4 h-4" /> CPPT
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="layanan">
                        <KunjunganLayanan api="RanapAPI" />
                    </TabsContent>
                    <TabsContent value="unit">
                        <KunjunganUnit api="RanapAPI" />
                    </TabsContent>
                    <TabsContent value="radiologi">
                        <OrderRadiologi api="RanapAPI" />
                    </TabsContent>
                    <TabsContent value="lab">
                        <OrderLab api="RanapAPI" />
                    </TabsContent>
                    <TabsContent value="ttv">
                        <TtvPage />
                    </TabsContent>
                    <TabsContent value="cppt">
                        <CpptPage />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function Info({ label, children, className = "flex flex-col space-y-1" }: { label: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <Label className="text-muted-foreground font-normal">{label}</Label>
            <div className="font-medium text-sm">{children}</div>
        </div>
    )
}