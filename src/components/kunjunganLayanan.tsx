"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Stethoscope,
  Plus,
  CheckCircle,
  Clock,
  Pencil,
} from "lucide-react"

/* =====================
   Types
===================== */
type LayananItem = {
  no_transaksi: string
  desk_layanan: string
  keterangan?: string
  kategori?: string
  tgl: string
  is_closed: boolean
  harga: number
  qty: number
}

/* =====================
   Dummy Data
===================== */
const dummyLayanan: LayananItem[] = [
  {
    no_transaksi: "LYN-001",
    desk_layanan: "Pemeriksaan Dokter Umum",
    keterangan: "Pemeriksaan awal pasien",
    kategori: "Medis",
    tgl: "2025-12-16T09:30",
    is_closed: false,
    harga: 50000,
    qty: 1,
  },
  {
    no_transaksi: "LYN-002",
    desk_layanan: "Pemasangan Infus",
    kategori: "Tindakan",
    tgl: "2025-12-16T10:00",
    is_closed: true,
    harga: 150000,
    qty: 1,
  },
]

/* =====================
   Component
===================== */
export default function KunjunganLayanan() {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          Kunjungan Layanan
        </CardTitle>

        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </Button>
      </CardHeader>

      <CardContent>
        {dummyLayanan.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Layanan</TableHead>
                  <TableHead>Jenis Layanan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Biaya</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dummyLayanan.map((item) => {
                  const total = item.harga * item.qty

                  return (
                    <TableRow key={item.no_transaksi}>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.no_transaksi}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">
                          {item.desk_layanan}
                        </div>
                        {item.keterangan && (
                          <p className="text-sm text-muted-foreground">
                            {item.keterangan}
                          </p>
                        )}
                      </TableCell>

                      <TableCell>
                        {item.kategori ? (
                          <Badge variant="outline">
                            {item.kategori}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell>
                        <div>
                          {new Date(item.tgl).toLocaleDateString("id-ID")}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.tgl).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB
                        </p>
                      </TableCell>

                      <TableCell>
                        {item.is_closed ? (
                          <Badge className="gap-1 bg-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Selesai
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            Proses
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {item.harga > 0 ? (
                          <>
                            <span className="font-semibold text-green-600">
                              Rp{" "}
                              {total.toLocaleString("id-ID")}
                            </span>
                            {item.qty > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {item.qty} x Rp{" "}
                                {item.harga.toLocaleString("id-ID")}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            Gratis
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {!item.is_closed ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Update
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            ✔ Selesai
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <Stethoscope className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p className="font-medium">
              Belum ada layanan untuk kunjungan ini
            </p>
            <p className="text-sm">
              Data layanan akan muncul setelah pasien mendapat layanan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
