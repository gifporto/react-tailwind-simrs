"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, RanapAPI, DoctorAPI, RadiologyAPI } from "@/lib/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import {
  Plus,
  Check,
  X,
  Calendar,
  FileImage,
  ScanHeart,
  Loader2,
  ChevronsUpDown,
  ClipboardList,
  User,
  Download,
  AlertTriangle,
} from "lucide-react"

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

/* =====================
   Configurations & Types
===================== */

// Mapping API untuk memudahkan pemilihan berdasarkan prop string
const API_MAP = {
  EmrIgdAPI: { service: EmrIgdAPI, label: "IGD" },
  RanapAPI: { service: RanapAPI, label: "Rawat Inap" },
}

interface RadiologiApiInterface {
  getRadiologi: (id: string) => Promise<any>;
  createRadiologi: (id: string, data: any) => Promise<any>;
  deleteRadiologi: (id: string, orderId: string) => Promise<any>;
}

interface OrderRadiologiProps {
  api: keyof typeof API_MAP; // Hanya menerima key yang ada di API_MAP
}

const statusBadge = (status: string) => {
  const s = status?.toLowerCase()
  if (s === "ordered") return "secondary"
  if (s === "proses") return "warning"
  if (s === "selesai") return "success"
  if (s === "dibatalkan") return "destructive"
  return "outline"
}

const rupiah = (val: string | number) => {
  const num = typeof val === "string" ? parseFloat(val) : val
  return `Rp ${num.toLocaleString('id-ID')}`
}

