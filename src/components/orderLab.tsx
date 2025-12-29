"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, EmrRanapAPI, DoctorAPI, LabAPI } from "@/lib/api"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

/* =====================
   Configurations & Types
===================== */

const API_MAP = {
  EmrIgdAPI: { service: EmrIgdAPI, label: "IGD" },
  EmrRanapAPI: { service: EmrRanapAPI, label: "Rawat Inap" },
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

const OrderLab: React.FC<OrderLabProps> = ({ api }) => {
  const activeApi = API_MAP[api].service as LabApiInterface;
  const moduleLabel = API_MAP[api].label;
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState(false)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [openDoctorCombo, setOpenDoctorCombo] = useState(false)

  const [doctors, setDoctors] = useState<any[]>([])
  const [masterServices, setMasterServices] = useState<any[]>([]) // Ini sekarang berisi data tree kategori
  const [doctorSearch, setDoctorSearch] = useState("")
  const [serviceSearch, setServiceSearch] = useState("")

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    dokter_id: "",
    catatan: "",
    selected_services: [] as number[],
  })

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

  // --- Update Fetch Master Data menggunakan getService ---
  useEffect(() => {
    if (isCreateOpen) {
      const fetchMaster = async () => {
        try {
          const [resDoc, resLab] = await Promise.all([
            DoctorAPI.getList(1, 50, doctorSearch),
            LabAPI.getService() // Menggunakan getService yang baru
          ])
          setDoctors(resDoc.data || [])
          setMasterServices(resLab.data || []) // Menyimpan array kategori
        } catch (e) { console.error(e) }
      }
      fetchMaster()
    }
  }, [isCreateOpen, doctorSearch])

  const toggleService = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      selected_services: prev.selected_services.includes(serviceId)
        ? prev.selected_services.filter(i => i !== serviceId)
        : [...prev.selected_services, serviceId]
    }))
  }

  // Filter data berdasarkan search input
  const filteredServices = masterServices.map(category => ({
    ...category,
    lab_services: category.lab_services.filter((s: any) =>
      s.nama_layanan.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.kode_layanan.toLowerCase().includes(serviceSearch.toLowerCase())
    )
  })).filter(category => category.lab_services.length > 0)

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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[95vw] overflow-y-auto lg:max-w-[1200px] max-h-[95vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-primary" />
              Pemeriksaan Laboratorium & Rontgen
            </DialogTitle>
          </DialogHeader>

          <div className="flex px-6 pb-2 gap-4">
            {/* Pilihan Dokter Tetap di Atas */}
            <div className="flex-1 space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Dokter Pengirim</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-9 text-sm">
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

            {/* Input Pencarian */}
            <div className="flex-1 space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Cari Layanan</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ketik nama pemeriksaan..."
                  className="pl-8 h-9 text-sm"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* AREA FORMULIR BERGAYA MASONRY GRID */}
          <ScrollArea className="flex-1 px-6 py-4 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 align-start">
              {filteredServices.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border rounded-lg shadow-sm flex flex-col h-fit"
                >
                  {/* Header Kategori Bergaya Form RS */}
                  <div className="bg-primary text-white px-3 py-1.5 rounded-t-lg text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                    {category.nama}
                    <Badge variant="outline" className="text-[10px] text-white border-white/30 h-4 px-1">
                      {category.lab_services.length}
                    </Badge>
                  </div>

                  {/* List Layanan */}
                  <div className="p-1">
                    {category.lab_services.map((service: any) => (
                      <div
                        key={service.id}
                        className={cn(
                          "flex items-start gap-2 p-1.5 hover:bg-slate-100 rounded cursor-pointer transition-colors group",
                          formData.selected_services.includes(service.id) ? "bg-blue-50 hover:bg-blue-100" : ""
                        )}
                        onClick={() => toggleService(service.id)}
                      >
                        <Checkbox
                          checked={formData.selected_services.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                          className="mt-0.5 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-blue-900"
                        />
                        <div className="flex flex-col leading-tight overflow-hidden">
                          <span className="text-[13px] font-medium text-slate-700 truncate group-hover:text-blue-900">
                            {service.nama_layanan}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {service.kode_layanan} • {rupiah(service.harga_total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredServices.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <FlaskConical className="w-10 h-10 opacity-20" />
                  <p>Layanan laboratorium tidak ditemukan</p>
                </div>
              )}
            </div>

            {/* Catatan Tambahan Bergaya Footer Form */}
            <div className="mt-8 space-y-2 w-full">
              <Label className="text-sm font-semibold flex items-center gap-2">
                Catatan Tambahan / Klinis
              </Label>
              <Textarea
                placeholder="Tuliskan indikasi klinis atau catatan khusus di sini..."
                value={formData.catatan}
                onChange={(e) => setFormData(f => ({ ...f, catatan: e.target.value }))}
                className="min-h-[80px] bg-white border-slate-300"
              />
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Ringkasan Order</span>
              <span className="text-sm font-bold text-blue-900">
                {formData.selected_services.length} Item Pemeriksaan Terpilih
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
              <Button
                onClick={handleCreateOrder}
                disabled={actionLoading || formData.selected_services.length === 0}
                className="bg-primary hover:bg-primary/80"
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim ke Laboratorium
              </Button>
            </div>
          </div>
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