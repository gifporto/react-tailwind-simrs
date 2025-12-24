"use client"

import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RanapAPI } from "@/lib/api"
import Chart from "react-apexcharts"

// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

// Icons
import {
    Thermometer, HeartPulse, Plus, Clock,
    User, Loader2, Activity, Wind, Brain, Ruler, Weight, Droplets, Stethoscope, Pill
} from "lucide-react"
import { toast } from "sonner"
import LoadingSkeleton from "./LoadingSkeleton"

// Define types for better TS support
type ModalType = "suhu" | "tensi" | "nadi" | "respirasi" | "nyeri" | "tb" | "bb" | "spo2" | "intervensi" | null

export default function TtvPage() {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()

    // Modal & Form States
    const [modalType, setModalType] = useState<ModalType>(null)
    const [formValues, setFormValues] = useState({
        suhu: "",
        sistolik: "",
        diastolik: "",
        nadi: "",
        respirasi: "",
        nyeri: "",
        tb: "",
        bb: "",
        spo2: "",
        // Form Intervensi Nyeri
        sedasi: "",
        namaObat: "",
        dosis: "",
        nonFarmakologi: "",
        pengkajianUlang: ""
    })

    // --- Data Fetching ---
    const fetchQuery = (key: string, fn: any) => useQuery({
        queryKey: [key, id],
        queryFn: () => fn(id as string),
        enabled: !!id,
    })

    const { data: suhuRes, isLoading: loadingSuhu } = fetchQuery("ranap-suhu", RanapAPI.getSuhu)
    const { data: tensiRes, isLoading: loadingTensi } = fetchQuery("ranap-tensi", RanapAPI.getTensi)
    const { data: nadiRes, isLoading: loadingNadi } = fetchQuery("ranap-nadi", RanapAPI.getNadi)
    const { data: respRes, isLoading: loadingResp } = fetchQuery("ranap-respirasi", RanapAPI.getRespiration)
    const { data: nyeriRes, isLoading: loadingNyeri } = fetchQuery("ranap-nyeri", RanapAPI.getNyeri)
    const { data: tbRes, isLoading: loadingTb } = fetchQuery("ranap-tb", RanapAPI.getTinggiBadan)
    const { data: bbRes, isLoading: loadingBb } = fetchQuery("ranap-bb", RanapAPI.getBeratBadan)
    const { data: spoRes, isLoading: loadingSpo } = fetchQuery("ranap-spo", RanapAPI.getSpo)
    const { data: interRes, isLoading: loadingInter } = fetchQuery("ranap-intervensi", RanapAPI.getIntervensi)

    // --- Mutations ---
    const mutationConfig = (key: string) => ({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key, id] })
            toast.success("Data berhasil dicatat")
            closeModal()
        },
        onError: () => toast.error("Gagal menyimpan data")
    })

    const createSuhu = useMutation({ mutationFn: (val: any) => RanapAPI.createSuhu(id!, val), ...mutationConfig("ranap-suhu") })
    const createTensi = useMutation({ mutationFn: (val: any) => RanapAPI.createTensi(id!, val), ...mutationConfig("ranap-tensi") })
    const createNadi = useMutation({ mutationFn: (val: any) => RanapAPI.createNadi(id!, val), ...mutationConfig("ranap-nadi") })
    const createResp = useMutation({ mutationFn: (val: any) => RanapAPI.createRespiration(id!, val), ...mutationConfig("ranap-respirasi") })
    const createNyeri = useMutation({ mutationFn: (val: any) => RanapAPI.createNyeri(id!, val), ...mutationConfig("ranap-nyeri") })
    const createTb = useMutation({ mutationFn: (val: any) => RanapAPI.createTinggiBadan(id!, val), ...mutationConfig("ranap-tb") })
    const createBb = useMutation({ mutationFn: (val: any) => RanapAPI.createBeratBadan(id!, val), ...mutationConfig("ranap-bb") })
    const createSpo = useMutation({ mutationFn: (val: any) => RanapAPI.createSpo(id!, val), ...mutationConfig("ranap-spo") })
    const createInter = useMutation({ mutationFn: (val: any) => RanapAPI.createIntervensi(id!, val), ...mutationConfig("ranap-intervensi") })

    const closeModal = () => {
        setModalType(null)
        setFormValues({ 
            suhu: "", sistolik: "", diastolik: "", nadi: "", respirasi: "", nyeri: "", tb: "", bb: "", spo2: "",
            sedasi: "", namaObat: "", dosis: "", nonFarmakologi: "", pengkajianUlang: ""
        })
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = (val: string) => ({ hasil: parseFloat(val) })

        if (modalType === "suhu") createSuhu.mutate(payload(formValues.suhu))
        if (modalType === "tensi") createTensi.mutate({ sistolik: parseInt(formValues.sistolik), diastolik: parseInt(formValues.diastolik) })
        if (modalType === "nadi") createNadi.mutate(payload(formValues.nadi))
        if (modalType === "respirasi") createResp.mutate(payload(formValues.respirasi))
        if (modalType === "nyeri") createNyeri.mutate(payload(formValues.nyeri))
        if (modalType === "tb") createTb.mutate(payload(formValues.tb))
        if (modalType === "bb") createBb.mutate(payload(formValues.bb))
        if (modalType === "spo2") createSpo.mutate(payload(formValues.spo2))
        if (modalType === "intervensi") {
            createInter.mutate({
                sistole: parseInt(formValues.sistolik),
                diastole: parseInt(formValues.diastolik),
                nadi: parseInt(formValues.nadi),
                suhu: parseFloat(formValues.suhu),
                respiration_rate: parseInt(formValues.respirasi),
                skala_nyeri: parseInt(formValues.nyeri),
                skor_sedasi: parseInt(formValues.sedasi),
                nama_obat: formValues.namaObat,
                dosis: formValues.dosis,
                intervensi_non_farmakologi: formValues.nonFarmakologi,
                pengkajian_ulang: formValues.pengkajianUlang
            })
        }
    }

    const updateForm = (key: keyof typeof formValues, val: string) => {
        setFormValues(prev => ({ ...prev, [key]: val }))
    }

    return (
        <div className="py-6 space-y-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Tanda-Tanda Vital</h1>
                <p className="text-muted-foreground font-medium">Monitoring kesehatan rutin pasien rawat inap.</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TtvSection title="Suhu Tubuh" icon={<Thermometer className="text-orange-500 w-5 h-5" />} onAdd={() => setModalType("suhu")} isLoading={loadingSuhu} data={suhuRes?.data}>
                    {suhuRes?.data?.map((item: any) => <LogCard key={item.id} value={`${item.hasil}°C`} date={item.tgl} user={item.created_by} isWarning={parseFloat(item.hasil) >= 37.5} />)}
                </TtvSection>

                <TtvSection title="Tekanan Darah" icon={<HeartPulse className="text-red-500 w-5 h-5" />} onAdd={() => setModalType("tensi")} isLoading={loadingTensi} data={tensiRes?.data} isTensi>
                    {tensiRes?.data?.map((item: any) => <LogCard key={item.id} value={`${item.hasil_sistole}/${item.hasil_diastole}`} unit="mmHg" date={item.tgl} user={item.created_by} isWarning={item.hasil_sistole >= 140 || item.hasil_sistole <= 90} />)}
                </TtvSection>

                <TtvSection title="Denyut Nadi" icon={<Activity className="text-emerald-500 w-5 h-5" />} onAdd={() => setModalType("nadi")} isLoading={loadingNadi} data={nadiRes?.data}>
                    {nadiRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="bpm" date={item.tgl} user={item.created_by} isWarning={item.hasil > 100 || item.hasil < 60} />)}
                </TtvSection>

                <TtvSection title="Laju Napas" icon={<Wind className="text-blue-500 w-5 h-5" />} onAdd={() => setModalType("respirasi")} isLoading={loadingResp} data={respRes?.data}>
                    {respRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="x/mnt" date={item.tgl} user={item.created_by} isWarning={item.hasil > 24} />)}
                </TtvSection>

                <TtvSection title="Skala Nyeri" icon={<Brain className="text-purple-500 w-5 h-5" />} onAdd={() => setModalType("nyeri")} isLoading={loadingNyeri} data={nyeriRes?.data}>
                    {nyeriRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="/10" date={item.tgl} user={item.created_by} isWarning={item.hasil >= 7} />)}
                </TtvSection>

                <TtvSection title="SpO2" icon={<Droplets className="text-cyan-500 w-5 h-5" />} onAdd={() => setModalType("spo2")} isLoading={loadingSpo} data={spoRes?.data}>
                    {spoRes?.data?.map((item: any) => <LogCard key={item.id} value={`${item.hasil}%`} date={item.tgl} user={item.created_by} isWarning={parseFloat(item.hasil) < 95} />)}
                </TtvSection>

                <TtvSection title="Tinggi Badan" icon={<Ruler className="text-slate-500 w-5 h-5" />} onAdd={() => setModalType("tb")} isLoading={loadingTb} data={tbRes?.data}>
                    {tbRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="cm" date={item.tgl} user={item.created_by} isWarning={false} />)}
                </TtvSection>

                <TtvSection title="Berat Badan" icon={<Weight className="text-slate-500 w-5 h-5" />} onAdd={() => setModalType("bb")} isLoading={loadingBb} data={bbRes?.data}>
                    {bbRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="kg" date={item.tgl} user={item.created_by} isWarning={false} />)}
                </TtvSection>
            </div>

            {/* SECTION INTERVENSI NYERI */}
            <div className="pt-4">
                <div className="border rounded-md overflow-hidden bg-white">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border-b">
                        <div className="flex items-center gap-2 font-semibold text-sm">
                            <Stethoscope className="text-primary w-5 h-5" /> 
                            Intervensi Pengkajian Ulang Nyeri
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setModalType("intervensi")} className="h-8 gap-1 rounded-full">
                            <Plus className="w-4 h-4" /> Tambah Intervensi
                        </Button>
                    </div>
                    <CardContent className="p-0">
                        {loadingInter ? (
                            <div className="p-6"><LoadingSkeleton lines={4} /></div>
                        ) : (
                            <div className="divide-y max-h-[500px] overflow-y-auto custom-scrollbar">
                                {interRes?.data?.length > 0 ? interRes.data.map((item: any) => (
                                    <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                            <div className="lg:col-span-3 space-y-2 border-r pr-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.tgl).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="p-1.5 bg-muted rounded text-[9px] font-bold uppercase inline-flex items-center gap-1.5">
                                                    <User className="w-3 h-3" /> {item.created_by}
                                                </div>
                                            </div>

                                            <div className="lg:col-span-4 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] border-r pr-4">
                                                <Label className="col-span-2 text-[9px] uppercase text-primary font-black mb-1">Vital Signs</Label>
                                                <div className="flex justify-between border-b border-dotted"><span>TD:</span> <b>{item.vital_signs.sistole}/{item.vital_signs.diastole}</b></div>
                                                <div className="flex justify-between border-b border-dotted"><span>Nadi:</span> <b>{item.vital_signs.nadi}</b></div>
                                                <div className="flex justify-between border-b border-dotted"><span>Suhu:</span> <b>{item.vital_signs.suhu}°C</b></div>
                                                <div className="flex justify-between border-b border-dotted"><span>RR:</span> <b>{item.vital_signs.respiration_rate}</b></div>
                                                <div className="flex justify-between border-b border-dotted"><span>Nyeri:</span> <b>{item.vital_signs.skala_nyeri}/10</b></div>
                                                <div className="flex justify-between border-b border-dotted"><span>Sedasi:</span> <b>{item.vital_signs.skor_sedasi}</b></div>
                                            </div>

                                            <div className="lg:col-span-5 space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-[9px] uppercase font-bold text-emerald-600 flex items-center gap-1">
                                                            <Pill className="w-2.5 h-2.5" /> Farmakologi
                                                        </Label>
                                                        <p className="text-xs font-semibold">{item.farmakologi.nama_obat} <span className="text-muted-foreground">({item.farmakologi.dosis})</span></p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-[9px] uppercase font-bold text-blue-600">Non-Farmakologi</Label>
                                                        <p className="text-xs italic text-muted-foreground">{item.intervensi_non_farmakologi || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="p-2 bg-amber-50 rounded border border-amber-100">
                                                    <Label className="text-[9px] uppercase font-bold text-amber-700">Pengkajian Ulang</Label>
                                                    <p className="text-xs mt-1 text-slate-700 leading-relaxed">{item.pengkajian_ulang}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-10 text-center text-xs text-muted-foreground">Belum ada data intervensi nyeri.</div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </div>
            </div>

            <Dialog open={!!modalType} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className={modalType === 'intervensi' ? "sm:max-w-[650px]" : "sm:max-w-[400px]"}>
                    <DialogHeader><DialogTitle className="capitalize font-bold">Input Data {modalType?.replace("-", " ")}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSave} className="space-y-5 py-2">
                        {modalType === "intervensi" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b pb-1">Vital Signs Terkini</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Sistolik</Label><Input type="number" value={formValues.sistolik} onChange={(e) => updateForm("sistolik", e.target.value)} required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Diastolik</Label><Input type="number" value={formValues.diastolik} onChange={(e) => updateForm("diastolik", e.target.value)} required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Nadi</Label><Input type="number" value={formValues.nadi} onChange={(e) => updateForm("nadi", e.target.value)} required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Suhu</Label><Input type="number" step="0.1" value={formValues.suhu} onChange={(e) => updateForm("suhu", e.target.value)} required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">RR</Label><Input type="number" value={formValues.respirasi} onChange={(e) => updateForm("respirasi", e.target.value)} required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Nyeri</Label><Input type="number" value={formValues.nyeri} onChange={(e) => updateForm("nyeri", e.target.value)} required /></div>
                                        <div className="space-y-1 col-span-2"><Label className="text-[10px] uppercase">Skor Sedasi</Label><Input type="number" value={formValues.sedasi} onChange={(e) => updateForm("sedasi", e.target.value)} required /></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest border-b pb-1">Intervensi & Evaluasi</h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Nama Obat</Label><Input value={formValues.namaObat} onChange={(e) => updateForm("namaObat", e.target.value)} placeholder="Contoh: Paracetamol" required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Dosis</Label><Input value={formValues.dosis} onChange={(e) => updateForm("dosis", e.target.value)} placeholder="500mg" required /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Non-Farmakologi</Label><Input value={formValues.nonFarmakologi} onChange={(e) => updateForm("nonFarmakologi", e.target.value)} placeholder="Cold compress" /></div>
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Pengkajian Ulang</Label>
                                            <textarea className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm" value={formValues.pengkajianUlang} onChange={(e) => updateForm("pengkajianUlang", e.target.value)} placeholder="Evaluasi kondisi..." required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {modalType === "suhu" && <div className="space-y-2"><Label>Suhu Tubuh (°C)</Label><Input type="number" step="0.1" value={formValues.suhu} onChange={(e) => updateForm("suhu", e.target.value)} required /></div>}
                                {modalType === "tensi" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Sistolik</Label><Input type="number" value={formValues.sistolik} onChange={(e) => updateForm("sistolik", e.target.value)} required /></div>
                                        <div className="space-y-2"><Label>Diastolik</Label><Input type="number" value={formValues.diastolik} onChange={(e) => updateForm("diastolik", e.target.value)} required /></div>
                                    </div>
                                )}
                                {modalType === "nadi" && <div className="space-y-2"><Label>Nadi (bpm)</Label><Input type="number" value={formValues.nadi} onChange={(e) => updateForm("nadi", e.target.value)} required /></div>}
                                {modalType === "respirasi" && <div className="space-y-2"><Label>Pernapasan (x/mnt)</Label><Input type="number" value={formValues.respirasi} onChange={(e) => updateForm("respirasi", e.target.value)} required /></div>}
                                {modalType === "nyeri" && <div className="space-y-2"><Label>Skala Nyeri (0-10)</Label><Input type="number" min="0" max="10" value={formValues.nyeri} onChange={(e) => updateForm("nyeri", e.target.value)} required /></div>}
                                {modalType === "spo2" && <div className="space-y-2"><Label>SpO2 (%)</Label><Input type="number" value={formValues.spo2} onChange={(e) => updateForm("spo2", e.target.value)} required /></div>}
                                {modalType === "tb" && <div className="space-y-2"><Label>Tinggi Badan (cm)</Label><Input type="number" value={formValues.tb} onChange={(e) => updateForm("tb", e.target.value)} required /></div>}
                                {modalType === "bb" && <div className="space-y-2"><Label>Berat Badan (kg)</Label><Input type="number" value={formValues.bb} onChange={(e) => updateForm("bb", e.target.value)} required /></div>}
                            </>
                        )}
                        <DialogFooter><Button type="submit" className="w-full">Simpan Data</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// --- Internal Components ---
interface TtvSectionProps { title: string; icon: React.ReactNode; onAdd: () => void; isLoading: boolean; children: React.ReactNode; data?: any[]; isTensi?: boolean }

function TtvSection({ title, icon, onAdd, isLoading, children, data, isTensi }: TtvSectionProps) {
    return (
        <div className=" border rounded-md overflow-hidden bg-white flex flex-col h-full">
            <div className="flex items-center justify-between p-3 shrink-0 bg-slate-50 border-b">
                <div className="flex items-center gap-2 font-semibold text-sm">{icon} {title}</div>
                <Button variant="ghost" size="icon" onClick={onAdd} className="h-7 w-7 rounded-full bg-white shadow-sm border"><Plus className="w-4 h-4" /></Button>
            </div>

            {/* CHART AREA */}
            {!isLoading && data && data.length > 0 && (
                <div className="border-b bg-slate-50/50">
                    <TtvChart data={data} isTensi={isTensi} />
                </div>
            )}

            <div className="relative flex-1 overflow-hidden">
                <div className="space-y-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-4"><LoadingSkeleton lines={3} /></div>
                    ) : (
                        <div className="divide-y">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function TtvChart({ data, isTensi }: { data: any[], isTensi?: boolean }) {
    const sortedData = [...data].reverse();

    const categories = sortedData.map(item => {
        const date = new Date(item.tgl);
        const dmy = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });
        const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return `${dmy} ${time}`;
    });

    const series = isTensi
        ? [
            { name: "Sistolik", data: sortedData.map(item => item.hasil_sistole) },
            { name: "Diastolik", data: sortedData.map(item => item.hasil_diastole) }
        ]
        : [
            { name: "Nilai", data: sortedData.map(item => parseFloat(item.hasil)) }
        ];

    const options: any = {
        chart: {
            id: "ttv-chart",
            toolbar: { show: false },
            sparkline: { enabled: true },
            fontFamily: "Inter, system-ui, sans-serif",
        },
        stroke: { curve: "smooth", width: 2 },
        grid: {
            show: isTensi,
            xaxis: {
                lines: { show: true } // Ini akan menarik garis vertikal di setiap titik waktu
            },
            yaxis: {
                lines: { show: false } // Ini akan menarik garis vertikal di setiap titik waktu
            },
        },
        colors: isTensi ? ["#005EFF", "#FF9000"] : ["#005EFF"],
        tooltip: {
            fixed: { enabled: false },
            x: { show: true },
            y: { title: { formatter: (name: string) => name } },
            marker: { show: false }
        },
        xaxis: { categories: categories },
        markers: {
            size: 2,
            hover: { size: 5 }
        },
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0 },
        },
    };

    return <Chart options={options} series={series} type="area" height={80} />
}

interface LogCardProps { value: string | number; unit?: string; date: string; user: string; isWarning: boolean }
function LogCard({ value, unit, date, user, isWarning }: LogCardProps) {
    return (
        <div className="shadow-none bg-card transition-colors hover:bg-accent/20 px-4 py-3 text-left">
            <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-black tracking-tighter ${isWarning ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
                        {unit && <span className="text-[10px] text-muted-foreground font-bold uppercase">{unit}</span>}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-medium flex items-center gap-1 uppercase bg-muted px-1.5 py-0.5 rounded">
                        <User className="w-2.5 h-2.5" /> {user}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-wider font-bold">
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </div>
    )
}