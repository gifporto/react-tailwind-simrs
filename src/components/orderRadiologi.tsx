"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, EmrRanapAPI, DoctorAPI, RadiologyAPI } from "@/lib/api"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

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
  Search,
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
  EmrRanapAPI: { service: EmrRanapAPI, label: "Rawat Inap" },
}

interface RadiologiApiInterface {
  getRadiologi: (id: string) => Promise<any>;
  createRadiologi: (id: string, data: any) => Promise<any>;
  deleteRadiologi: (id: string, orderId: string) => Promise<any>;
}

interface OrderRadiologiProps {
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
const OrderRadiologi: React.FC<OrderRadiologiProps> = ({ api }) => {
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

  // --- Selected States ---
  const [selectedResult, setSelectedResult] = useState<any>(null)

  // --- Master Data States ---
  const [doctors, setDoctors] = useState<any[]>([])
  const [radiologyCategories, setRadiologyCategories] = useState<any[]>([])
  const [doctorSearch, setDoctorSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)

  // --- Form State ---
  const [formData, setFormData] = useState({
    dokter_id: "",
    catatan: "",
    pemeriksaan_ids: [] as number[],
  })

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
            RadiologyAPI.getService() // Menggunakan API tree yang baru
          ])
          setDoctors(resDoc.data || [])
          setRadiologyCategories(resRad.data || [])
        } catch (e) { console.error(e) }
      }
      fetchMaster()
    }
  }, [isCreateOpen, doctorSearch])

  const toggleSelection = (pemeriksaanId: number) => {
    setFormData(prev => ({
      ...prev,
      pemeriksaan_ids: prev.pemeriksaan_ids.includes(pemeriksaanId)
        ? prev.pemeriksaan_ids.filter(i => i !== pemeriksaanId)
        : [...prev.pemeriksaan_ids, pemeriksaanId]
    }))
  }

  // Logic Filtering data berdasarkan input user
  const filteredData = radiologyCategories.map(cat => ({
    ...cat,
    sub_kategori: cat.sub_kategori.map((sub: any) => ({
      ...sub,
      pemeriksaan: sub.pemeriksaan.filter((p: any) =>
        p.nama_pemeriksaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter((sub: any) => sub.pemeriksaan.length > 0)
  })).filter(cat => cat.sub_kategori.length > 0)

  const handleCreateOrder = async () => {
    if (!id) return
    if (!formData.dokter_id || formData.pemeriksaan_ids.length === 0) {
      return toast.error("Lengkapi data dokter dan pilih minimal satu pemeriksaan")
    }
    setActionLoading(true)
    try {
      const payload = {
        dokter_id: parseInt(formData.dokter_id),
        catatan: formData.catatan,
        pemeriksaan_ids: formData.pemeriksaan_ids
      }
      await activeApi.createRadiologi(id, payload)
      toast.success("Order radiologi berhasil dikirim")
      setIsCreateOpen(false)
      setFormData({ dokter_id: "", catatan: "", pemeriksaan_ids: [] })
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

      {/* --- DIALOG CREATE (MODAL BESAR) --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[95vw] overflow-y-auto lg:max-w-[1100px] max-h-[95vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ScanHeart className="w-6 h-6 text-yellow-600" />
              Pemeriksaan Radiologi
            </DialogTitle>
          </DialogHeader>

          <div className="flex px-6 pb-4 gap-4">
            <div className="flex-1 space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Dokter Pengirim</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10 text-sm">
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

            <div className="flex-1 space-y-1">
              <Label className="text-xs uppercase text-muted-foreground">Cari Pemeriksaan</Label>
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ketik nama rontgen/USG/CT-Scan..."
                  className="pl-8 h-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <ScrollArea className="flex-1 px-6 py-4 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 align-start pb-6">
              {filteredData.map((category) => (
                <div key={category.id} className="space-y-3">
                  {/* Category Title */}
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-yellow-600 rounded-full" />
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight">
                      {category.nama}
                    </h3>
                  </div>

                  {category.sub_kategori.map((sub: any) => (
                    <div key={sub.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div className="bg-orange-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b">
                        {sub.nama}
                      </div>
                      <div className="p-1">
                        {sub.pemeriksaan.map((item: any) => (
                          <div
                            key={item.id}
                            className={cn(
                              "flex items-start gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors group",
                              formData.pemeriksaan_ids.includes(item.id) ? "bg-yellow-50/50" : ""
                            )}
                            onClick={() => toggleSelection(item.id)}
                          >
                            <Checkbox
                              checked={formData.pemeriksaan_ids.includes(item.id)}
                              onCheckedChange={() => toggleSelection(item.id)}
                              className="mt-0.5"
                            />
                            <div className="flex flex-col leading-tight">
                              <span className="text-xs font-medium text-slate-700">
                                {item.nama_pemeriksaan}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {rupiah(item.harga)} • {item.durasi_menit} menit
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* <div className="space-y-2 mt-4">
              <Label className="text-sm font-semibold">Indikasi Klinis / Catatan</Label>
              <Textarea
                placeholder="Tuliskan alasan pemeriksaan atau catatan tambahan..."
                value={formData.catatan}
                onChange={(e) => setFormData(f => ({ ...f, catatan: e.target.value }))}
                className="bg-white"
              />
            </div> */}
          </ScrollArea>

          <div className="p-4 border-t bg-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Terpilih</span>
              <span className="text-sm font-bold text-yellow-700">
                {formData.pemeriksaan_ids.length} Pemeriksaan
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
              <Button
                onClick={handleCreateOrder}
                disabled={actionLoading || formData.pemeriksaan_ids.length === 0}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- ALERT DELETE --- */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Batalkan Order Radiologi
            </AlertDialogTitle>
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