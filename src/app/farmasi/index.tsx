"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResepList } from "@/hooks/queries/farmasi/use-resep-queries"; // Import Hooks

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Search, Eye, Pill, Loader2, ClipboardList } from "lucide-react";
import { CustomPagination } from "@/components/shared/pagination";

export default function FarResepIndexPage() {
    const navigate = useNavigate();
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const perPage = 10;

    // Menggunakan Custom Hook
    const { data: apiResponse, isLoading, isError, refetch } = useResepList();

    const listData = apiResponse?.data || [];
    const total = apiResponse?.meta?.pagination?.total || 0;

    const filteredData = listData.filter((item: any) => {
        const keyword = search.toLowerCase();
        return (
            item.pasien?.nama?.toLowerCase().includes(keyword) ||
            item.pasien?.norm?.toLowerCase().includes(keyword) ||
            item.kunjungan?.no_reg?.toLowerCase().includes(keyword)
        );
    });

    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case "disetujui": return "success"; // solid/success
            case "draft": return "secondary";
            default: return "outline";
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <CardHeader className="border-b">
                    <div className="space-y-4">
                        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
                            <Pill className="w-6 h-6" /> Farmasi Resep
                        </CardTitle>
                        <div className="flex flex-wrap gap-3">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari Pasien / No. Reg..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                            </div>
                        ) : (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead>Registrasi</TableHead>
                                            <TableHead>Pasien</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-bold">{item.kunjungan?.no_reg}</TableCell>
                                                <TableCell>
                                                    <div className="font-semibold">{item.pasien?.nama}</div>
                                                    <div className="text-[10px] text-muted-foreground">RM: {item.pasien?.norm}</div>
                                                </TableCell>
                                                <TableCell>{item.unit?.nama}</TableCell>
                                                <TableCell>
                                                    <Badge variant={`${getStatusVariant(item.status)}`} className="uppercase">
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/farmasi/resep/detail/${item.id}`)}>
                                                        <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
}