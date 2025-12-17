"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    CheckCircle,
    Printer,
    Save,
    RotateCcw,
    Info,
    Brain,
    Heart,
    Activity,
    PlusCircle,
    Bone
} from 'lucide-react';

// Types
type TriageCategory = 'merah' | 'kuning' | 'hijau' | 'biru' | 'hitam';

interface TriageCriteria {
    kode_kriteria: string;
    kategori: string;
    deskripsi: string;
    skor: number;
}

interface TriageAssessment {
    id?: string;
    kategori_terpilih: TriageCategory;
    created_at: string;
    petugas_triage: string;
    kriteria_penilaian: TriageCriteria[];
    catatan_triage?: string;
}

// Dummy data - dimasukkan langsung di view
const dummyTriageAssessment: TriageAssessment | null = {
    id: '1',
    kategori_terpilih: 'kuning',
    created_at: new Date().toISOString(),
    petugas_triage: 'Dr. Andi Wijaya',
    kriteria_penilaian: [
        { kode_kriteria: 'jn_sumbatan_partial', kategori: 'Kuning', deskripsi: 'Sumbatan Partial', skor: 3 },
        { kode_kriteria: 'pp_dyspnea', kategori: 'Kuning', deskripsi: 'Dyspnea', skor: 3 },
        { kode_kriteria: 's_pucat_nadi_lemah', kategori: 'Kuning', deskripsi: 'Pucat dgn nadi lemah', skor: 3 },
    ],
    catatan_triage: 'Pasien mengeluh sesak napas dan pucat, perlu observasi ketat.'
};

const patientInfo = {
    no_kunjungan: 'KJ-2024-001',
    no_rm: 'RM-123456'
};

// Format date helper
const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' WIB';
};

// Category config
const categoryConfig = {
    merah: {
        label: '🔴 MERAH (RESUSITASI)',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        badgeColor: 'bg-red-100 text-red-800',
        alertVariant: 'destructive' as const
    },
    kuning: {
        label: '🟡 KUNING (URGENSI)',
        bgColor: 'bg-yellow-500',
        textColor: 'text-gray-900',
        badgeColor: 'bg-yellow-100 text-yellow-800',
        alertVariant: 'default' as const
    },
    hijau: {
        label: '🟢 HIJAU (SEMI-URGEN)',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        badgeColor: 'bg-green-100 text-green-800',
        alertVariant: 'default' as const
    },
    biru: {
        label: '🔵 BIRU (TIDAK URGEN)',
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        badgeColor: 'bg-blue-100 text-blue-800',
        alertVariant: 'default' as const
    },
    hitam: {
        label: '⚫ HITAM (MENINGGAL)',
        bgColor: 'bg-gray-900',
        textColor: 'text-white',
        badgeColor: 'bg-gray-100 text-gray-800',
        alertVariant: 'default' as const
    }
};

