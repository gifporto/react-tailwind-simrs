"use client";

import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data
const dummyPrescriptions = [
    {
        no_resep: "RSP-001",
        kd_sts_resep: "OK",
        tgl_resep: "2025-12-17 10:00",
        dokter: { nama: "Dr. Aditya" },
        is_terima: true,
        alergi: "Y",
        ket_alergi: "Alergi Paracetamol",
        hamil: "N",
        menyusui: "N",
        details: [
            {
                obat: { desk_brg: "Paracetamol", generik: "Acetaminophen", satuan: { desk_satuan: "Tablet" } },
                qty: 10,
                pagi: 1,
                siang: 1,
                sore: 1,
                malam: 0,
                signa: null,
                cara_pakai: "Diminum setelah makan",
                indikasi: "Demam",
                intruksi_khusus: "",
                catatan: "",
            },
            {
                obat: { desk_brg: "Amoxicillin", generik: null, satuan: { desk_satuan: "Kapsul" } },
                qty: 20,
                pagi: 1,
                siang: 0,
                sore: 1,
                malam: 1,
                signa: null,
                cara_pakai: "Diminum sebelum makan",
                indikasi: "Infeksi",
                intruksi_khusus: "Hati-hati alergi",
                catatan: "",
            },
        ],
    },
    {
        no_resep: "RSP-002",
        kd_sts_resep: null,
        tgl_resep: "2025-12-17 11:00",
        dokter: null,
        is_terima: false,
        alergi: "N",
        hamil: "Y",
        menyusui: "Y",
        details: [],
    },
];

export const Prescription = () => {
    return (
        <AccordionItem value="prescription" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 font-semibold flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">15</Badge> Peresepan Dokter
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="flex justify-end mb-3">
                    <Button size="sm" variant="default">Tambah Resep</Button>
                </div>

                {dummyPrescriptions.length > 0 ? (
                    dummyPrescriptions.map((resep, idx) => (
                        <div key={idx} className="mb-4 p-3 border rounded-md space-y-3">
                            {/* Header resep */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Badge variant="secondary">{resep.no_resep}</Badge>
                                        {resep.kd_sts_resep && <Badge variant="outline">{resep.kd_sts_resep}</Badge>}
                                    </div>
                                    <small className="text-muted-foreground">
                                        {resep.tgl_resep} {resep.dokter?.nama && `| ${resep.dokter.nama}`}
                                    </small>
                                </div>
                                <Badge variant={resep.is_terima ? "success" : "warning"}>
                                    {resep.is_terima ? "Diterima" : "Pending"}
                                </Badge>
                            </div>

                            {/* Alert alergi/hamil/menyusui */}
                            {(resep.alergi === "Y" || resep.hamil === "Y" || resep.menyusui === "Y") && (
                                <Alert variant="warning">
                                    <AlertTitle>Perhatian</AlertTitle>
                                    <AlertDescription className="flex flex-wrap gap-2">
                                        {resep.alergi === "Y" && <Badge variant="destructive">Alergi</Badge>}
                                        {resep.ket_alergi && <span>{resep.ket_alergi}</span>}
                                        {resep.hamil === "Y" && <Badge variant="warning">Hamil</Badge>}
                                        {resep.menyusui === "Y" && <Badge variant="secondary">Menyusui</Badge>}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Table obat */}
                            {resep.details.length > 0 ? (
                                <div className="overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>No</TableHead>
                                                <TableHead>Nama Obat</TableHead>
                                                <TableHead>Jumlah</TableHead>
                                                <TableHead>Aturan Pakai</TableHead>
                                                <TableHead>Cara Pakai</TableHead>
                                                <TableHead>Keterangan</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resep.details.map((detail, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <strong>{detail.obat?.desk_brg ?? "Unknown"}</strong>
                                                        {detail.obat?.generik && (
                                                            <>
                                                                <br />
                                                                <small className="text-muted-foreground">{detail.obat.generik}</small>
                                                            </>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{detail.qty} {detail.obat?.satuan?.desk_satuan}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {detail.pagi && <Badge variant="warning">Pagi: {detail.pagi}</Badge>}
                                                            {detail.siang && <Badge variant="success">Siang: {detail.siang}</Badge>}
                                                            {detail.sore && <Badge variant="secondary">Sore: {detail.sore}</Badge>}
                                                            {detail.malam && <Badge variant="default">Malam: {detail.malam}</Badge>}
                                                            {!detail.pagi && !detail.siang && !detail.sore && !detail.malam && (detail.signa ?? "-")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{detail.cara_pakai ?? "-"}</TableCell>
                                                    <TableCell className="space-y-1">
                                                        {detail.indikasi && <div><strong>Indikasi:</strong> {detail.indikasi}</div>}
                                                        {detail.intruksi_khusus && <div><strong>Instruksi:</strong> {detail.intruksi_khusus}</div>}
                                                        {detail.catatan && <div><strong>Catatan:</strong> {detail.catatan}</div>}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">Belum ada detail obat</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-muted-foreground">Belum ada resep untuk pasien ini</div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};
