"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { RanapAPI } from "@/lib/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
    Plus, CheckCheck, MessageSquare, History, Clock, Edit3, Loader2, Trash2, AlertTriangle,
    Check, Copy,
    CopyPlus
} from "lucide-react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

/* =====================
   Types & Interfaces
===================== */
type CpptType = "SOAP" | "SBAR" | "ADIME"

interface CpptItem {
    id: number
    type: CpptType
    data: any
    notes: string | null
    verified_by: string | null
    verified_at: string | null
    created_by: string
    updated_by: string
    deleted_by: string | null
    created_at: string
    updated_at: string
}

export default function CpptPage() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [cpptData, setCpptData] = useState<CpptItem[]>([])

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNoteOpen, setIsNoteOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

    const [selectedType, setSelectedType] = useState<CpptType>("SOAP")
    const [formData, setFormData] = useState<any>({})
    const [isEditing, setIsEditing] = useState<number | null>(null)
    const [selectedIdForAction, setSelectedIdForAction] = useState<number | null>(null)
    const [noteValue, setNoteValue] = useState("")

    const fetchCppt = useCallback(async () => {
        if (!id) return
        setCpptData([])
        setLoading(true)
        try {
            const response = await RanapAPI.getCppt(id)
            setCpptData(response.data || [])
        } catch (error) {
            toast.error("Gagal memuat data CPPT")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchCppt()
    }, [fetchCppt])

    const handleSave = async () => {
        if (!id) return
        setActionLoading(true)
        try {
            const payload = { type: selectedType, ...formData }
            if (isEditing) {
                await RanapAPI.updateCppt(id, isEditing.toString(), payload)
                toast.success("CPPT berhasil diperbarui")
            } else {
                await RanapAPI.createCppt(id, payload)
                toast.success("CPPT berhasil ditambahkan")
            }
            setIsModalOpen(false)
            setFormData({})
            setIsEditing(null)
            await fetchCppt()
        } catch (error) {
            toast.error("Gagal menyimpan data")
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!id || !selectedIdForAction) return
        setActionLoading(true)
        try {
            await RanapAPI.deleteCppt(id, selectedIdForAction.toString(), {
                data: { type: selectedType }
            })
            toast.success("Catatan CPPT berhasil dihapus")
            setIsDeleteAlertOpen(false)
            await fetchCppt()
        } catch (error: any) {
            toast.error(error.response?.data?.meta?.message || "Gagal menghapus catatan")
        } finally {
            setActionLoading(false)
            setSelectedIdForAction(null)
        }
    }

    const handleVerify = async (cpptId: number, type: string) => {
        if (!id) return
        try {
            await RanapAPI.verifyCppt(id, cpptId.toString(), { type })
            toast.success("CPPT Terverifikasi")
            await fetchCppt()
        } catch (error) {
            toast.error("Gagal verifikasi")
        }
    }

    const handleSaveNote = async () => {
        if (!id || !selectedIdForAction) return
        setActionLoading(true)
        try {
            await RanapAPI.patchCppt(id, selectedIdForAction.toString(), {
                type: selectedType,
                notes: noteValue
            })
            toast.success("Catatan verifikasi berhasil disimpan")
            setIsNoteOpen(false)
            setNoteValue("")
            await fetchCppt()
        } catch (error) {
            toast.error("Gagal menyimpan catatan")
        } finally {
            setActionLoading(false)
        }
    }

    // Fungsi baru untuk menyalin data
    const handleCopy = (item: CpptItem) => {
        setIsEditing(null); // Set null karena ini akan menjadi entry baru (create)
        setSelectedType(item.type);
        setFormData({ ...item.data }); // Paste data dari item lama
        setIsModalOpen(true);
        toast.info(`Data ${item.type} disalin ke input baru`);
    }

    const renderCpptContent = (item: CpptItem) => {
        const d = item.data
        const isDeleted = !!item.deleted_by
        const contentClass = `space-y-1 ${isDeleted ? "line-through opacity-40 italic select-none" : ""}`

        const layouts = {
            SOAP: [
                { label: "S", value: d.subjective },
                { label: "O", value: d.objective },
                { label: "A", value: d.assessment },
                { label: "P", value: d.planning }
            ],
            SBAR: [
                { label: "S", value: d.situation },
                { label: "B", value: d.background },
                { label: "A", value: d.assessment },
                { label: "R", value: d.recommendation }
            ],
            ADIME: [
                { label: "A", value: d.assessment },
                { label: "D", value: d.diagnosis },
                { label: "I", value: d.intervention },
                { label: "ME", value: d.monitoring_evaluation }
            ]
        }

        return (
            <div className={contentClass}>
                {layouts[item.type].map((row, idx) => (
                    <p key={idx} className="text-sm">
                        <span className="font-bold">{row.label}:</span> {row.value}
                    </p>
                ))}
            </div>
        )
    }

    return (
        <div className="py-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">CPPT</h1>
                    <p className="text-muted-foreground font-medium">Catatan Perkembangan Pasien Terintegrasi (Terbaru di Atas)</p>
                </div>

                <Button onClick={() => { setIsEditing(null); setFormData({}); setIsModalOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah CPPT
                </Button>
            </div>

            <Separator />

            <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4 text-slate-400">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        <p className="text-sm font-medium">Menarik data timeline...</p>
                    </div>
                ) : (
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                        {cpptData.map((item) => {
                            const isDeleted = !!item.deleted_by

                            return (
                                <div key={`${item.id}-${item.type}`} className="relative pl-12">
                                    <div className={`absolute left-0 mt-1.5 h-10 w-10 rounded-full border-4 border-white flex items-center justify-center shadow-md z-10 transition-all ${isDeleted ? "bg-slate-300" : item.verified_at ? 'bg-emerald-500' : 'bg-slate-500'
                                        }`}>
                                        {isDeleted ? <Trash2 className="w-5 h-5 text-red-500" /> : item.verified_at ? <Check className="w-5 h-5 text-white" /> : <History className="w-5 h-5 text-white/70" />}
                                    </div>

                                    <Card className={`transition-all duration-300 ${isDeleted ? "bg-slate-50 border-dashed border-slate-300" :
                                        item.verified_at ? "border-l-4 border-l-emerald-500 bg-emerald-50/5" : "hover:border-slate-300 border-l-4 border-l-slate-300"
                                        }`}>
                                        <CardHeader className="w-full flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge variant={isDeleted ? "outline" : "default"}>
                                                    {item.type} {isDeleted && "• DIHAPUS"}
                                                </Badge>
                                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                            </div>

                                            {!isDeleted && (
                                                <div className="flex items-center gap-1">
                                                    {/* Tombol Salin Data */}
                                                    <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:bg-blue-50" onClick={() => handleCopy(item)}>
                                                        <CopyPlus className="w-4 h-4 mr-1" /> Salin
                                                    </Button>

                                                    {!item.verified_at && (
                                                        <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:bg-emerald-50" onClick={() => handleVerify(item.id, item.type)}>
                                                            <CheckCheck className="w-4 h-4 mr-1" /> Verifikasi
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" className="h-8 text-amber-600 hover:bg-amber-50"
                                                        onClick={() => {
                                                            setSelectedIdForAction(item.id);
                                                            setSelectedType(item.type);
                                                            setNoteValue(item.notes || "");
                                                            setIsNoteOpen(true);
                                                        }}>
                                                        <MessageSquare className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 text-slate-600" onClick={() => {
                                                        setIsEditing(item.id);
                                                        setSelectedType(item.type);
                                                        setFormData({ ...item.data });
                                                        setIsModalOpen(true);
                                                    }}>
                                                        <Edit3 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-red-50"
                                                        onClick={() => {
                                                            setSelectedIdForAction(item.id);
                                                            setSelectedType(item.type);
                                                            setIsDeleteAlertOpen(true);
                                                        }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {renderCpptContent(item)}

                                            {item.notes && !isDeleted && (
                                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2">
                                                    <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                    <div className="text-xs text-amber-900 leading-relaxed italic">
                                                        <strong>Catatan Verifikasi:</strong> {item.notes}
                                                    </div>
                                                </div>
                                            )}

                                            <Separator className="opacity-50" />
                                            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-600">
                                                        {(item.created_by || "??").substring(0, 2).toUpperCase()}
                                                    </div>
                                                    PPA: {item.created_by}
                                                </div>

                                                {isDeleted ? (
                                                    <div className="text-red-500 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded">
                                                        Deleted by: {item.deleted_by}
                                                    </div>
                                                ) : (
                                                    item.verified_at && (
                                                        <div className="text-emerald-600 flex items-center gap-1">
                                                            Verified at {item.verified_at}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* Dialog Form CPPT */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Perbarui CPPT' : 'Tambah CPPT Baru'}
                        </DialogTitle>
                    </DialogHeader>
                    <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as CpptType)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="SOAP">SOAP</TabsTrigger>
                            <TabsTrigger value="SBAR">SBAR</TabsTrigger>
                            <TabsTrigger value="ADIME">ADIME</TabsTrigger>
                        </TabsList>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                            {selectedType === "SOAP" && (
                                <>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Subjective</Label><Textarea value={formData.subjective || ""} onChange={(e) => setFormData({ ...formData, subjective: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Objective</Label><Textarea value={formData.objective || ""} onChange={(e) => setFormData({ ...formData, objective: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Assessment</Label><Textarea value={formData.assessment || ""} onChange={(e) => setFormData({ ...formData, assessment: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Planning</Label><Textarea value={formData.planning || ""} onChange={(e) => setFormData({ ...formData, planning: e.target.value })} /></div>
                                </>
                            )}
                            {selectedType === "SBAR" && (
                                <>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Situation</Label><Textarea value={formData.situation || ""} onChange={(e) => setFormData({ ...formData, situation: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Background</Label><Textarea value={formData.background || ""} onChange={(e) => setFormData({ ...formData, background: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Assessment</Label><Textarea value={formData.assessment || ""} onChange={(e) => setFormData({ ...formData, assessment: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Recommendation</Label><Textarea value={formData.recommendation || ""} onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })} /></div>
                                </>
                            )}
                            {selectedType === "ADIME" && (
                                <>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Assessment</Label><Textarea value={formData.assessment || ""} onChange={(e) => setFormData({ ...formData, assessment: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Diagnosis</Label><Textarea value={formData.diagnosis || ""} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Intervention</Label><Textarea value={formData.intervention || ""} onChange={(e) => setFormData({ ...formData, intervention: e.target.value })} /></div>
                                    <div className="space-y-1"><Label className="text-xs font-bold">Monev</Label><Textarea value={formData.monitoring_evaluation || ""} onChange={(e) => setFormData({ ...formData, monitoring_evaluation: e.target.value })} /></div>
                                </>
                            )}
                        </div>
                    </Tabs>
                    <DialogFooter className="mt-4 border-t pt-4">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} disabled={actionLoading}>
                            {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {isEditing ? 'Simpan Perubahan' : 'Buat CPPT Baru'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Dialog lainnya tetap sama ... */}
            <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader><DialogTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-amber-600" />Note Verifikasi</DialogTitle></DialogHeader>
                    <div className="py-4 space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Input Catatan Perbaikan</Label>
                        <Textarea placeholder="Contoh: Harap revisi bagian assessment..." value={noteValue} onChange={(e) => setNoteValue(e.target.value)} className="min-h-[120px]" />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsNoteOpen(false)}>Tutup</Button>
                        <Button onClick={handleSaveNote} disabled={actionLoading} className="bg-amber-600 hover:bg-amber-700">Simpan Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" /> Hapus CPPT
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan mencoret catatan CPPT terpilih. Data tidak benar-benar hilang dari sistem namun akan tampil dengan status "Dihapus".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }} className="bg-red-600 hover:bg-red-700 text-white">
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Ya, Hapus Catatan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}