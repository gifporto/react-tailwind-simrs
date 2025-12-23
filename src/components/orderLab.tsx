"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, RanapAPI, DoctorAPI, LabAPI } from "@/lib/api"
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
import { Textarea } from "@/components/ui/textarea"
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
  FlaskConical,
  Plus,
  Check,
  X,
  Calendar,
  Loader2,
  ChevronsUpDown,
  User,
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

const API_MAP = {
  EmrIgdAPI: { service: EmrIgdAPI, label: "IGD" },
  RanapAPI: { service: RanapAPI, label: "Rawat Inap" },
}

interface LabApiInterface {
  getLab: (id: string) => Promise<any>;
  createLab: (id: string, data: any) => Promise<any>;
  deleteLab: (id: string, orderId: string) => Promise<any>;
}

interface OrderLabProps {
  api: keyof typeof API_MAP;
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
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num)
}

/* =====================
   Component
===================== */
const OrderLab: React.FC<OrderLabProps> = ({ api }) => {
  const activeApi = API_MAP[api].service as LabApiInterface;
  const moduleLabel = API_MAP[api].label;

  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState(false)

  // --- UI States ---
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [openDoctorCombo, setOpenDoctorCombo] = useState(false)
  const [openServiceCombo, setOpenServiceCombo] = useState(false)

  // --- Master Data States ---
  const [doctors, setDoctors] = useState<any[]>([])
  const [masterServices, setMasterServices] = useState<any[]>([])
  const [doctorSearch, setDoctorSearch] = useState("")
  const [serviceSearch, setServiceSearch] = useState("")

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)

  // --- Form State ---
  const [formData, setFormData] = useState({
    dokter_id: "",
    catatan: "",
    selected_services: [] as number[],
  })

  // --- Fetch List Order ---
  const fetchLabOrders = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await activeApi.getLab(id)
      setOrders(response.data || [])
    } catch (error) {
      toast.error(`Gagal memuat data lab ${moduleLabel}`)
    } finally {
      setLoading(false)
    }
  }, [id, activeApi, moduleLabel])

  useEffect(() => {
    fetchLabOrders()
  }, [fetchLabOrders])

  // --- Fetch Master Data ---
  useEffect(() => {
    if (isCreateOpen) {
      const fetchMaster = async () => {
        try {
          const [resDoc, resLab] = await Promise.all([
            DoctorAPI.getList(1, 50, doctorSearch),
            LabAPI.getList(1, 50, serviceSearch)
          ])
          setDoctors(resDoc.data || [])
          setMasterServices(resLab.data || [])
        } catch (e) { console.error(e) }
      }
      fetchMaster()
    }
  }, [isCreateOpen, doctorSearch, serviceSearch])

  const toggleService = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      selected_services: prev.selected_services.includes(serviceId)
        ? prev.selected_services.filter(i => i !== serviceId)
        : [...prev.selected_services, serviceId]
    }))
  }

  const handleCreateOrder = async () => {
    if (!id) return
    if (!formData.dokter_id || formData.selected_services.length === 0) {
      return toast.error("Pilih dokter dan minimal satu layanan lab")
    }

    setActionLoading(true)
    try {
      const payload = {
        kunjungan_id: parseInt(id),
        dokter_id: parseInt(formData.dokter_id),
        catatan: formData.catatan,
        selected_services: formData.selected_services
      }

      await activeApi.createLab(id, payload)
      toast.success("Order laboratorium berhasil dikirim")
      setIsCreateOpen(false)
      setFormData({ dokter_id: "", catatan: "", selected_services: [] })
      fetchLabOrders()
    } catch (error) {
      toast.error("Gagal membuat order")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (idLab: string) => {
    if (!id) return

    setActionLoading(true)
    try {
      await activeApi.deleteLab(id, idLab)
      toast.success("Order berhasil dibatalkan")
      fetchLabOrders()
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
          <FlaskConical className="w-5 h-5 text-primary" />
          Order Laboratorium ({moduleLabel})
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
            const totalHarga = order.items?.reduce(
              (acc: number, curr: any) => acc + parseFloat(curr.harga_test || 0),
              0
            )

            return (
              <div key={order.id} className="border rounded-md px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <FlaskConical className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="leading-tight">
                      <p className="text-sm font-medium">{order.no_order}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleString("id-ID", { dateStyle: 'medium' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadge(order.status) as any} className="text-xs">
                      {order.status}
                    </Badge>

                    {order.status !== "selesai" && order.status !== "dibatalkan" && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setSelectedIdToDelete(order.id.toString())
                          setIsDeleteAlertOpen(true)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {order.items?.map((item: any) => (
                    <Badge key={item.id} variant="outline" className="text-xs font-normal">
                      {item.nama_test}
                    </Badge>
                  ))}
                </div>

                {order.catatan && (
                  <p className="text-[11px] text-muted-foreground italic bg-slate-50 p-1.5 rounded">
                    Note: {order.catatan}
                  </p>
                )}

                <Separator />
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-2 items-center">
                    <Badge variant="info">
                      <User className="w-3 h-3 mr-1" />
                      {order.dokter.nama}
                    </Badge>
                  </div>
                  <strong className="text-emerald-600 font-bold">{rupiah(totalHarga)}</strong>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">Belum ada order lab {moduleLabel}.</div>
        )}
      </CardContent>

      {/* --- DIALOG CREATE --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Buat Order Lab {moduleLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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

            <div className="space-y-2">
              <Label>Layanan Lab ({formData.selected_services.length} terpilih)</Label>
              <Popover open={openServiceCombo} onOpenChange={setOpenServiceCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-auto min-h-10 py-2">
                    <span className="truncate">{formData.selected_services.length > 0 ? `${formData.selected_services.length} Item dipilih` : "Pilih pemeriksaan..."}</span>
                    <Plus className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari layanan lab..." onValueChange={setServiceSearch} />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {masterServices.map((s) => (
                          <CommandItem key={s.id} onSelect={() => toggleService(s.id)}>
                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", formData.selected_services.includes(s.id) ? "bg-primary text-primary-foreground" : "opacity-50")}>
                              {formData.selected_services.includes(s.id) && <Check className="h-3 w-3" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{s.nama_layanan}</span>
                              <span className="text-[10px] text-muted-foreground">{rupiah(s.harga_total)} • {s.jenis}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Catatan Tambahan</Label>
              <Textarea
                placeholder="Contoh: Puasa 8 jam, Pasien Cito, dll"
                value={formData.catatan}
                onChange={(e) => setFormData(f => ({ ...f, catatan: e.target.value }))}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreateOrder} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proses Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Batalkan Order Lab
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan order ini?
            </AlertDialogDescription>
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

export default OrderLab;