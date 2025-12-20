"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, DoctorAPI } from "@/lib/api"
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
import { Input } from "@/components/ui/input"
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
  Eye,
  Play,
  Check,
  X,
  Calendar,
  FileImage,
  RotateCcw,
  Info,
  ScanHeart,
  Loader2,
  ChevronsUpDown,
} from "lucide-react"

/* =====================
   Helpers
===================== */
const statusBadge = (status: string) => {
  const s = status?.toLowerCase()
  if (s === "pending" || s === "ordered") return "secondary"
  if (s === "proses") return "default"
  if (s === "selesai") return "success"
  if (s === "dibatalkan") return "destructive"
  return "outline"
}

const rupiah = (val: string | number) => {
  const num = typeof val === "string" ? parseFloat(val) : val
  return `Rp ${num.toLocaleString("id-ID")}`
}

/* =====================
   Component
===================== */
const OrderRadiologi: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState(false)

  // --- UI States ---
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [openDoctorCombo, setOpenDoctorCombo] = useState(false)

  // --- Master Data States ---
  const [doctors, setDoctors] = useState<any[]>([])
  const [doctorSearch, setDoctorSearch] = useState("")

  // --- Form State ---
  const [formData, setFormData] = useState({
    dokter_id: "",
    temp_pemeriksaan_id: "",
  })

  // --- Fetch Data List ---
  const fetchRadiology = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await EmrIgdAPI.getRadiologi(id)
      setOrders(response.data || [])
    } catch (error) {
      toast.error("Gagal memuat data radiologi")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRadiology()
  }, [fetchRadiology])

  // --- Fetch Master Dokter ---
  useEffect(() => {
    if (isCreateOpen) {
      const fetchDocs = async () => {
        try {
          const res = await DoctorAPI.getList(1, 50, doctorSearch)
          setDoctors(res.data || [])
        } catch (e) { console.error(e) }
      }
      fetchDocs()
    }
  }, [isCreateOpen, doctorSearch])

  // --- Create Action ---
  const handleCreateOrder = async () => {
    if (!id) return
    if (!formData.dokter_id || !formData.temp_pemeriksaan_id) {
      return toast.error("Lengkapi data dokter dan ID pemeriksaan")
    }

    setActionLoading(true)
    try {
      const payload = {
        dokter_id: parseInt(formData.dokter_id),
        pemeriksaan_ids: [parseInt(formData.temp_pemeriksaan_id)]
      }
      await EmrIgdAPI.createRadiologi(id, payload)
      toast.success("Order radiologi berhasil dibuat")
      setIsCreateOpen(false)
      setFormData({ dokter_id: "", temp_pemeriksaan_id: "" })
      fetchRadiology()
    } catch (error) {
      toast.error("Gagal membuat order")
    } finally {
      setActionLoading(false)
    }
  }

  // --- Delete Action ---
  const handleDelete = async (idRadiologi: string) => {
    if (!id || !confirm("Batalkan order radiologi ini?")) return
    try {
      await EmrIgdAPI.deleteRadiologi(id, idRadiologi)
      toast.success("Order berhasil dibatalkan")
      fetchRadiology()
    } catch (error) {
      toast.error("Gagal membatalkan order")
    }
  }

  return (
    <Card className="mt-4">
      {/* Header Tetap Sama */}
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScanHeart className="w-5 h-5 text-yellow-600" />
          Order Radiologi
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

                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Eye className="w-4 h-4" />
                      </Button>

                      {order.status !== "selesai" && order.status !== "dibatalkan" && (
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleDelete(order.id.toString())}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}

                      {order.status === "selesai" && (
                        <Button variant="outline" size="icon" className="h-7 w-7">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {order.catatan && (
                  <>
                    <Separator />
                    <p className="text-xs text-muted-foreground flex gap-1 items-center">
                      <Info className="w-3 h-3" />
                      {order.catatan}
                    </p>
                  </>
                )}

                <div className="flex flex-wrap gap-1">
                  {order.details?.slice(0, 6).map((det: any) => (
                    <Badge
                      key={det.id}
                      variant={statusBadge(det.status) as any}
                      className="text-xs font-normal"
                    >
                      {det.pemeriksaan.nama}
                    </Badge>
                  ))}
                  {order.details?.length > 6 && (
                    <span className="text-xs text-muted-foreground">
                      +{order.details.length - 6} lainnya
                    </span>
                  )}
                </div>

                <Separator />
                <div className="flex items-center justify-between text-xs">
                  {order.result ? (
                    <div className="flex items-center gap-1 text-primary">
                      <FileImage className="w-4 h-4" />
                      Hasil tersedia
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Belum ada hasil</span>
                  )}

                  <strong className="text-green-600">
                    {rupiah(totalHarga)}
                  </strong>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <ScanHeart className="mx-auto mb-2 opacity-20" size={40} />
            Belum ada order radiologi
          </div>
        )}
      </CardContent>

      {/* Dialog Create Order */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Tambah Order Radiologi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Dokter Pengirim</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.dokter_id 
                      ? doctors.find(d => d.id.toString() === formData.dokter_id)?.nama_dokter 
                      : "Pilih dokter..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari dokter..." onValueChange={setDoctorSearch} />
                    <CommandList>
                      <CommandEmpty>Dokter tidak ditemukan.</CommandEmpty>
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
              <Label>ID Pemeriksaan (Angka)</Label>
              <Input 
                type="number" 
                placeholder="Contoh: 1" 
                value={formData.temp_pemeriksaan_id}
                onChange={(e) => setFormData(f => ({ ...f, temp_pemeriksaan_id: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreateOrder} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kirim Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default OrderRadiologi