"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

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
  Search,
  Loader2,
} from "lucide-react"

import { RadiologyAPI } from "@/lib/api"

/* =====================
   Types
===================== */
type Status = "ordered" | "proses" | "selesai" | "dibatalkan" | "pending"

interface RadiologiItem {
  id: number
  pemeriksaan: {
    id: number
    kode: string
    nama: string
    harga: string
  }
  status: string
}

interface RadiologiOrder {
  id: number
  no_order: string
  tanggal_order: string
  status: Status
  catatan: string | null
  pasien?: {
    norm: string
    nama: string
    tgl_lahir: string
    sex: string
    hp: string
  }
  dokter?: {
    id: number
    nama: string
  }
  details?: RadiologiItem[]
  result: {
    tanggal_hasil: string
    dokter_radiologi_id: string
    radiolog_id: number
    kesimpulan: string
    temuan: string
    saran: string
    file_lampiran: string
  } | null
  created_at: string
}

interface Doctor {
  id: number
  nik: string
  ihs_number: string
  nama_dokter: string
}

interface Radiology {
  id: number
  kategori_id: number
  kode: string
  nama_pemeriksaan: string
  deskripsi: string
  jenis_kontras: string
  harga: string
  durasi_menit: number
  kategori: {
    id: number
    kode: string
    nama: string
    deskripsi: string
  }
}

/* =====================
   Helpers
===================== */
const statusBadge = (status: string) => {
  switch (status) {
    case "ordered":
      return "warning"
    case "proses":
      return "info"
    case "selesai":
      return "success"
    case "dibatalkan":
      return "destructive"
    case "pending":
      return "secondary"
    default:
      return "default"
  }
}

const rupiah = (val: number) =>
  `Rp ${val.toLocaleString("id-ID")}`

/* =====================
   Order Form Dialog
===================== */
interface OrderFormProps {
  igdId: string
  onSuccess?: () => void
}