/* =====================
   Component
===================== */
const OrderRadiologi: React.FC<OrderRadiologiProps> = ({ api }) => {
  // Ambil service API dan label berdasarkan prop 'api'
  const activeApi = API_MAP[api].service as RadiologiApiInterface;
  const moduleLabel = API_MAP[api].label;

  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState(false)

  // --- UI States ---
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [openDoctorCombo, setOpenDoctorCombo] = useState(false)
  const [openRadCombo, setOpenRadCombo] = useState(false)

  // --- Selected States ---
  const [selectedResult, setSelectedResult] = useState<any>(null)

  // --- Master Data States ---
  const [doctors, setDoctors] = useState<any[]>([])
  const [radiologyList, setRadiologyList] = useState<any[]>([])
  const [doctorSearch, setDoctorSearch] = useState("")
  const [radSearch, setRadSearch] = useState("")

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)

  // --- Form State ---
  const [formData, setFormData] = useState({
    dokter_id: "",
    pemeriksaan_ids: [] as number[],
  })

  // --- Fetch Data List ---
  const fetchRadiology = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await activeApi.getRadiologi(id)
      setOrders(response.data || [])
    } catch (error) {
      toast.error(`Gagal memuat data radiologi ${moduleLabel}`)
    } finally {
      setLoading(false)
    }
  }, [id, activeApi, moduleLabel])

  useEffect(() => {
    fetchRadiology()
  }, [fetchRadiology])

  // --- Master Data Fetch ---
  useEffect(() => {
    if (isCreateOpen) {
      const fetchMaster = async () => {
        try {
          const [resDoc, resRad] = await Promise.all([
            DoctorAPI.getList(1, 50, doctorSearch),
            RadiologyAPI.getList(1, 50, radSearch)
          ])
          setDoctors(resDoc.data || [])
          setRadiologyList(resRad.data || [])
        } catch (e) { console.error(e) }
      }
      fetchMaster()
    }
  }, [isCreateOpen, doctorSearch, radSearch])

  const toggleRadSelection = (radId: number) => {
    setFormData(prev => ({
      ...prev,
      pemeriksaan_ids: prev.pemeriksaan_ids.includes(radId)
        ? prev.pemeriksaan_ids.filter(i => i !== radId)
        : [...prev.pemeriksaan_ids, radId]
    }))
  }

  const handleCreateOrder = async () => {
    if (!id) return
    if (!formData.dokter_id || formData.pemeriksaan_ids.length === 0) {
      return toast.error("Lengkapi data dokter dan pilih minimal satu pemeriksaan")
    }
    setActionLoading(true)
    try {
      const payload = {
        dokter_id: parseInt(formData.dokter_id),
        pemeriksaan_ids: formData.pemeriksaan_ids
      }
      await activeApi.createRadiologi(id, payload)
      toast.success("Order radiologi berhasil dibuat")
      setIsCreateOpen(false)
      setFormData({ dokter_id: "", pemeriksaan_ids: [] })
      fetchRadiology()
    } catch (error) {
      toast.error("Gagal membuat order")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (idRadiologi: string) => {
    if (!id) return
    setActionLoading(true)
    try {
      await activeApi.deleteRadiologi(id, idRadiologi)
      toast.success("Order berhasil dibatalkan")
      fetchRadiology()
      setIsDeleteAlertOpen(false)
    } catch (error) {
      toast.error("Gagal membatalkan order")
    } finally {
      setActionLoading(false)
      setSelectedIdToDelete(null)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScanHeart className="w-5 h-5 text-yellow-600" />
          Order Radiologi ({moduleLabel})
        </CardTitle>
        <Button size="sm" className="h-8 gap-1" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Order
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => {
            const totalHarga = order.details?.reduce(
              (acc: number, curr: any) => acc + parseFloat(curr.pemeriksaan.harga || 0),
              0
            )

            return (
              <div key={order.id} className="border rounded-md px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <ScanHeart className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="leading-tight">
                      <p className="text-sm font-medium">{order.no_order}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {order.tanggal_order}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadge(order.status) as any} className="text-xs">
                      {order.status}
                    </Badge>

                    {order.status !== "selesai" && order.status !== "dibatalkan" && (
                      <Button variant="destructive" size="icon" className="h-7 w-7"
                        onClick={() => {
                          setSelectedIdToDelete(order.id.toString())
                          setIsDeleteAlertOpen(true)
                        }}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {order.details?.map((det: any) => (
                    <Badge key={det.id} variant="outline" className="text-xs font-normal">
                      {det.pemeriksaan.nama}
                    </Badge>
                  ))}
                </div>

                <Separator />
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-2 items-center">
                    <Badge variant="info">
                      <User className="w-3 h-3 mr-1" />
                      {order.dokter?.nama}
                    </Badge>
                    {order.result && (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-primary flex items-center gap-1 text-xs"
                        onClick={() => {
                          setSelectedResult(order);
                          setIsResultOpen(true);
                        }}
                      >
                        <FileImage className="w-3 h-3" /> Hasil tersedia
                      </Button>
                    )}
                  </div>
                  <strong className="text-green-600">{rupiah(totalHarga)}</strong>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">Belum ada order radiologi {moduleLabel}.</div>
        )}
      </CardContent>

      {/* --- DIALOG CREATE --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Buat Order Radiologi {moduleLabel}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            {/* Combo Dokter */}
            <div className="space-y-2">
              <Label>Dokter Pengirim</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.dokter_id ? doctors.find(d => d.id.toString() === formData.dokter_id)?.nama_dokter : "Pilih dokter..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari dokter..." onValueChange={setDoctorSearch} />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {doctors.map((d) => (
                          <CommandItem key={d.id} onSelect={() => {
                            setFormData(f => ({ ...f, dokter_id: d.id.toString() }))
                            setOpenDoctorCombo(false)
                          }}>
                            <Check className={cn("mr-2 h-4 w-4", formData.dokter_id === d.id.toString() ? "opacity-100" : "opacity-0")} />
                            {d.nama_dokter}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Multi Select Pemeriksaan */}
            <div className="space-y-2">
              <Label>Pemeriksaan ({formData.pemeriksaan_ids.length} terpilih)</Label>
              <Popover open={openRadCombo} onOpenChange={setOpenRadCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-auto min-h-10 py-2">
                    <span className="truncate">{formData.pemeriksaan_ids.length > 0 ? `${formData.pemeriksaan_ids.length} Item dipilih` : "Pilih pemeriksaan..."}</span>
                    <Plus className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari..." onValueChange={setRadSearch} />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {radiologyList.map((rad) => (
                          <CommandItem key={rad.id} onSelect={() => toggleRadSelection(rad.id)}>
                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", formData.pemeriksaan_ids.includes(rad.id) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                              {formData.pemeriksaan_ids.includes(rad.id) && <Check className="h-3 w-3" />}
                            </div>
                            <div className="flex flex-col">
                              <span>{rad.nama_pemeriksaan}</span>
                              <span className="text-[10px] text-muted-foreground">{rupiah(rad.harga)}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreateOrder} disabled={actionLoading}>Kirim Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG HASIL RADIOLOGI --- */}
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Hasil Pemeriksaan Radiologi
            </DialogTitle>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">No. Order</p>
                  <p className="font-mono font-medium">{selectedResult.no_order}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Tanggal Hasil</p>
                  <p className="font-medium">{selectedResult.result?.tanggal_hasil}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold">Temuan</Label>
                  <div className="p-3 border rounded-md bg-white text-sm whitespace-pre-wrap">
                    {selectedResult.result?.temuan || "-"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-green-600">Kesimpulan</Label>
                  <div className="p-3 border border-green-100 rounded-md bg-green-50/30 text-sm italic font-medium">
                    {selectedResult.result?.kesimpulan || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsResultOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- ALERT DELETE --- */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Order Radiologi</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin membatalkan order ini?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                if (selectedIdToDelete) handleDelete(selectedIdToDelete)
              }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default OrderRadiologi