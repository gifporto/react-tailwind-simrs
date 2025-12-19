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
type Status = "ordered" | "proses" | "selesai" | "dibatalkan"

interface RadiologiItem {
  id: number
  nama: string
  kode: string
  kontras?: "non-kontras" | "dengan-kontras"
  status: Status
}

interface RadiologiOrder {
  id: number
  nomor: string
  tanggal: string
  status: Status
  catatan?: string
  total: number
  hasil?: boolean
  items: RadiologiItem[]
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
   Dummy Data
===================== */
const radiologiOrders: RadiologiOrder[] = [
  {
    id: 1,
    nomor: "RAD-001",
    tanggal: "16/12/2025 11:20",
    status: "ordered",
    catatan: "Pasien trauma kepala",
    total: 450000,
    items: [
      {
        id: 1,
        nama: "CT Scan Kepala",
        kode: "CT-HD",
        kontras: "non-kontras",
        status: "ordered",
      },
      {
        id: 2,
        nama: "Rontgen Thorax",
        kode: "XR-THX",
        status: "ordered",
      },
    ],
  },
  {
    id: 2,
    nomor: "RAD-002",
    tanggal: "15/12/2025 09:10",
    status: "selesai",
    total: 250000,
    hasil: true,
    items: [
      {
        id: 1,
        nama: "USG Abdomen",
        kode: "USG-ABD",
        status: "selesai",
      },
    ],
  },
]

/* =====================
   Helpers
===================== */
const statusBadge = (status: Status) => {
  switch (status) {
    case "ordered":
      return "secondary"
    case "proses":
      return "default"
    case "selesai":
      return "success"
    case "dibatalkan":
      return "destructive"
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
  return (
    <Card className="mt-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScanHeart className="w-5 h-5 text-yellow-600" />
          Order Radiologi
        </CardTitle>

        <OrderFormDialog igdId={igdId} />
      </CardHeader>

      <CardContent className="space-y-3">
        {radiologiOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded-md px-3 py-2 space-y-2"
          >
            {/* Header Order */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <ScanHeart className="w-4 h-4 text-muted-foreground mt-0.5" />

                <div className="leading-tight">
                  <p className="text-sm font-medium">
                    {order.nomor}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {order.tanggal}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={statusBadge(order.status)}
                  className="text-xs"
                >
                  {order.status}
                </Badge>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <Eye className="w-4 h-4" />
                  </Button>

                  {order.status === "ordered" && (
                    <>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-7 w-7">
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {order.status === "proses" && (
                    <>
                      <Button variant="success" size="icon" className="h-7 w-7">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-7 w-7">
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {order.status === "selesai" && (
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Catatan */}
            {order.catatan && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground flex gap-1 items-center">
                  <Info className="w-3 h-3" />
                  {order.catatan}
                </p>
              </>
            )}

            {/* Items */}
            <div className="flex flex-wrap gap-1">
              {order.items.slice(0, 6).map((item) => (
                <Badge
                  key={item.id}
                  variant={statusBadge(item.status)}
                  className="text-xs font-normal"
                >
                  {item.nama}
                  {item.kontras && item.kontras !== "non-kontras" && (
                    <span className="ml-1">(Kontras)</span>
                  )}
                </Badge>
              ))}
              {order.items.length > 6 && (
                <span className="text-xs text-muted-foreground">
                  +{order.items.length - 6} lainnya
                </span>
              )}
            </div>

            {/* Result & Cost */}
            <Separator />

            <div className="flex items-center justify-between text-xs">
              {order.hasil ? (
                <div className="flex items-center gap-1 text-primary">
                  <FileImage className="w-4 h-4" />
                  Hasil tersedia
                </div>
              ) : (
                <span className="text-muted-foreground">
                  Belum ada hasil
                </span>
              )}

              <strong className="text-green-600">
                {rupiah(order.total)}
              </strong>
            </div>
          </div>
        ))}

        {radiologiOrders.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <ScanHeart className="mx-auto mb-2" />
            Belum ada order radiologi
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderRadiologi
