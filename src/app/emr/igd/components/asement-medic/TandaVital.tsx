"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  History,
  Activity
} from "lucide-react";

import { AsesmentMedicAPI } from "@/lib/api";

interface VitalSignEntry {
  id?: string | number;
  tgl: string;
  jam: string;
  tekanan_darah: string;
  respirasi: string | number;
  nadi: string | number;
  suhu: string | number;
  spo2: string | number;
  saturasi: string | number;
  berat_badan: string | number;
  tinggi_badan: string | number;
  catatan_tambahan: string;
  isNew?: boolean; 
}

interface Props {
  initialData?: any[];
  editable?: boolean;
  onSuccess?: () => void;
}

export default function TandaVital({ initialData = [], editable = false, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<VitalSignEntry[]>([]);

  // Mengatur data lama (initialData) dan menambahkan flag isNew: false
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const formatted = initialData.map((item) => ({
        ...item,
        // Fallback jika field berbeda antara API get dan payload update
        tekanan_darah: item.tekanan_darah || `${item.sistolik}/${item.diastolik}`,
        respirasi: item.respirasi || item.nafas,
        isNew: false
      }));
      setEntries(formatted);
    }
  }, [initialData]);

  const addEntry = () => {
    const newEntry: VitalSignEntry = {
      id: Date.now(),
      tgl: new Date().toISOString().split('T')[0],
      jam: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      tekanan_darah: "",
      respirasi: "",
      nadi: "",
      suhu: "",
      spo2: "",
      saturasi: "",
      berat_badan: "",
      tinggi_badan: "",
      catatan_tambahan: "",
      isNew: true
    };
    // Data baru diletakkan di paling atas
    setEntries([newEntry, ...entries]);
  };

  const handleDelete = async (targetId: string | number, isNew: boolean) => {
    if (isNew) {
      setEntries(entries.filter(e => e.id !== targetId));
      return;
    }

    try {
      setLoading(true);
      await AsesmentMedicAPI.deleteVitalSign(id!, targetId.toString());
      setEntries(entries.filter(e => e.id !== targetId));
      toast.success("Data riwayat berhasil dihapus");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Gagal menghapus data");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (index: number, field: keyof VitalSignEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const handleSave = async () => {
    const newItems = entries.filter(e => e.isNew);
    if (newItems.length === 0) return;

    try {
      setLoading(true);
      const payload = {
        vital_signs: newItems.map(entry => {
          const [sistolik, diastolik] = entry.tekanan_darah.split("/").map(v => parseInt(v.trim()) || 0);
          return {
            ...entry,
            sistolik,
            diastolik,
            nadi: Number(entry.nadi),
            nafas: Number(entry.respirasi),
            respirasi: Number(entry.respirasi),
            suhu: Number(entry.suhu),
            spo2: Number(entry.spo2),
            saturasi: Number(entry.saturasi || entry.spo2),
            berat_badan: Number(entry.berat_badan),
            tinggi_badan: Number(entry.tinggi_badan),
          };
        })
      };

      await AsesmentMedicAPI.updateVitalSign(id!, payload);
      toast.success("Data vital sign baru berhasil disimpan");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="tandaVital" className="border rounded-lg">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">6</Badge>
          <span>Tanda-Tanda Vital</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Riwayat & Input TTV</h4>
            <p className="text-xs text-muted-foreground">Data lama ditampilkan sebagai list, data baru melalui form.</p>
          </div>
          {editable && (
            <Button variant="outline" size="sm" onClick={addEntry} disabled={loading}>
              <Plus className="h-4 w-4 mr-1" /> Input Baru
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {entries.map((entry, index) => (
            entry.isNew ? (
              /* --- MODE INPUT (DATA BARU) --- */
              <Card key={entry.id} className="border-primary/40 shadow-sm bg-primary/[0.02]">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge>Data Baru</Badge>
                    <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDelete(entry.id!, true)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">Tgl / Jam</Label>
                      <div className="flex gap-1">
                         <Input type="date" className="h-8 text-xs" value={entry.tgl} onChange={(e) => updateField(index, "tgl", e.target.value)} />
                         <Input type="time" className="h-8 text-xs" value={entry.jam} onChange={(e) => updateField(index, "jam", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">TD (mmHg)</Label>
                      <Input placeholder="120/80" className="h-8 text-xs" value={entry.tekanan_darah} onChange={(e) => updateField(index, "tekanan_darah", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">Nadi / RR (x/m)</Label>
                      <div className="flex gap-1">
                        <Input type="number" placeholder="N" className="h-8 text-xs" value={entry.nadi} onChange={(e) => updateField(index, "nadi", e.target.value)} />
                        <Input type="number" placeholder="R" className="h-8 text-xs" value={entry.respirasi} onChange={(e) => updateField(index, "respirasi", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">Suhu / SpO2</Label>
                      <div className="flex gap-1">
                        <Input type="number" placeholder="°C" className="h-8 text-xs" value={entry.suhu} onChange={(e) => updateField(index, "suhu", e.target.value)} />
                        <Input type="number" placeholder="%" className="h-8 text-xs" value={entry.spo2} onChange={(e) => updateField(index, "spo2", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">Saturasi</Label>
                      <Input type="number" className="h-8 text-xs" value={entry.saturasi} onChange={(e) => updateField(index, "saturasi", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">BB (kg)</Label>
                      <Input type="number" className="h-8 text-xs" value={entry.berat_badan} onChange={(e) => updateField(index, "berat_badan", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold">TB (cm)</Label>
                      <Input type="number" className="h-8 text-xs" value={entry.tinggi_badan} onChange={(e) => updateField(index, "tinggi_badan", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold">Catatan</Label>
                    <Textarea className="text-xs min-h-[40px]" value={entry.catatan_tambahan} onChange={(e) => updateField(index, "catatan_tambahan", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* --- MODE LIST (DATA LAMA) --- */
              <div key={entry.id} className="group relative flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-4 w-full">
                  <div className="hidden md:flex h-8 w-8 items-center justify-center rounded-full bg-background border">
                    <History className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-y-2 text-xs">
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">Waktu</p>
                      <p className="font-medium">{entry.tgl} <span className="text-muted-foreground">{entry.jam}</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">TD</p>
                      <p className="font-medium">{entry.tekanan_darah} <span className="text-[9px] text-muted-foreground">mmHg</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">Nadi / RR</p>
                      <p className="font-medium">{entry.nadi} / {entry.respirasi} <span className="text-[9px] text-muted-foreground">x/m</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">Suhu / SpO2</p>
                      <p className="font-medium">{entry.suhu}°C / {entry.spo2}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">BB / TB</p>
                      <p className="font-medium">{entry.berat_badan}kg / {entry.tinggi_badan}cm</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">Catatan</p>
                      <p className="truncate italic">"{entry.catatan_tambahan || '-'}"</p>
                    </div>
                  </div>
                </div>
                {editable && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Vital Sign?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari riwayat medis pasien.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(entry.id!, false)} className="bg-destructive hover:bg-destructive/90">
                          Hapus Permanen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )
          ))}
        </div>

        {editable && entries.some(e => e.isNew) && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Data Baru
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}