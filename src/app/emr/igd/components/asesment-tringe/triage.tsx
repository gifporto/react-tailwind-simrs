"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
    Save,
    RotateCcw,
    Info,
    Brain,
    Heart,
    Activity,
    PlusCircle,
    Bone,
    Loader2,
    ChevronDownIcon,
    CalendarIcon
} from 'lucide-react';

// Shadcn UI Components for Date & Time
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

// Import API
import { TriageAPI, AsesmentTriageAPI } from '@/lib/api';

// --- Types ---
type TriageCategory = 'merah' | 'kuning' | 'hijau' | 'biru' | 'hitam';

interface Props {
    initialData?: any;
    editable?: boolean;
}

const TriageAssessmentTable: React.FC<Props> = ({ initialData, editable = false }) => {
    const { id } = useParams<{ id: string }>();

    // States
    const [triageOptions, setTriageOptions] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);

    const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);

    // Split waktu_triage internal state for Shadcn components
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>(format(new Date(), "HH:mm"));

    const [formData, setFormData] = useState({
        kategori_triage: '' as TriageCategory | '',
        petugas_triage: '',
        catatan_triage: ''
    });

    // 1. Fetch Opsi Kriteria
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const res = await TriageAPI.getList();
                if (res?.data) setTriageOptions(res.data);
            } catch (err) {
                console.error("Gagal load master kriteria:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    // 2. Sinkronisasi initialData
    useEffect(() => {
        if (initialData) {
            const savedIds = initialData.kriteria_penilaian?.map((k: any) => k.criteria_id) || [];
            setSelectedCriteria(savedIds);

            const initialWaktu = initialData.waktu_triage ? new Date(initialData.waktu_triage) : new Date();
            setDate(initialWaktu);
            setTime(format(initialWaktu, "HH:mm"));

            setFormData({
                kategori_triage: (initialData.tingkat_triage?.toLowerCase() as TriageCategory) || '',
                petugas_triage: initialData.petugas_triage || '',
                catatan_triage: initialData.catatan_triage || ''
            });
        }
    }, [initialData]);

    // 3. LOGIKA AUTO SELECT KATEGORI
    useEffect(() => {
        if (!triageOptions || selectedCriteria.length === 0) return;
        const levels: TriageCategory[] = ['merah', 'kuning', 'hijau', 'biru'];
        let highestLevel: TriageCategory | '' = '';

        for (const level of levels) {
            const hasMatch = Object.values(triageOptions).some((categoryGroup: any) =>
                categoryGroup[level]?.some((item: any) => selectedCriteria.includes(item.id))
            );
            if (hasMatch) {
                highestLevel = level;
                break;
            }
        }
        if (highestLevel) {
            setFormData(prev => ({ ...prev, kategori_triage: highestLevel }));
        }
    }, [selectedCriteria, triageOptions]);

    const handleSave = async () => {
        if (!id) return;
        if (!formData.kategori_triage) return toast.error("Kategori triage wajib dipilih");
        if (!date) return toast.error("Tanggal pemeriksaan wajib diisi");

        try {
            setIsSubmitting(true);
            const kriteriaFormatted: any[] = [];

            if (triageOptions) {
                Object.entries(triageOptions).forEach(([category, groups]: any) => {
                    Object.entries(groups).forEach(([level, items]: any) => {
                        items.forEach((item: any) => {
                            if (selectedCriteria.includes(item.id)) {
                                kriteriaFormatted.push({ category, level, criteria_id: item.id, criteria_label: item.label });
                            }
                        });
                    });
                });
            }

            // Combine Date and Time for Payload
            const combinedDateTime = new Date(date);
            const [hours, minutes] = time.split(':');
            combinedDateTime.setHours(parseInt(hours), parseInt(minutes));

            const year = combinedDateTime.getFullYear();
            const month = String(combinedDateTime.getMonth() + 1).padStart(2, '0');
            const day = String(combinedDateTime.getDate()).padStart(2, '0');
            const hh = String(combinedDateTime.getHours()).padStart(2, '0');
            const mm = String(combinedDateTime.getMinutes()).padStart(2, '0');
            const ss = "00";

            const localISOTime = `${year}-${month}-${day}T${hh}:${mm}:${ss}`;

            const payload = {
                tingkat_triage: formData.kategori_triage.toUpperCase(),
                kriteria_penilaian: kriteriaFormatted,
                kategori_terpilih: formData.kategori_triage,
                waktu_triage: localISOTime,
                petugas_triage: formData.petugas_triage,
                catatan_triage: formData.catatan_triage
            };

            await AsesmentTriageAPI.update(id, payload);
            toast.success("Data triage berhasil disimpan");
        } catch (err) {
            toast.error("Gagal menyimpan data triage");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckboxChange = (criteriaId: string) => {
        if (!editable || !triageOptions) return;
        setSelectedCriteria(prev => {
            const isSelected = prev.includes(criteriaId);
            if (isSelected) return prev.filter(i => i !== criteriaId);

            let clickedLevel: string | null = null;
            for (const groups of Object.values(triageOptions) as Record<string, any>[]) {
                for (const [level, items] of Object.entries(groups as any)) {
                    if ((items as { id: string }[]).some((i) => i.id === criteriaId)) {
                        clickedLevel = level;
                        break;
                    }
                }
                if (clickedLevel) break;
            }

            const sameLevelOnly = prev.filter(existingId => {
                let existingLevel: string | null = null;
                for (const groups of Object.values(triageOptions) as Record<string, any>[]) {
                    for (const [level, items] of Object.entries(groups as any)) {
                        if ((items as { id: string }[]).some((i) => i.id === existingId)) {
                            existingLevel = level;
                            break;
                        }
                    }
                    if (existingLevel) break;
                }
                return existingLevel === clickedLevel;
            });
            return [...sameLevelOnly, criteriaId];
        });
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    const rows = [
        { key: 'jalanNafas', label: 'Jalan Nafas', icon: <Bone className="h-5 w-5 text-blue-500" /> },
        { key: 'polaPernafasan', label: 'Pola Pernafasan', icon: <Activity className="h-5 w-5 text-cyan-500" /> },
        { key: 'sirkulasi', label: 'Sirkulasi', icon: <Heart className="h-5 w-5 text-red-500" /> },
        { key: 'disability', label: 'Disability', icon: <Brain className="h-5 w-5 text-amber-500" /> },
        { key: 'lainLain', label: 'Lain-Lain', icon: <PlusCircle className="h-5 w-5 text-gray-500" /> },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-bold">Tabel Kriteria Penilaian</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-hidden rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px] border-r font-bold text-center">PEMERIKSAAN</TableHead>
                                    <TableHead className="border-r text-red-600 font-bold">🔴 LEVEL 1</TableHead>
                                    <TableHead className="border-r text-yellow-600 font-bold">🟡 LEVEL 2</TableHead>
                                    <TableHead className="border-r text-green-600 font-bold">🟢 LEVEL 3</TableHead>
                                    <TableHead className="text-blue-600 font-bold">🔵 LEVEL 4</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.key}>
                                        <TableCell className="text-center font-bold border-r bg-slate-50/50">
                                            <div className="flex flex-col items-center gap-1">
                                                {row.icon}
                                                <span className="text-[10px] uppercase">{row.label}</span>
                                            </div>
                                        </TableCell>
                                        {['merah', 'kuning', 'hijau', 'biru'].map((level) => (
                                            <TableCell key={level} className="p-2 border-r align-top">
                                                <div className="space-y-2">
                                                    {triageOptions?.[row.key]?.[level]?.map((item: any) => (
                                                        <div key={item.id} className="flex items-start space-x-2">
                                                            <Checkbox
                                                                id={item.id}
                                                                disabled={!editable}
                                                                checked={selectedCriteria.includes(item.id)}
                                                                onCheckedChange={() => handleCheckboxChange(item.id)}
                                                            />
                                                            <Label htmlFor={item.id} className="text-[10px] leading-tight cursor-pointer">{item.label}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-bold"><Info className="h-4 w-4" />Hasil Akhir Triage</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Kategori Triage */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Kategori Triage</Label>
                            <Select
                                disabled
                                value={formData.kategori_triage}
                                onValueChange={(v: TriageCategory) => setFormData(p => ({ ...p, kategori_triage: v }))}
                            >
                                <SelectTrigger className='w-full h-9'><SelectValue placeholder="Pilih" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="merah">🔴 MERAH</SelectItem>
                                    <SelectItem value="kuning">🟡 KUNING</SelectItem>
                                    <SelectItem value="hijau">🟢 HIJAU</SelectItem>
                                    <SelectItem value="biru">🔵 BIRU</SelectItem>
                                    <SelectItem value="hitam">⚫ HITAM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Shadcn UI Date Picker */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Tanggal</Label>
                            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        disabled={!editable}
                                        className="w-full h-9 justify-between font-normal text-xs"
                                    >
                                        {date ? format(date, "dd/MM/yyyy") : "Pilih Tanggal"}
                                        <CalendarIcon className="h-3 w-3 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => { setDate(d); setOpenCalendar(false); }}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Shadcn UI Time Picker Look-alike */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Waktu</Label>
                            <Input
                                type="time"
                                disabled={!editable}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="h-9 text-xs bg-background appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50"
                            />
                        </div>

                        {/* Petugas */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Petugas</Label>
                            <Input
                                type="text"
                                disabled={!editable}
                                value={formData.petugas_triage}
                                onChange={(e) => setFormData(p => ({ ...p, petugas_triage: e.target.value }))}
                                placeholder="Nama Petugas"
                                className="h-9 text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold">Catatan Klinis</Label>
                        <Textarea
                            disabled={!editable}
                            value={formData.catatan_triage}
                            onChange={(e) => setFormData(p => ({ ...p, catatan_triage: e.target.value }))}
                            rows={3}
                            placeholder="Tambahkan catatan klinis..."
                            className="text-xs"
                        />
                    </div>

                    {editable && (
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" size="sm" onClick={() => {
                                setSelectedCriteria([]);
                                setFormData(prev => ({ ...prev, kategori_triage: '' }));
                                setDate(new Date());
                            }}><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
                            <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                                Simpan Triage
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TriageAssessmentTable;