// Triage criteria data
const triageCriteria = {
    jalanNafas: {
        merah: [
            { id: 'jn_sumbatan_total', label: 'Sumbatan Total' },
            { id: 'jn_stridor', label: 'Stridor' }
        ],
        kuning: [
            { id: 'jn_risiko_gangguan', label: 'Risiko gangguan' },
            { id: 'jn_sumbatan_partial', label: 'Sumbatan Partial' }
        ],
        hijau: [
            { id: 'jn_bebas', label: 'Bebas' }
        ],
        biru: [
            { id: 'jn_bebas_4', label: 'Bebas' }
        ]
    },
    polaPernafasan: {
        merah: [
            { id: 'pp_apneu', label: 'Apneu' },
            { id: 'pp_bradypneu', label: 'Bradypneu' },
            { id: 'pp_sianosis_sentral', label: 'Sianosis sentral' },
            { id: 'pp_distress_berat', label: 'Distress Berat' },
            { id: 'pp_kussmaul', label: 'Kussmaul' }
        ],
        kuning: [
            { id: 'pp_dyspnea', label: 'Dyspnea' },
            { id: 'pp_mengi', label: 'Mengi' },
            { id: 'pp_sucking_chest', label: 'Sucking chest wound' },
            { id: 'pp_nafas_paradoksal', label: 'Nafas paradoksal' },
            { id: 'pp_retraksi_dada', label: 'Retraksi Dada' },
            { id: 'pp_sianois', label: 'Sianois' },
            { id: 'pp_gelisah', label: 'Gelisah' }
        ],
        hijau: [
            { id: 'pp_mengi_ringan', label: 'Mengi Ringan' }
        ],
        biru: [
            { id: 'pp_dewasa_12_20', label: 'Dewasa : 12-20' },
            { id: 'pp_kurang_2_bulan', label: '< 2 Bulan : < 60' },
            { id: 'pp_2_12_bulan', label: '2-12 bulan : < 50' },
            { id: 'pp_1_5_tahun', label: '1-5 tahun : < 40' },
            { id: 'pp_lebih_5_tahun', label: '> 5 tahun : < 30' }
        ]
    },
    // Data lainnya akan ditambahkan berikutnya...
};

