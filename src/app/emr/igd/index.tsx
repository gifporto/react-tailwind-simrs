// /src/app/emr/igd/index.tsx
"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  Search,
  Eye,
  Ambulance,
  Mars,
  Venus,
} from "lucide-react";

/* =======================
   TYPE DATA
======================= */
type EmrIgd = {
  no_reg: string;
  jam: string;
  tgl_periksa: string;
  norm: string;
  pasien: {
    nama: string;
    sex: "L" | "P";
    umur: number;
    alamat: string;
  };
  dokter: string;
  poli: string;
  tipe_pasien?: string;
};

/* =======================
   DUMMY DATA
======================= */
const DUMMY_DATA: EmrIgd[] = [
  {
    no_reg: "IGD-0001",
    jam: "08:15",
    tgl_periksa: "2025-12-16",
    norm: "RM000123",
    pasien: {
      nama: "Budi Santoso",
      sex: "L",
      umur: 34,
      alamat: "Jl. Merdeka No. 10 Jakarta",
    },
    dokter: "dr. Andi Pratama",
    poli: "IGD",
    tipe_pasien: "UMUM",
  },
  {
    no_reg: "IGD-0002",
    jam: "09:40",
    tgl_periksa: "2025-12-16",
    norm: "RM000124",
    pasien: {
      nama: "Siti Aminah",
      sex: "P",
      umur: 28,
      alamat: "Jl. Sudirman No. 22 Bandung",
    },
    dokter: "dr. Rina Lestari",
    poli: "IGD",
    tipe_pasien: "BPJS",
  },
  {
    no_reg: "IGD-0003",
    jam: "11:05",
    tgl_periksa: "2025-12-16",
    norm: "RM000125",
    pasien: {
      nama: "Ahmad Fauzi",
      sex: "L",
      umur: 45,
      alamat: "Jl. Ahmad Yani No. 5 Surabaya",
    },
    dokter: "dr. Bagus Wijaya",
    poli: "IGD",
  },
];

/* =======================
   COMPONENT
======================= */
export default function EmrIgdIndexPage() {
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [tanggal, setTanggal] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [page, setPage] = React.useState(1);

  const limit = 10;

  /* =======================
     FILTER DUMMY DATA
  ======================= */
  const filteredData = DUMMY_DATA.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.no_reg.toLowerCase().includes(keyword) ||
      item.norm.toLowerCase().includes(keyword) ||
      item.pasien.nama.toLowerCase().includes(keyword)
    );
  });

  const total = filteredData.length;
  const lastPage = Math.ceil(total / limit);

  const paginatedData = filteredData.slice(
    (page - 1) * limit,
    page * limit
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const GenderIcon = ({ sex }: { sex: "L" | "P" }) =>
    sex === "L" ? (
      <Mars className="w-3 h-3 text-blue-500" />
    ) : (
      <Venus className="w-3 h-3 text-pink-500" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="border-b">
          <div className="space-y-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                <Ambulance className="w-6 h-6" />
                EMR IGD
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Electronic Medical Record Instalasi Gawat Darurat
              </p>
            </div>

            {/* FILTER */}
            <div className="flex flex-wrap gap-3 items-end">
              <Input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-[180px]"
              />

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="No. Reg, NORM, atau Nama Pasien"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <Badge variant="secondary">
                {total} registrasi
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {paginatedData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Ambulance className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Tidak ada data registrasi IGD
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>No</TableHead>
                        <TableHead>No. Reg</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>NORM</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedData.map((item, i) => (
                        <TableRow key={item.no_reg}>
                          <TableCell>
                            {(page - 1) * limit + i + 1}
                          </TableCell>

                          <TableCell>
                            <Badge variant="destructive">
                              {item.no_reg}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {item.jam}
                            </div>
                          </TableCell>

                          <TableCell>
                            {formatDate(item.tgl_periksa)}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">
                              {item.norm}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="font-medium">
                              {item.pasien.nama}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <GenderIcon sex={item.pasien.sex} />
                              {item.pasien.umur} th
                            </div>
                          </TableCell>

                          <TableCell className="max-w-[220px] truncate">
                            {item.pasien.alamat}
                          </TableCell>

                          <TableCell>{item.dokter}</TableCell>

                          <TableCell>{item.poli}</TableCell>

                          <TableCell>
                            {item.tipe_pasien ? (
                              <Badge variant="info">
                                {item.tipe_pasien}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>

                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/emr/igd/detail/${item.no_reg}`)
                              }
                              className="gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {(page - 1) * limit + 1} –{" "}
                    {Math.min(page * limit, total)} dari {total}
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 1 && setPage(page - 1)}
                        />
                      </PaginationItem>

                      {Array.from({ length: lastPage }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={page === i + 1}
                            onClick={() => setPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            page < lastPage && setPage(page + 1)
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
