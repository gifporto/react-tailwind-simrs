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
  Hospital,
  Clock,
  CheckCircle,
  LogOut,
  User,
} from "lucide-react"

/* =====================
   Types
===================== */
type KunjunganUnitItem = {
  id: string
  no_reg: string
  poli: {
    nama: string
    singkatan?: string
  }
  dokter?: {
    nama: string
    nik?: string
    str?: string
  }
  tgl: string
  no_antrian?: string
  is_closed: boolean
  is_checkin: boolean
  checkin_time?: string
}

/* =====================
   Dummy Data
===================== */
const dummyKunjunganUnit: KunjunganUnitItem[] = [
  {
    id: "1",
    no_reg: "REG-001",
    poli: {
      nama: "Instalasi Gawat Darurat",
      singkatan: "IGD",
    },
    dokter: {
      nama: "dr. Andi Wijaya",
      nik: "317xxxx",
      str: "STR-001",
    },
    tgl: "2025-12-16T09:20",
    no_antrian: "A-01",
    is_closed: false,
    is_checkin: true,
    checkin_time: "09:25:00",
  },
  {
    id: "2",
    no_reg: "REG-001",
    poli: {
      nama: "Radiologi",
    },
    tgl: "2025-12-16T10:15",
    is_closed: true,
    is_checkin: true,
    checkin_time: "10:18:00",
  },
]

/* =====================
   Component
===================== */
export default function KunjunganUnit() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="w-5 h-5" />
          Kunjungan Unit
        </CardTitle>
      </CardHeader>

      <CardContent>
        {dummyKunjunganUnit.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Registrasi</TableHead>
                  <TableHead>Unit / Poli</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Antrian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dummyKunjunganUnit.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge>{item.no_reg}</Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {item.poli.nama}
                      </div>
                      {item.poli.singkatan && (
                        <p className="text-sm text-muted-foreground">
                          {item.poli.singkatan}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      {item.dokter ? (
                        <div>
                          <p className="font-medium">
                            {item.dokter.nama}
                          </p>
                          {item.dokter.nik && (
                            <p className="text-xs text-muted-foreground">
                              NIK: {item.dokter.nik}
                            </p>
                          )}
                          {item.dokter.str && (
                            <p className="text-xs text-muted-foreground">
                              STR: {item.dokter.str}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Belum ditentukan
                        </span>
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
                      {item.no_antrian ? (
                        <Badge variant="secondary">
                          {item.no_antrian}
                        </Badge>
                      ) : (
                        "-"
                      )}
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
                          Berlangsung
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {item.is_checkin ? (
                        <div>
                          <Badge className="gap-1 bg-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Check-in
                          </Badge>
                          {item.checkin_time && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.checkin_time}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">
                          Belum Check-in
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {!item.is_closed ? (
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <User className="w-3 h-3" />
                            {item.dokter ? "Ubah" : "Tambah"}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                          >
                            <LogOut className="w-3 h-3" />
                            Tutup
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          ✔ Selesai
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <Hospital className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p className="font-medium">
              Belum ada kunjungan unit
            </p>
            <p className="text-sm">
              Data akan muncul setelah pasien didaftarkan ke unit/poli
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
