"use client"

import React from "react"
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
} from "lucide-react"

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
   Component
===================== */
const OrderRadiologi: React.FC = () => {
  return (
    <Card className="mt-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScanHeart className="w-5 h-5 text-yellow-600" />
          Order Radiologi
        </CardTitle>

        <Button size="sm" className="h-8 gap-1">
          <Plus className="w-4 h-4" />
          Order
        </Button>
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
