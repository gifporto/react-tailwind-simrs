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
  FlaskConical,
  Plus,
  Eye,
  Play,
  Check,
  X,
  FileText,
  Calendar,
} from "lucide-react"

type Status = "pending" | "proses" | "selesai" | "batal"

interface LabItem {
  id: number
  nama: string
  kode: string
  status: Status
}

interface LabOrder {
  id: number
  nomor: string
  tanggal: string
  status: Status
  catatan?: string
  items: LabItem[]
}

/* =====================
   Dummy Data
===================== */
const orders: LabOrder[] = [
  {
    id: 1,
    nomor: "LAB-001",
    tanggal: "16/12/2024 10:30",
    status: "pending",
    catatan: "Puasa 8 jam",
    items: [
      { id: 1, nama: "Hemoglobin", kode: "HB", status: "pending" },
      { id: 2, nama: "Leukosit", kode: "WBC", status: "pending" },
      { id: 3, nama: "Trombosit", kode: "PLT", status: "pending" },
    ],
  },
  {
    id: 2,
    nomor: "LAB-002",
    tanggal: "15/12/2024 14:10",
    status: "proses",
    items: [
      { id: 1, nama: "Gula Darah", kode: "GD", status: "proses" },
      { id: 2, nama: "Kolesterol", kode: "CHOL", status: "selesai" },
      { id: 3, nama: "Asam Urat", kode: "AU", status: "pending" },
      { id: 4, nama: "SGOT", kode: "SGOT", status: "pending" },
    ],
  },
]

const badgeVariant = (status: Status) => {
  switch (status) {
    case "pending":
      return "secondary"
    case "proses":
      return "default"
    case "selesai":
      return "success"
    case "batal":
      return "destructive"
  }
}

const OrderLab: React.FC = () => {
  return (
    <Card className="mt-4">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FlaskConical className="w-5 h-5 text-primary" />
          Order Laboratorium
        </CardTitle>

        <Button size="sm" className="h-8 gap-1">
          <Plus className="w-4 h-4" />
          Order
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-md px-3 py-2 space-y-2"
          >
            {/* ROW ATAS */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />

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
                  variant={badgeVariant(order.status)}
                  className="text-xs"
                >
                  {order.status}
                </Badge>

                {/* Action buttons */}
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <Eye className="w-4 h-4" />
                  </Button>

                  {order.status === "pending" && (
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
                </div>
              </div>
            </div>

            {/* CATATAN */}
            {order.catatan && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  📝 {order.catatan}
                </p>
              </>
            )}

            {/* ITEM TEST */}
            <div className="flex flex-wrap gap-1">
              {order.items.slice(0, 6).map((item) => (
                <Badge
                  key={item.id}
                  variant={badgeVariant(item.status)}
                  className="text-xs font-normal"
                >
                  {item.nama}
                </Badge>
              ))}

              {order.items.length > 6 && (
                <span className="text-xs text-muted-foreground">
                  +{order.items.length - 6} lainnya
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default OrderLab
