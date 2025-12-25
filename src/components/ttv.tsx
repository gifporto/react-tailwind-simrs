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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Icons
import {
    Thermometer, HeartPulse, Plus, Clock,
    User, Loader2, Activity, Wind, Brain, Ruler, Weight, Droplets, Stethoscope, Pill,
    Trash2
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
    const [deleteConfig, setDeleteConfig] = useState<{ id: string, type: string } | null>(null)
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

    const mutationConfig = (key: string, message: string = "Data berhasil diproses") => ({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key, id] })
            toast.success(message)
            closeModal()
            setDeleteConfig(null)
        },
        onError: () => toast.error("Terjadi kesalahan sistem")
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

    // Delete Mutations
    const deleteSuhu = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteSuhu(id!, sid), ...mutationConfig("ranap-suhu", "Data suhu dihapus") })
    const deleteTensi = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteTensi(id!, sid), ...mutationConfig("ranap-tensi", "Data tensi dihapus") })
    const deleteNadi = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteNadi(id!, sid), ...mutationConfig("ranap-nadi", "Data nadi dihapus") })
    const deleteResp = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteRespiration(id!, sid), ...mutationConfig("ranap-respirasi", "Data respirasi dihapus") })
    const deleteNyeri = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteNyeri(id!, sid), ...mutationConfig("ranap-nyeri", "Data nyeri dihapus") })
    const deleteTb = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteTinggiBadan(id!, sid), ...mutationConfig("ranap-tb", "Data TB dihapus") })
    const deleteBb = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteBeratBadan(id!, sid), ...mutationConfig("ranap-bb", "Data BB dihapus") })
    const deleteSpo = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteSpo(id!, sid), ...mutationConfig("ranap-spo", "Data SpO2 dihapus") })
    const deleteInter = useMutation({ mutationFn: (sid: string) => RanapAPI.deleteIntervensi(id!, sid), ...mutationConfig("ranap-intervensi", "Intervensi dihapus") })

    const handleConfirmDelete = () => {
        if (!deleteConfig) return
        const { id: targetId, type } = deleteConfig
        const mapper: any = {
            suhu: deleteSuhu, tensi: deleteTensi, nadi: deleteNadi, respirasi: deleteResp,
            nyeri: deleteNyeri, tb: deleteTb, bb: deleteBb, spo2: deleteSpo, intervensi: deleteInter
        }
        mapper[type]?.mutate(targetId)
    }

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
                    {suhuRes?.data?.map((item: any) => <LogCard key={item.id} value={`${item.hasil}`} unit="°C" date={item.tgl} user={item.created_by} isWarning={parseFloat(item.hasil) >= 37.5} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "suhu"})} />)}
                </TtvSection>

                <TtvSection title="Tekanan Darah" icon={<HeartPulse className="text-red-500 w-5 h-5" />} onAdd={() => setModalType("tensi")} isLoading={loadingTensi} data={tensiRes?.data} isTensi>
                    {tensiRes?.data?.map((item: any) => <LogCard key={item.id} value={`${item.hasil_sistole}/${item.hasil_diastole}`} unit="mmHg" date={item.tgl} user={item.created_by} isWarning={item.hasil_sistole >= 140} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "tensi"})} />)}
                </TtvSection>

                <TtvSection title="Denyut Nadi" icon={<Activity className="text-emerald-500 w-5 h-5" />} onAdd={() => setModalType("nadi")} isLoading={loadingNadi} data={nadiRes?.data}>
                    {nadiRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="bpm" date={item.tgl} user={item.created_by} isWarning={item.hasil > 100} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "nadi"})} />)}
                </TtvSection>

                <TtvSection title="Laju Napas" icon={<Wind className="text-blue-500 w-5 h-5" />} onAdd={() => setModalType("respirasi")} isLoading={loadingResp} data={respRes?.data}>
                    {respRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="x/mnt" date={item.tgl} user={item.created_by} isWarning={item.hasil > 24} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "respirasi"})} />)}
                </TtvSection>

                <TtvSection title="Skala Nyeri" icon={<Brain className="text-purple-500 w-5 h-5" />} onAdd={() => setModalType("nyeri")} isLoading={loadingNyeri} data={nyeriRes?.data}>
                    {nyeriRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="/10" date={item.tgl} user={item.created_by} isWarning={item.hasil >= 7} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "nyeri"})} />)}
                </TtvSection>

                <TtvSection title="SpO2" icon={<Droplets className="text-cyan-500 w-5 h-5" />} onAdd={() => setModalType("spo2")} isLoading={loadingSpo} data={spoRes?.data}>
                    {spoRes?.data?.map((item: any) => <LogCard key={item.id} value={`${item.hasil}`} unit="%"  date={item.tgl} user={item.created_by} isWarning={parseFloat(item.hasil) < 95} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "spo2"})} />)}
                </TtvSection>

                <TtvSection title="Tinggi Badan" icon={<Ruler className="text-slate-500 w-5 h-5" />} onAdd={() => setModalType("tb")} isLoading={loadingTb} data={tbRes?.data}>
                    {tbRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="cm" date={item.tgl} user={item.created_by} isWarning={false} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "tb"})} />)}
                </TtvSection>

                <TtvSection title="Berat Badan" icon={<Weight className="text-slate-500 w-5 h-5" />} onAdd={() => setModalType("bb")} isLoading={loadingBb} data={bbRes?.data}>
                    {bbRes?.data?.map((item: any) => <LogCard key={item.id} value={item.hasil} unit="kg" date={item.tgl} user={item.created_by} isWarning={false} deletedBy={item.deleted_by} onDelete={() => setDeleteConfig({id: item.id, type: "bb"})} />)}
                </TtvSection>
            </div>

            {/* Intervensi Nyeri Section */}
            <div className="pt-4">
                <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border-b font-semibold text-sm">
                        <div className="flex items-center gap-2"><Stethoscope className="text-primary w-5 h-5" /> Intervensi Nyeri</div>
                        <Button variant="outline" size="sm" onClick={() => setModalType("intervensi")} className="h-8 rounded-full shadow-sm"><Plus className="w-4 h-4" /> Tambah Intervensi</Button>
                    </div>
                    <CardContent className="p-0">
                        {loadingInter ? <div className="p-6"><LoadingSkeleton lines={4} /></div> : (
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {interRes?.data?.length > 0 ? interRes.data.map((item: any) => (
                                    <div key={item.id} className={`p-4 relative group transition-colors ${item.deleted_by ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                                        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${item.deleted_by ? 'line-through opacity-40 select-none' : ''}`}>
                                            <div className="lg:col-span-3 space-y-1 border-r pr-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase"><Clock className="w-3 h-3" /> {new Date(item.tgl).toLocaleString('id-ID')}</div>
                                                <div className="text-[9px] font-bold uppercase text-primary border px-2 py-0.5 rounded-md inline-block">Input: {item.created_by}</div>
                                            </div>
                                            <div className="lg:col-span-4 grid grid-cols-2 gap-x-3 text-[11px] border-r pr-4">
                                                <Label className="col-span-2 text-[9px] uppercase font-black text-primary mb-1">Vital Signs</Label>
                                                <div className="flex justify-between border-b border-dotted py-0.5"><span>TD:</span> <b>{item.vital_signs.sistole}/{item.vital_signs.diastole}</b></div>
                                                <div className="flex justify-between border-b border-dotted py-0.5"><span>Suhu:</span> <b>{item.vital_signs.suhu}°C</b></div>
                                                <div className="flex justify-between border-b border-dotted py-0.5"><span>Nadi:</span> <b>{item.vital_signs.nadi}</b></div>
                                                <div className="flex justify-between border-b border-dotted py-0.5"><span>Nyeri:</span> <b>{item.vital_signs.skala_nyeri}/10</b></div>
                                            </div>
                                            <div className="lg:col-span-5 space-y-2">
                                                <div><Label className="text-[9px] font-bold text-emerald-600 uppercase">Farmakologi</Label><p className="text-xs font-semibold">{item.farmakologi.nama_obat} <span className="text-muted-foreground text-[10px]">({item.farmakologi.dosis})</span></p></div>
                                                <div className="bg-amber-50 p-2 rounded border border-amber-100"><Label className="text-[9px] font-bold text-amber-700 uppercase">Evaluasi</Label><p className="text-xs text-slate-700">{item.pengkajian_ulang}</p></div>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            {item.deleted_by ? (
                                                <div className="text-[8px] font-black bg-destructive/10 text-destructive border border-destructive/20 px-2 py-1 rounded uppercase italic shadow-sm">Deleted By: {item.deleted_by}</div>
                                            ) : (
                                                <Button size="icon" variant="destructive" onClick={() => setDeleteConfig({id: item.id, type: "intervensi"})} className="opacity-0 group-hover:opacity-100 w-6 h-6 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></Button>
                                            )}
                                        </div>
                                    </div>
                                )) : <div className="p-10 text-center text-xs text-muted-foreground italic">Belum ada data intervensi.</div>}
                            </div>
                        )}
                    </CardContent>
                </div>
            </div>

            {/* AlertDialog for Delete */}
            <AlertDialog open={!!deleteConfig} onOpenChange={() => setDeleteConfig(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2"><Trash2 className="text-destructive w-5 h-5"/> Konfirmasi Penghapusan</AlertDialogTitle>
                        <AlertDialogDescription>Apakah Anda yakin ingin menghapus data ini? Data yang dihapus akan tetap tampil di riwayat namun ditandai sebagai data tidak valid.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90 text-white shadow-md">Ya, Hapus Data</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                                        <div className="space-y-1"><Label className="text-[10px] uppercase">Nyeri</Label><Input type="number" min="0" max="10" value={formValues.nyeri} onChange={(e) => updateForm("nyeri", e.target.value)} required /></div>
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

// --- Internal Component: LogCard ---
function LogCard({ value, unit, date, user, isWarning, deletedBy, onDelete }: any) {
    return (
        <div className={`relative group px-4 py-3 transition-all border-b last:border-0 ${deletedBy ? 'bg-slate-50/50' : 'hover:bg-accent/10'}`}>
            <div className={`space-y-1 ${deletedBy ? 'line-through opacity-30 select-none grayscale' : ''}`}>
                <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-black tracking-tighter ${isWarning && !deletedBy ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
                        {unit && <span className="text-[10px] text-muted-foreground font-bold uppercase">{unit}</span>}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-medium flex items-center gap-1 uppercase bg-muted px-1.5 py-0.5 rounded shadow-sm"><User className="w-2.5 h-2.5" /> {user}</div>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-wide">
                    <Clock className="w-2.5 h-2.5" /> {new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                </div>
            </div>
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                {deletedBy ? (
                    <div className="text-[8px] font-black bg-destructive/5 text-destructive border border-destructive/10 px-1 rounded uppercase italic">Deleted: {deletedBy}</div>
                ) : (
                    <Button size="icon" variant="destructive" onClick={onDelete} className="opacity-0 group-hover:opacity-100 w-6 h-6 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></Button>
                )}
            </div>
        </div>
    )
}

// --- Internal Component: TtvSection ---
function TtvSection({ title, icon, onAdd, isLoading, children, data, isTensi }: any) {
    return (
        <div className="border rounded-md overflow-hidden bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-3 shrink-0 bg-slate-50 border-b">
                <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider text-slate-600">{icon} {title}</div>
                <Button variant="ghost" size="icon" onClick={onAdd} className="h-6 w-6 rounded-full bg-white shadow-sm border hover:bg-primary hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /></Button>
            </div>
            {!isLoading && data && data.length > 0 && (
                <div className="border-b bg-slate-50/20 h-[85px]"><TtvChart data={data.filter((d: any) => !d.deleted_by)} isTensi={isTensi} /></div>
            )}
            <div className="flex-1 overflow-y-auto max-h-[250px] custom-scrollbar divide-y">{isLoading ? <div className="p-4"><LoadingSkeleton lines={2} /></div> : children}</div>
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
        // --- HILANGKAN BORDER DAN ATUR GARIS VERTIKAL ---
        grid: {
            show: isTensi, 
            xaxis: {
                lines: { show: true } 
            },
            yaxis: {
                lines: { show: false } // Pastikan garis horizontal tidak muncul
            },
            strokeDashArray: 2, 
        },
        xaxis: {
            categories: categories,
            axisBorder: { show: false }, // Hilangkan garis bawah (X-axis line)
            axisTicks: { show: false },  // Hilangkan tanda centang sumbu
            crosshairs: {
                show: true,
                width: 1,
                stroke: {
                    color: '#cbd5e1',
                    dashArray: 0
                }
            }
        },
        yaxis: {
            show: false,
            axisBorder: { show: false }, // Hilangkan garis samping (Y-axis line)
            axisTicks: { show: true }
        },
        // ----------------------------------------------
        markers: {
            size: 3,
            strokeWidth: 0,
            hover: { size: 5 }
        },
        colors: isTensi ? ["#FF9D00", "#0D4FB8"] : ["#0D4FB8"],
        tooltip: {
            fixed: { enabled: false },
            x: { show: true },
            y: { title: { formatter: (name: string) => name } },
            marker: { show: true }
        },
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0 },
        },
    };

    return <Chart options={options} series={series} type="area" height={80} />
}