import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { format, formatDate } from "date-fns";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Loader2,
  History,
  Pill,
  ShoppingCart,
  Clock,
  AlertCircle,
  PlusCircle,
  Zap,
  Trash,
  Search,
  X,
} from "lucide-react";
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

import { AsesmentMedicAPI, InvBarangAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import KunjunganLayanan from "@/components/kunjunganLayanan";
import type { AddDrugItem } from "./dto/resep-obat-dto";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DrugEntry {
  id?: string | number;
  id_obat: number;
  nama_obat: string;
  qty: number;
  signa: string;
  cara_pakai: string;
  pagi: string;
  siang: string;
  sore: string;
  malam: string;
  indikasi: string;
  instruksi_khusus: string;
  catatan: string;
  isNew?: boolean;
}

interface Props {
  initialData?: any[];
  editable?: boolean;
  onSuccess?: () => void;
}

export default function Prescription({
  initialData = [],
  editable = false,
  onSuccess,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [newEntries, setNewEntries] = useState<DrugEntry[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setHistoryList(initialData);
    }
  }, [initialData]);

  const addEntry = () => {
    const newEntry: DrugEntry = {
      id: Date.now(),
      id_obat: 0,
      nama_obat: "",
      qty: 1,
      signa: "",
      cara_pakai: "",
      pagi: "0",
      siang: "0",
      sore: "0",
      malam: "0",
      indikasi: "",
      instruksi_khusus: "",
      catatan: "",
      isNew: true,
    };
    setNewEntries([newEntry, ...newEntries]);
  };

  const handleDeleteResep = async (resepId: number) => {
    if (!id) return;
    try {
      setLoading(true);
      await AsesmentMedicAPI.deleteResepObat(id, resepId.toString());
      setHistoryList(historyList.filter((r) => r.id !== resepId));
      toast.success("Resep berhasil dihapus");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Gagal menghapus resep");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="prescription" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-bold">
            15
          </Badge>
          <span>Peresepan Dokter</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 space-y-6">
        <div className="flex items-center justify-between pb-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" /> Input Obat Baru
            </h4>
          </div>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={addEntry}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-1" /> Tambah Obat
            </Button>
          )}
        </div>

        {/* LIST CARD UNTUK INPUT BARU */}
        <CardInputNewDrug
          //   newEntries={newEntries}
          //   setNewEntries={setNewEntries}
          editable={editable}
        />

        {/* RIWAYAT RESEP (Sesuai Struktur JSON) */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Riwayat Resep Terdaftar
            </h4>
          </div>

          {historyList.length > 0 ? (
            historyList.map((resep) => (
              <div
                key={resep.id}
                className="rounded-lg border bg-background shadow-sm overflow-hidden mb-4"
              >
                <div className="bg-muted/40 p-3 border-b flex justify-between items-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold font-mono text-primary uppercase leading-none">
                        No: {resep.no_resep}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 bg-white px-1 uppercase"
                      >
                        {resep.kd_sts_resep}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      {resep.tgl_resep
                        ? format(new Date(resep.tgl_resep), "dd/MM/yyyy HH:mm")
                        : "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={resep.is_terima === "Y" ? "success" : "warning"}
                    >
                      {resep.is_terima === "Y" ? "Diterima" : "Pending"}
                    </Badge>
                    {editable && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            disabled={loading}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Resep ini?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus resep{" "}
                              <span className="font-bold text-foreground">
                                {resep.no_resep}
                              </span>
                              ? Tindakan ini tidak dapat dibatalkan dan data
                              akan terhapus dari sistem.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteResep(resep.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Ya, Hapus"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-dashed">
                  {resep.details?.map((detail: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center hover:bg-muted/5"
                    >
                      <div className="md:col-span-1">
                        <p className="text-xs font-bold text-primary leading-tight uppercase">
                          {detail.obat?.desk_brg}
                        </p>
                        <p className="text-[9px] text-muted-foreground italic mt-0.5 uppercase">
                          {detail.obat?.spesifikasi}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-center">
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">
                            Qty
                          </p>
                          <p className="font-semibold">{detail.qty}</p>
                        </div>
                        <div className="border-l pl-4 font-bold">
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">
                            Signa
                          </p>
                          <p className="text-primary">{detail.signa}</p>
                        </div>
                        <div className="flex gap-1.5">
                          {["pagi", "siang", "sore", "malam"].map(
                            (t) =>
                              detail[t] &&
                              detail[t] !== "0" && (
                                <div
                                  key={t}
                                  className="flex flex-col items-center"
                                >
                                  <Badge
                                    variant="outline"
                                    className="h-5 px-2 text-[9px] bg-primary/5 text-primary font-bold border-primary/20 uppercase"
                                  >
                                    {t}
                                  </Badge>
                                  <span className="text-[8px] font-bold">
                                    Dosis: {detail[t]}x
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] border-l pl-3 space-y-0.5">
                        <p className="italic text-muted-foreground leading-tight">
                          "{detail.cara_pakai || "-"}"
                        </p>
                        {detail.catatan && (
                          <p className="text-destructive font-bold text-[9px]">
                            Nb: {detail.catatan}
                          </p>
                        )}
                      </div>
                      <div className="text-[10px] border-l pl-3 space-y-0.5">
                        {detail.indikasi || "-"}
                        <p className="text-destructive">
                          {" "}
                          ({detail.instruksi_khusus || "-"})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {resep.alergi === "Y" && (
                  <div className="bg-destructive/5 p-2 flex items-center gap-2 border-t">
                    <AlertCircle className="w-3 h-3 text-destructive" />
                    <span className="text-[10px] font-bold text-destructive uppercase">
                      Pasien Alergi: {resep.ket_alergi || "Riwayat Alergi"}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-muted/5 border-2 border-dashed rounded-lg">
              <p className="text-xs text-muted-foreground">
                Belum ada riwayat peresepan.
              </p>
            </div>
          )}
        </div>

        <KunjunganLayanan api="EmrIgdAPI" />
      </AccordionContent>
    </AccordionItem>
  );
}

function SearchDrugs({ selectedDrug }: { selectedDrug: (id: string) => void }) {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [tempSearch, setTempSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Ref untuk mendeteksi klik di luar komponen agar list tertutup
  const containerRef = useRef<HTMLDivElement>(null);

  const onSearch = useCallback(async (search: string) => {
    if (search.length < 3) return;
    try {
      setIsSearching(true);
      const res = await InvBarangAPI.getList(1, 30, search);
      setResults(res.data || []);
      setShowResults(true);
    } catch (error) {
      console.error("Gagal mengambil data obat:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    // 2. Hanya jalankan pencarian jika user sedang mengetik (isTyping = true)
    if (!isTyping || !tempSearch || tempSearch.length < 3) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      onSearch(tempSearch);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [tempSearch, onSearch, isTyping]);

  const handleSelect = (item: any) => {
    const drugName = item?.nama || "";

    // 3. Matikan mode mengetik sebelum set state
    setIsTyping(false);
    setTempSearch(drugName);
    selectedDrug(item?.id);

    setResults([]);
    setShowResults(false);
  };

  // Menutup hasil jika klik di luar area search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex">
        <div className="relative flex-1">
          {isSearching ? (
            <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 text-primary animate-spin" />
          ) : (
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}

          <input
            className="flex h-9 w-full rounded-md border border-input bg-background px-9 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Ketik nama obat (min. 3 huruf)..."
            value={tempSearch}
            onFocus={() => results.length > 0 && setShowResults(true)}
            onChange={(e) => {
              setIsTyping(true);
              setTempSearch(e.target.value);
            }}
          />

          {tempSearch && (
            <button
              type="button"
              onClick={() => {
                setTempSearch("");
                setResults([]);
                setShowResults(false);
              }}
              className="absolute right-2.5 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Kontainer Hasil (Dropdown) */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md outline-none border rounded-md overflow-hidden transition-all">
          <ScrollArea className={results.length > 5 ? "h-60" : "h-auto"}>
            <div className="p-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.nama}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Keadaan jika tidak ditemukan */}
      {showResults &&
        results.length === 0 &&
        tempSearch.length >= 3 &&
        !isSearching && (
          <div className="absolute z-50 w-full mt-1 p-4 bg-popover border rounded-md shadow-md text-center text-xs text-muted-foreground">
            Obat tidak ditemukan.
          </div>
        )}
    </div>
  );
}

interface CardInputNewDrugProps {
  editable: boolean;
}

function CardInputNewDrug({ editable }: CardInputNewDrugProps) {
  const [drugs, setDrugs] = useState<AddDrugItem[]>([]);
  const { id } = useParams<{ id: string }>();

  const addNewDrug = () => {
    const newItem: AddDrugItem = {
      obat_id: 0,
      jumlah: 0,
      is_racikan: false,
      racikan_id: null,
      aturan_pakai: "",
      dosis: "",
      satuan: "",
      catatan_dokter: "",
      pagi: 0,
      siang: 0,
      sore: 0,
      malam: 0,
      indikasi: "",
      instruksi_khusus: "",
    };
    setDrugs([...drugs, newItem]);
  };

  const updateField = (index: number, field: keyof AddDrugItem, value: any) => {
    const updated = [...drugs];
    updated[index] = { ...updated[index], [field]: value };
    setDrugs(updated);
  };

  const removeDrug = (index: number) => {
    setDrugs(drugs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // console.log(drugs);
    const payload = {
      kunjungan_id: id,
      dokter_id: 1, // dumy
      unit_id: 2,
      tanggal_resep: formatDate(new Date(), "yyyy-MM-dd"),
      catatan_dokter: "ini catatan dokter dummy",
      items: drugs,
    };

    try {
      await AsesmentMedicAPI.updateResepObat(payload);
      toast.success("Resep baru berhasil disimpan");
    } catch (error: any) {
      console.log(error);

      toast.error("Resep baru gagal disimpan");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Button
        onClick={addNewDrug}
        className="gap-2 px-8 bg-blue-600 hover:bg-blue-700"
      >
        <PlusCircle className="w-4 h-4" /> Tambah Obat
      </Button>

      <div className="space-y-6">
        {drugs.map((drug, index) => (
          <Card
            key={index}
            className="p-6 border-2 shadow-sm relative overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                drug.is_racikan ? "bg-purple-500" : "bg-emerald-500"
              }`}
            />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    drug.is_racikan
                      ? "bg-purple-100 text-purple-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {drug.is_racikan ? <Zap size={20} /> : <Pill size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">
                    Obat #{index + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {drug.is_racikan ? "Mode Racikan" : "Obat Tunggal"}
                  </p>
                </div>

                <div className="flex items-center space-x-2 ml-4 border-l pl-4">
                  <Switch
                    id={`mode-${index}`}
                    checked={drug.is_racikan}
                    onCheckedChange={(checked) =>
                      updateField(index, "is_racikan", checked)
                    }
                    disabled={!editable}
                  />
                  <Label
                    htmlFor={`mode-${index}`}
                    className="text-xs font-medium cursor-pointer"
                  >
                    Mode Racikan
                  </Label>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDrug(index)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* --- IDENTITAS OBAT --- */}
              <div className="col-span-12 md:col-span-4 space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Obat
                  </Label>
                  <SearchDrugs
                    selectedDrug={(id) => updateField(index, "obat_id", id)}
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Dosis & Satuan
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Dosis"
                      value={drug.dosis}
                      onChange={(e) =>
                        updateField(index, "dosis", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Satuan"
                      value={drug.satuan}
                      onChange={(e) =>
                        updateField(index, "satuan", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Jumlah Total
                  </Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={drug.jumlah}
                    onChange={(e) =>
                      updateField(index, "jumlah", Number(e.target.value))
                    }
                  />
                </div>
              </div>

              {/* --- ATURAN PAKAI & WAKTU --- */}
              <div className="col-span-12 md:col-span-8 space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-center block">
                      PAGI
                    </Label>
                    <Input
                      type="number"
                      className="text-center"
                      value={drug.pagi}
                      onChange={(e) =>
                        updateField(index, "pagi", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-center block">
                      SIANG
                    </Label>
                    <Input
                      type="number"
                      className="text-center"
                      value={drug.siang}
                      onChange={(e) =>
                        updateField(index, "siang", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-center block">
                      SORE
                    </Label>
                    <Input
                      type="number"
                      className="text-center"
                      value={drug.sore}
                      onChange={(e) =>
                        updateField(index, "sore", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-center block">
                      MALAM
                    </Label>
                    <Input
                      type="number"
                      className="text-center"
                      value={drug.malam}
                      onChange={(e) =>
                        updateField(index, "malam", Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Aturan Pakai</Label>
                  <Input
                    placeholder="Contoh: 3 x 1 Sesudah Makan"
                    className="mt-1 bg-white"
                    value={drug.aturan_pakai}
                    onChange={(e) =>
                      updateField(index, "aturan_pakai", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* --- CATATAN & INSTRUKSI --- */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                <div className="space-y-1">
                  <Label className="text-xs">Catatan Dokter</Label>
                  <Textarea
                    placeholder="..."
                    className="h-20"
                    value={drug.catatan_dokter}
                    onChange={(e) =>
                      updateField(index, "catatan_dokter", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Indikasi</Label>
                  <Textarea
                    placeholder="..."
                    className="h-20"
                    value={drug.indikasi || ""}
                    onChange={(e) =>
                      updateField(index, "indikasi", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Instruksi Khusus</Label>
                  <Textarea
                    placeholder="..."
                    className="h-20"
                    value={drug.instruksi_khusus || ""}
                    onChange={(e) =>
                      updateField(index, "instruksi_khusus", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Jika Racikan Aktif: Tampilkan Form Racikan Data */}
            {drug.is_racikan && (
              <FormRacikan
                editable={editable}
                data={
                  drug.racikan_data || {
                    nama_racikan: "",
                    bentuk: "",
                    aturan_pakai: "",
                    jumlah: 0,
                    satuan: "",
                    items: [],
                  }
                }
                onChange={(newData) =>
                  updateField(index, "racikan_data", newData)
                }
              />
            )}
          </Card>
        ))}
      </div>

      {editable && drugs.length > 0 && (
        <div className="flex justify-between items-center pt-6 border-t">
          <p className="text-sm text-muted-foreground italic">
            Pastikan seluruh dosis dan aturan pakai sudah sesuai sebelum
            mengirim.
          </p>
          <Button
            className="px-10 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSave}
          >
            Kirim ke Farmasi
          </Button>
        </div>
      )}
    </div>
  );
}

interface FormRacikanProps {
  data: any;
  onChange: (newData: any) => void;
  editable: boolean;
}

function FormRacikan({ data, onChange, editable }: FormRacikanProps) {
  // Update field utama racikan
  const updateMainField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Tambah item obat ke dalam racikan
  const addItem = () => {
    const newItem = { obat_id: 0, dosis: "", satuan_dosis: "", catatan: "" };
    onChange({ ...data, items: [...(data.items || []), newItem] });
  };

  const removeItem = (idx: number) => {
    const newItems = data.items.filter((_: any, i: number) => i !== idx);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="mt-4 p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-4">
      <h4 className="text-sm font-bold text-purple-700 uppercase tracking-tight">
        Detail Komposisi Racikan
      </h4>

      {/* Field Utama Racikan */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 space-y-1">
          <Label className="text-[10px]">Nama Racikan</Label>
          <Input
            className="bg-white"
            value={data.nama_racikan}
            onChange={(e) => updateMainField("nama_racikan", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Bentuk</Label>
          <Input
            className="bg-white"
            placeholder="Kapsul"
            value={data.bentuk}
            onChange={(e) => updateMainField("bentuk", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Jumlah</Label>
          <Input
            type="number"
            className="bg-white"
            value={data.jumlah}
            onChange={(e) => updateMainField("jumlah", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Satuan</Label>
          <Input
            className="bg-white"
            value={data.satuan}
            placeholder="tablet"
            onChange={(e) => updateMainField("satuan", e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Item Obat Racikan */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold">
          Item Obat dalam Racikan:
        </Label>
        {data.items?.map((item: any, idx: number) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-2 bg-white p-2 rounded-lg border border-purple-100 shadow-sm items-end"
          >
            <div className="col-span-4">
              <SearchDrugs
                selectedDrug={(id) => {
                  const newItems = [...data.items];

                  newItems[idx].obat_id = Number(id);
                  updateMainField("items", newItems);
                }}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                placeholder="Dosis"
                value={item.dosis}
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].dosis = Number(e.target.value);
                  updateMainField("items", newItems);
                }}
              />
            </div>
            <div className="col-span-2">
              <Input
                placeholder="Satuan dosis"
                value={item.satuan_dosis}
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].satuan_dosis = e.target.value;
                  updateMainField("items", newItems);
                }}
              />
            </div>
            <div className="col-span-3">
              <Input
                placeholder="Catatan"
                value={item.catatan}
                onChange={(e) => {
                  const newItems = [...data.items];
                  newItems[idx].catatan = e.target.value;
                  updateMainField("items", newItems);
                }}
              />
            </div>
            <div className="col-span-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(idx)}
                className="text-red-400"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {editable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full border-dashed border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Plus className="h-4 w-4 mr-2" /> Tambah Bahan Obat
          </Button>
        )}
      </div>
    </div>
  );
}