const TriageAssessmentTable: React.FC = () => {
    const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        kategori_triage: '' as TriageCategory | '',
        waktu_triage: new Date().toISOString().slice(0, 16),
        petugas_triage: '',
        catatan_triage: ''
    });

    // Initialize with dummy data
    useEffect(() => {
        if (dummyTriageAssessment) {
            setSelectedCriteria(dummyTriageAssessment.kriteria_penilaian.map(k => k.kode_kriteria));
            setFormData({
                kategori_triage: dummyTriageAssessment.kategori_terpilih,
                waktu_triage: new Date(dummyTriageAssessment.created_at).toISOString().slice(0, 16),
                petugas_triage: dummyTriageAssessment.petugas_triage,
                catatan_triage: dummyTriageAssessment.catatan_triage || ''
            });
        }
    }, []);

    const handleCheckboxChange = (id: string) => {
        setSelectedCriteria(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        if (confirm('Apakah Anda yakin ingin mereset semua data triage?')) {
            setSelectedCriteria([]);
            setFormData({
                kategori_triage: '' as TriageCategory | '',
                waktu_triage: new Date().toISOString().slice(0, 16),
                petugas_triage: '',
                catatan_triage: ''
            });
        }
    };

    const handleSave = () => {
        const selectedCategory = formData.kategori_triage;
        if (!selectedCategory) {
            alert('Kategori triage harus dipilih');
            return;
        }

        if (!formData.petugas_triage.trim()) {
            alert('Nama petugas harus diisi');
            return;
        }

        if (selectedCriteria.length === 0) {
            alert('Minimal pilih satu kriteria');
            return;
        }

        // Simulasi save ke API
        console.log('Saving triage data:', {
            ...formData,
            kriteria: selectedCriteria
        });

        alert(dummyTriageAssessment ? 'Data triage berhasil diperbarui!' : 'Data triage berhasil disimpan!');
    };

    const handlePrint = () => {
        window.print();
    };

    // Helper untuk render checkbox group
    const renderCheckboxGroup = (criteria: Array<{ id: string, label: string }>, level: TriageCategory) => {
        const config = categoryConfig[level];
        return (
            <div className={`p-3 ${level === 'merah' ? 'bg-red-50' : level === 'kuning' ? 'bg-yellow-50' : level === 'hijau' ? 'bg-green-50' : 'bg-blue-50'} rounded`}>
                <div className="space-y-2">
                    {criteria.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={item.id}
                                checked={selectedCriteria.includes(item.id)}
                                onCheckedChange={() => handleCheckboxChange(item.id)}
                            />
                            <Label htmlFor={item.id} className="text-sm font-medium">
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Status Indicator */}
            {dummyTriageAssessment && (
                <Alert variant="info">
                    <AlertDescription>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center">
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    <strong>
                                        Triage sudah dilakukan pada {formatDateTime(dummyTriageAssessment.created_at)} oleh {dummyTriageAssessment.petugas_triage}
                                    </strong>
                                </div>
                                <div className="mt-2">
                                    Level: {categoryConfig[dummyTriageAssessment.kategori_terpilih].label}
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                                className="bg-white hover:bg-gray-100"
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Triage Assessment Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Penilaian Triage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='border-r'>
                                        PEMERIKSAAN
                                    </TableHead>
                                    <TableHead className="border-r">
                                        <div className="font-bold">🔴 LEVEL 1</div>
                                        <div className="text-[10px] font-normal uppercase leading-tight">(Resusitasi)</div>
                                    </TableHead>
                                    <TableHead className="border-r">
                                        <div className="font-bold">🟡 LEVEL 2</div>
                                        <div className="text-[10px] font-normal uppercase leading-tight">(Urgensi)</div>
                                    </TableHead>
                                    <TableHead className="border-r">
                                        <div className="font-bold">🟢 LEVEL 3</div>
                                        <div className="text-[10px] font-normal uppercase leading-tight">(Semi-Urgen)</div>
                                    </TableHead>
                                    <TableHead className="border-r">
                                        <div className="font-bold">🔵 LEVEL 4</div>
                                        <div className="text-[10px] font-normal uppercase leading-tight">(Tidak Urgen)</div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* JALAN NAFAS */}
                                <TableRow className="bg-slate-50/50">
                                    <TableCell className="text-center font-bold border-r align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <Bone className="h-5 w-5 text-blue-500" />
                                            <span className="text-xs">Jalan Nafas</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-red-50/30">
                                        {renderCheckboxGroup(triageCriteria.jalanNafas.merah, 'merah')}
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-yellow-50/30">
                                        {renderCheckboxGroup(triageCriteria.jalanNafas.kuning, 'kuning')}
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-green-50/30">
                                        {renderCheckboxGroup(triageCriteria.jalanNafas.hijau, 'hijau')}
                                    </TableCell>
                                    <TableCell className="p-2 align-top bg-blue-50/30">
                                        {renderCheckboxGroup(triageCriteria.jalanNafas.biru, 'biru')}
                                    </TableCell>
                                </TableRow>

                                {/* POLA PERNAFASAN */}
                                <TableRow>
                                    <TableCell className="text-center font-bold border-r align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <Activity className="h-5 w-5 text-cyan-500" />
                                            <span className="text-xs">Pola Pernafasan</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-red-50/30">
                                        <div className="grid grid-cols-1 gap-2">
                                            {triageCriteria.polaPernafasan.merah.map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox
                                                        id={item.id}
                                                        checked={selectedCriteria.includes(item.id)}
                                                        onCheckedChange={() => handleCheckboxChange(item.id)}
                                                    />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {item.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-yellow-50/30">
                                        <div className="grid grid-cols-1 gap-2">
                                            {triageCriteria.polaPernafasan.kuning.map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox
                                                        id={item.id}
                                                        checked={selectedCriteria.includes(item.id)}
                                                        onCheckedChange={() => handleCheckboxChange(item.id)}
                                                    />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">
                                                        {item.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-green-50/30">
                                        {renderCheckboxGroup(triageCriteria.polaPernafasan.hijau, 'hijau')}
                                    </TableCell>
                                    <TableCell className="p-2 align-top bg-blue-50/30">
                                        <div className="space-y-2">
                                            {triageCriteria.polaPernafasan.biru.map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox
                                                        id={item.id}
                                                        checked={selectedCriteria.includes(item.id)}
                                                        onCheckedChange={() => handleCheckboxChange(item.id)}
                                                    />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">
                                                        {item.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* SIRKULASI */}
                                <TableRow className="bg-slate-50/50">
                                    <TableCell className="text-center font-bold border-r align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <Heart className="h-5 w-5 text-red-500" />
                                            <span className="text-xs">Sirkulasi</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-red-50/30">
                                        <div className="space-y-2">
                                            {[
                                                { id: 's_henti_jantung', label: 'Henti Jantung' },
                                                { id: 's_hipotensi_hiperfusi', label: 'Hipotensi dgn hiperfusi' },
                                                { id: 's_hipotensi_berat', label: 'Hipotensi berat' },
                                                { id: 's_perdarahan_hebat', label: 'Perdarahan hebat' },
                                                { id: 's_crt_2_detik', label: 'CRT > 2 detik' }
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox id={item.id} checked={selectedCriteria.includes(item.id)} onCheckedChange={() => handleCheckboxChange(item.id)} />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-yellow-50/30">
                                        <div className="space-y-2">
                                            {[
                                                { id: 's_td_sistolik_160', label: 'TD Sistolik > 160 dgn kerusakan organ' },
                                                { id: 's_nadi_lemah_2', label: 'Nadi lemah' },
                                                { id: 's_hr_50', label: 'HR < 50' },
                                                { id: 's_hr_150', label: 'HR > 150' },
                                                { id: 's_pucat_nadi_lemah', label: 'Pucat dgn nadi lemah' },
                                                { id: 's_sangat_kehausan', label: 'Sangat Kehausan' },
                                                { id: 's_turgor_turun', label: 'Turgor turun' }
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox id={item.id} checked={selectedCriteria.includes(item.id)} onCheckedChange={() => handleCheckboxChange(item.id)} />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-green-50/30">
                                        <div className="space-y-2">
                                            {[
                                                { id: 's_hr_50_150', label: 'HR 50-150 (Dewasa)' },
                                                { id: 's_perdarahan_sedang', label: 'Perdarahan sedang' },
                                                { id: 's_td_sistolik_180', label: 'TD Sistolik < 180' },
                                                { id: 's_td_diastolik_120', label: 'TD diastolik > 120' },
                                                { id: 's_pallor_berat', label: 'Pallor (berat)' },
                                                { id: 's_edema_kedua_tungkai', label: 'Edema kedua tungkai' }
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox id={item.id} checked={selectedCriteria.includes(item.id)} onCheckedChange={() => handleCheckboxChange(item.id)} />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 align-top bg-blue-50/30">
                                        <div className="space-y-2">
                                            {[
                                                { id: 's_dewasa_60_100', label: 'Dewasa : 60-100 ; >90' },
                                                { id: 's_0_1_thn', label: '0-1 thn : 100-160 ; >60' },
                                                { id: 's_1_3_thn', label: '1-3 thn : 90-150 ; >70' },
                                                { id: 's_3_6_thn', label: '3-6 thn : 80-140 ; >75' },
                                                { id: 's_lebih_6_thn', label: '> 6 thn : 70-120 ; >80' }
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox id={item.id} checked={selectedCriteria.includes(item.id)} onCheckedChange={() => handleCheckboxChange(item.id)} />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* DISABILITY */}
                                <TableRow>
                                    <TableCell className="text-center font-bold border-r align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <Brain className="h-5 w-5 text-amber-500" />
                                            <span className="text-xs">Disability</span>
                                        </div>
                                    </TableCell>
                                    {/* ... Lanjutkan pola yang sama untuk Disability ... */}
                                    <TableCell className="p-2 border-r align-top bg-red-50/30">
                                        <div className="space-y-2">
                                            {[{ id: 'd_avpu_pain', label: 'AVPU : Pain' }, { id: 'd_kejang', label: 'Kejang' }, { id: 'd_flaccid_baby', label: 'Flaccid Baby' }, { id: 'd_lumpuh_layu', label: 'Lumpuh layu' }].map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox id={item.id} checked={selectedCriteria.includes(item.id)} onCheckedChange={() => handleCheckboxChange(item.id)} />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    {/* Sisanya diisi dengan data Anda menggunakan pola TableCell di atas */}
                                </TableRow>

                                {/* LAIN-LAIN */}
                                <TableRow className="bg-slate-50/50">
                                    <TableCell className="text-center font-bold border-r align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <PlusCircle className="h-5 w-5 text-gray-500" />
                                            <span className="text-xs">Lain-Lain</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-2 border-r align-top bg-red-50/30">
                                        <div className="space-y-2">
                                            {[{ id: 'll_gds_60', label: 'GDS < 60' }, { id: 'll_luka_bakar_mayor', label: 'Luka bakar mayor' }].map((item) => (
                                                <div key={item.id} className="flex items-start space-x-2">
                                                    <Checkbox id={item.id} checked={selectedCriteria.includes(item.id)} onCheckedChange={() => handleCheckboxChange(item.id)} />
                                                    <Label htmlFor={item.id} className="text-[11px] leading-none">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    {/* ... Lanjutkan pola yang sama untuk sisa kolom ... */}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Triage Result Section */}
            <Card>
                <CardHeader className={`${formData.kategori_triage ? categoryConfig[formData.kategori_triage].bgColor : 'bg-gray-600'} text-white`}>
                    <CardTitle className="flex items-center">
                        <Info className="mr-2 h-5 w-5" />
                        {dummyTriageAssessment ? 'Update' : 'Input'} Hasil Triage
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="kategori_triage" className="font-bold">Kategori Triage</Label>
                            <Select
                                value={formData.kategori_triage}
                                onValueChange={(value) => handleInputChange('kategori_triage', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="merah" className="text-red-600 font-bold">🔴 Level 1 - Merah (Resusitasi)</SelectItem>
                                    <SelectItem value="kuning" className="text-yellow-600 font-bold">🟡 Level 2 - Kuning (Urgensi)</SelectItem>
                                    <SelectItem value="hijau" className="text-green-600 font-bold">🟢 Level 3 - Hijau (Semi-Urgen)</SelectItem>
                                    <SelectItem value="biru" className="text-blue-600 font-bold">🔵 Level 4 - Biru (Tidak Urgen)</SelectItem>
                                    <SelectItem value="hitam" className="text-gray-800 font-bold">⚫ Hitam (Meninggal)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="waktu_triage" className="font-bold">Waktu Triage</Label>
                            <input
                                type="datetime-local"
                                id="waktu_triage"
                                value={formData.waktu_triage}
                                onChange={(e) => handleInputChange('waktu_triage', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="petugas_triage" className="font-bold">Petugas Triage</Label>
                            <input
                                type="text"
                                id="petugas_triage"
                                value={formData.petugas_triage}
                                onChange={(e) => handleInputChange('petugas_triage', e.target.value)}
                                placeholder="Nama petugas"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catatan_triage" className="font-bold">Catatan Triage</Label>
                        <Textarea
                            id="catatan_triage"
                            value={formData.catatan_triage}
                            onChange={(e) => handleInputChange('catatan_triage', e.target.value)}
                            placeholder="Catatan tambahan untuk hasil triage..."
                            rows={3}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="space-x-2">
                            <Button variant="outline" onClick={handleReset}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset Form
                            </Button>
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                        </div>
                        <Button
                            size="lg"
                            onClick={handleSave}
                            className={dummyTriageAssessment ? "bg-amber-600 hover:bg-amber-700" : ""}
                        >
                            <Save className="mr-2 h-5 w-5" />
                            {dummyTriageAssessment ? 'Update Data Triage' : 'Simpan Data Triage'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Info */}
            <div className="text-sm text-gray-500">
                <p><strong>Info:</strong> No. Kunjungan: {patientInfo.no_kunjungan} | No. RM: {patientInfo.no_rm}</p>
            </div>
        </div>
    );
};

export default TriageAssessmentTable;