const OrderFormDialog: React.FC<OrderFormProps> = ({ igdId, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Doctor search
  const [doctorSearch, setDoctorSearch] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [loadingDoctors, setLoadingDoctors] = useState(false)

  // Radiologies
  const [radiologies, setRadiologies] = useState<Radiology[]>([])
  const [selectedRadiologies, setSelectedRadiologies] = useState<number[]>([])
  const [loadingRadiologies, setLoadingRadiologies] = useState(false)

  // Load radiologies on mount
  useEffect(() => {
    if (open) {
      loadRadiologies()
    }
  }, [open])

  // Search doctors with debounce
  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      if (doctorSearch.length >= 2) {
        searchDoctors()
      } else {
        setDoctors([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [doctorSearch, open])

  const searchDoctors = async () => {
    try {
      setLoadingDoctors(true)
      const response = await RadiologyAPI.getDoctors(doctorSearch)
      setDoctors(response.data || [])
    } catch (error) {
      console.error("Error searching doctors:", error)
      toast.error("Gagal mencari dokter")
    } finally {
      setLoadingDoctors(false)
    }
  }

  const loadRadiologies = async () => {
    try {
      setLoadingRadiologies(true)
      const response = await RadiologyAPI.getRadiologies()
      setRadiologies(response.data || [])
    } catch (error) {
      console.error("Error loading radiologies:", error)
      toast.error("Gagal memuat daftar pemeriksaan")
    } finally {
      setLoadingRadiologies(false)
    }
  }

  const handleToggleRadiology = (id: number) => {
    setSelectedRadiologies(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      toast.error("Pilih dokter terlebih dahulu")
      return
    }

    if (selectedRadiologies.length === 0) {
      toast.error("Pilih minimal satu pemeriksaan")
      return
    }

    try {
      setLoading(true)
      await RadiologyAPI.createOrder(igdId, {
        dokter_id: selectedDoctor.id,
        pemeriksaan_ids: selectedRadiologies,
      })

      toast.success("Order radiologi berhasil dibuat")
      setOpen(false)

      // Reset form
      setSelectedDoctor(null)
      setSelectedRadiologies([])
      setDoctorSearch("")

      onSuccess?.()
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast.error(error?.response?.data?.meta?.message || "Gagal membuat order")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return radiologies
      .filter(r => selectedRadiologies.includes(r.id))
      .reduce((sum, r) => sum + parseFloat(r.harga), 0)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="w-4 h-4" />
          Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanHeart className="w-5 h-5 text-yellow-600" />
            Buat Order Radiologi
          </DialogTitle>
          <DialogDescription>
            Pilih dokter dan pemeriksaan radiologi yang diperlukan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Doctor Search */}
          <div className="space-y-2">
            <Label htmlFor="doctor-search">Dokter Pengirim</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="doctor-search"
                placeholder="Cari nama dokter..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="pl-9"
              />
              {loadingDoctors && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Selected Doctor */}
            {selectedDoctor && (
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md border border-primary/20">
                <div>
                  <p className="font-medium text-sm">{selectedDoctor.nama_dokter}</p>
                  <p className="text-xs text-muted-foreground">NIK: {selectedDoctor.nik}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoctor(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Doctor Search Results */}
            {!selectedDoctor && doctors.length > 0 && (
              <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor)
                      setDoctors([])
                      setDoctorSearch("")
                    }}
                    className="w-full p-3 text-left hover:bg-accent transition-colors"
                  >
                    <p className="font-medium text-sm">{doctor.nama_dokter}</p>
                    <p className="text-xs text-muted-foreground">NIK: {doctor.nik} • IHS: {doctor.ihs_number}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Radiologies Checkboxes */}
          <div className="space-y-3">
            <Label>Pemeriksaan Radiologi</Label>

            {loadingRadiologies ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 space-y-3">
                {radiologies.map((radiology) => (
                  <div
                    key={radiology.id}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-slate-950 rounded-md border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Checkbox
                      id={`radiology-${radiology.id}`}
                      checked={selectedRadiologies.includes(radiology.id)}
                      onCheckedChange={() => handleToggleRadiology(radiology.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`radiology-${radiology.id}`}
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{radiology.nama_pemeriksaan}</p>
                          <p className="text-xs text-muted-foreground">
                            Kode: {radiology.kode} • {radiology.kategori.nama}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {radiology.jenis_kontras}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {radiology.deskripsi}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-green-600 font-semibold">
                          {rupiah(parseFloat(radiology.harga))}
                        </span>
                        <span className="text-muted-foreground">
                          ⏱ {radiology.durasi_menit} menit
                        </span>
                      </div>
                    </label>
                  </div>
                ))}

                {radiologies.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Tidak ada pemeriksaan tersedia
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedRadiologies.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-md border border-primary/20">
                <div>
                  <p className="text-sm font-medium">Total Pemeriksaan</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRadiologies.length} pemeriksaan dipilih
                  </p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {rupiah(calculateTotal())}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedDoctor || selectedRadiologies.length === 0}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Buat Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* =====================
   Main Component
===================== */
interface OrderRadiologiProps {
  igdId?: string
}

const OrderRadiologi: React.FC<OrderRadiologiProps> = ({ igdId = "1" }) => {
  const [orders, setOrders] = useState<RadiologiOrder[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await RadiologyAPI.getOrders(igdId)
      setOrders(response.data || [])
    } catch (error) {
      console.error("Error loading orders:", error)
      toast.error("Gagal memuat order radiologi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [igdId])

  const calculateTotal = (details?: RadiologiItem[]) => {
    if (!details || details.length === 0) return 0
    return details.reduce((sum, item) => sum + parseFloat(item.pemeriksaan.harga), 0)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    // Handle SQL timestamp "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss" for reliable parsing
    const normalized = dateString.replace(" ", "T")
    const date = new Date(normalized)

    if (isNaN(date.getTime())) return dateString // Fallback if parsing fails

    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="mt-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScanHeart className="w-5 h-5 text-yellow-600" />
          Order Radiologi
        </CardTitle>

        <OrderFormDialog igdId={igdId} onSuccess={loadOrders} />
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <ScanHeart className="mx-auto mb-2" />
            Belum ada order radiologi
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${order.status === 'selesai' ? 'bg-green-500' :
                  order.status === 'proses' ? 'bg-blue-500' :
                    order.status === 'ordered' ? 'bg-yellow-500' :
                      order.status === 'dibatalkan' ? 'bg-red-500' :
                        'bg-slate-300'
                }`} />

              <div className="p-4 space-y-3">
                {/* Header Section */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    {/* Order Number & Date */}
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                        <ScanHeart className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {order.no_order}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.tanggal_order)}
                        </div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    {order.pasien ? (
                      <div className="pl-12 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {order.pasien.nama}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs h-5">
                            {order.pasien.norm}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{order.pasien.sex === 'L' ? '👨 Laki-laki' : '👩 Perempuan'}</span>
                          <span>•</span>
                          <span>📅 {new Date(order.pasien.tgl_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>📞 {order.pasien.hp}</span>
                        </div>
                        {order.dokter && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-medium">Dokter:</span>
                            <span>{order.dokter.nama}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pl-12 text-xs text-muted-foreground italic">
                        Data pasien tidak tersedia
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={statusBadge(order.status)}
                      className="text-xs font-medium px-3 py-1"
                    >
                      {order.status === 'ordered' ? '📋 Ordered' :
                        order.status === 'proses' ? '⚡ Proses' :
                          order.status === 'selesai' ? '✅ Selesai' :
                            order.status === 'dibatalkan' ? '❌ Dibatalkan' :
                              '⏳ Pending'}
                    </Badge>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </Button>

                      {order.status === "ordered" && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950"
                            title="Mulai Proses"
                          >
                            <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950"
                            title="Batalkan"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </>
                      )}

                      {order.status === "proses" && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950"
                            title="Tandai Selesai"
                          >
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950"
                            title="Batalkan"
                          >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </>
                      )}

                      {order.status === "selesai" && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-950"
                          title="Proses Ulang"
                        >
                          <RotateCcw className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.catatan && (
                  <div className="pl-12 p-2 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex gap-1.5 items-start">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{order.catatan}</span>
                    </p>
                  </div>
                )}

                {/* Examination Items */}
                <div className="pl-12 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Pemeriksaan ({order.details?.length || 0})
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {order.details?.slice(0, 6).map((item) => (
                      <Badge
                        key={item.id}
                        variant={statusBadge(item.status as Status)}
                        className="text-xs font-normal px-2.5 py-1"
                      >
                        <span className="font-medium">{item.pemeriksaan.kode}</span>
                        <span className="mx-1">•</span>
                        <span>{item.pemeriksaan.nama}</span>
                      </Badge>
                    ))}
                    {(order.details?.length || 0) > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{(order.details?.length || 0) - 6} lainnya
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Footer: Result & Total */}
                <div className="pl-12 pt-2 border-t flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {order.result ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                          <FileImage className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-400">Hasil Tersedia</p>
                          <p className="text-muted-foreground">
                            {new Date(order.result.tanggal_hasil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                          <FileImage className="w-3.5 h-3.5" />
                        </div>
                        <span>Belum ada hasil</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Biaya</p>
                    <p className="text-base font-bold text-green-600 dark:text-green-500">
                      {rupiah(calculateTotal(order.details))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default OrderRadiologi
