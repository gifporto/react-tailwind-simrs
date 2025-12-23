"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, isValid } from "date-fns";
import {
  Syringe,
  Info,
  HeartPulse,
  Clock,
  UserRound,
  Save,
  Loader2,
  ChevronDownIcon,
  CalendarIcon
} from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

interface Props {
  initialData?: any;
  editable?: boolean;
  onSuccess?: () => void;
}

export default function TindakanTerapi({ initialData, editable = false, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  // State Form
  const [tindakanTerapi, setTindakanTerapi] = useState("");
  const [dokter, setDokter] = useState("");
  const [perawat, setPerawat] = useState("");

  // State Waktu
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState("00:00:00");

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  // Sinkronisasi data awal (Old Value)
  useEffect(() => {
    if (initialData) {
      setTindakanTerapi(initialData.tindakan_terapi || "");
      setDokter(initialData.petugas_dokter || "");
      setPerawat(initialData.petugas_perawat || "");

      if (initialData.tindakan_waktu_mulai) {
        const d = new Date(initialData.tindakan_waktu_mulai.replace(' ', 'T'));
        if (isValid(d)) {
          setStartDate(d);
          setStartTime(format(d, "HH:mm:ss"));
        }
      }

      if (initialData.tindakan_waktu_selesai) {
        const d = new Date(initialData.tindakan_waktu_selesai.replace(' ', 'T'));
        if (isValid(d)) {
          setEndDate(d);
          setEndTime(format(d, "HH:mm:ss"));
        }
      }
    }
  }, [initialData]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!id) return toast.error("ID tidak ditemukan");
    if (!startDate || !endDate) return toast.error("Harap pilih tanggal pelaksanaan");

    try {
      setLoading(true);
      const payload = {
        tindakan_terapi: tindakanTerapi,
        tindakan_waktu_mulai: `${format(startDate, "yyyy-MM-dd")} ${startTime}`,
        tindakan_waktu_selesai: `${format(endDate, "yyyy-MM-dd")} ${endTime}`,
        petugas_dokter: dokter,
        petugas_perawat: perawat,
      };

      await AsesmentMedicAPI.updatePerencanaanTindakan(id, payload);
      toast.success("Tindakan & Terapi berhasil disimpan");

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
    <AccordionItem value="tindakanTerapi" className="border rounded-lg">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-3">
          <Badge variant="outline">16</Badge>
          Tindakan & Terapi di IGD
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-6">
        <Alert variant="info">
          <Info className="w-4 h-4" />
          <AlertDescription className="text-xs">
            Pastikan dokumentasi mencakup tindakan resusitasi, pemberian cairan, obat emergency, dan prosedur medis lainnya.
          </AlertDescription>
        </Alert>

        {/* Input Utama */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-bold">Detail Prosedur & Terapi</Label>
          </div>
          <Textarea
            value={tindakanTerapi}
            onChange={(e) => setTindakanTerapi(e.target.value)}
            disabled={!editable || loading}
            placeholder="Tuliskan detail tindakan yang diberikan..."
            className="min-h-[120px] resize-none focus-visible:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section Waktu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Waktu Pelaksanaan</h4>
            </div>

            <div className="grid gap-4">
              {/* Mulai */}
              <div className="grid gap-2">
                <Label className="text-xs">Mulai</Label>
                <div className="flex gap-2">
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!editable || loading}
                        className={cn("flex-1 justify-between font-normal h-9", !startDate && "text-muted-foreground")}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
                          {startDate ? format(startDate, "dd MMM yyyy") : "Pilih Tanggal"}
                        </div>
                        <ChevronDownIcon className="h-3 w-3 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => { setStartDate(date); setOpenStart(false); }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    step="1"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={!editable || loading}
                    className="w-[110px] h-9 text-xs"
                  />
                </div>
              </div>

              {/* Selesai */}
              <div className="grid gap-2">
                <Label className="text-xs">Selesai</Label>
                <div className="flex gap-2">
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!editable || loading}
                        className={cn("flex-1 justify-between font-normal h-9", !endDate && "text-muted-foreground")}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
                          {endDate ? format(endDate, "dd MMM yyyy") : "Pilih Tanggal"}
                        </div>
                        <ChevronDownIcon className="h-3 w-3 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => { setEndDate(date); setOpenEnd(false); }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    step="1"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!editable || loading}
                    className="w-[110px] h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Petugas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <UserRound className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Petugas Pelaksana</h4>
            </div>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Dokter DPJP</Label>
                <Input
                  value={dokter}
                  onChange={(e) => setDokter(e.target.value)}
                  placeholder="Nama dokter..."
                  disabled={!editable || loading}
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Perawat Pelaksana</Label>
                <Input
                  value={perawat}
                  onChange={(e) => setPerawat(e.target.value)}
                  placeholder="Nama perawat..."
                  disabled={!editable || loading}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {editable && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={loading}
              className="px-8 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Simpan Tindakan
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}