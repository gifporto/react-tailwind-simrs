"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Baby, Smile, Activity, Volume2, HelpingHand,
  Calculator, Info, MapPin, Stethoscope, Clock,
  ArrowUpCircle, ArrowDownCircle, Save, Loader2
} from "lucide-react";

import { AsesmentMedicAPI } from "@/lib/api";

const FLACC_SECTIONS = [
  {
    key: "face",
    label: "F - Face (Wajah)",
    icon: Smile,
    options: [
      { value: "0", text: "Senyum / Ekspresi normal", color: "bg-emerald-500" },
      { value: "1", text: "Mengerutkan kening / Sesekali meringis", color: "bg-amber-500" },
      { value: "2", text: "Meringis terus-menerus / Rahang gemetar", color: "bg-red-500" },
    ],
  },
  {
    key: "legs",
    label: "L - Legs (Kaki)",
    icon: Activity,
    options: [
      { value: "0", text: "Santai / Posisi normal", color: "bg-emerald-500" },
      { value: "1", text: "Cemas, gelisah, tegang", color: "bg-amber-500" },
      { value: "2", text: "Menendang-nendang / Kaki ditarik", color: "bg-red-500" },
    ],
  },
  {
    key: "activity",
    label: "A - Activity (Aktivitas)",
    icon: Baby,
    options: [
      { value: "0", text: "Tenang / Berbaring nyaman", color: "bg-emerald-500" },
      { value: "1", text: "Menggeliat, mondar-mandir, tegang", color: "bg-amber-500" },
      { value: "2", text: "Melengkung kaku / Menyentak", color: "bg-red-500" },
    ],
  },
  {
    key: "cry",
    label: "C - Cry (Tangisan)",
    icon: Volume2,
    options: [
      { value: "0", text: "Tidak ada tangisan / Normal", color: "bg-emerald-500" },
      { value: "1", text: "Mengerang / Merengek sesekali", color: "bg-amber-500" },
      { value: "2", text: "Menangis keras / Terisak-isak", color: "bg-red-500" },
    ],
  },
  {
    key: "consolability",
    label: "C - Consolability",
    icon: HelpingHand,
    options: [
      { value: "0", text: "Puas / Santai / Mudah dihibur", color: "bg-emerald-500" },
      { value: "1", text: "Dapat dialihkan dengan sentuhan", color: "bg-amber-500" },
      { value: "2", text: "Sulit dihibur / Tidak nyaman", color: "bg-red-500" },
    ],
  },
];

export default function FlaccPainAssessment({ initialData, editable = false }: { initialData?: any, editable?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    flacc_face: "0",
    flacc_legs: "0",
    flacc_activity: "0",
    flacc_cry: "0",
    flacc_consolability: "0",
    lokasi_nyeri: "",
    karakteristik: "",
    karakteristik_lainnya: "",
    penjalaran: "",
    onset: "",
    timbul_saat: "",
    faktor_memperberat: "",
    faktor_meringankan: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        // Konversi eksplisit ke String agar RadioGroup mendeteksi kecocokan
        flacc_face: initialData.flacc_face !== undefined ? String(initialData.flacc_face) : "0",
        flacc_legs: initialData.flacc_legs !== undefined ? String(initialData.flacc_legs) : "0",
        flacc_activity: initialData.flacc_activity !== undefined ? String(initialData.flacc_activity) : "0",
        flacc_cry: initialData.flacc_cry !== undefined ? String(initialData.flacc_cry) : "0",
        flacc_consolability: initialData.flacc_consolability !== undefined ? String(initialData.flacc_consolability) : "0",
        lokasi_nyeri: initialData.lokasi_nyeri || "",
        karakteristik: initialData.karakteristik || "",
        karakteristik_lainnya: initialData.karakteristik_lainnya || "",
        penjalaran: initialData.penjalaran || "",
        onset: initialData.onset || "",
        timbul_saat: initialData.timbul_saat || "",
        faktor_memperberat: initialData.faktor_memperberat || "",
        faktor_meringankan: initialData.faktor_meringankan || ""
      });
    }
  }, [initialData]);

  const totalScore = useMemo(() => {
    return Number(form.flacc_face) + Number(form.flacc_legs) +
      Number(form.flacc_activity) + Number(form.flacc_cry) +
      Number(form.flacc_consolability);
  }, [form]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const payload = {
        ...form,
        flacc_face: Number(form.flacc_face),
        flacc_legs: Number(form.flacc_legs),
        flacc_activity: Number(form.flacc_activity),
        flacc_cry: Number(form.flacc_cry),
        flacc_consolability: Number(form.flacc_consolability),
        flacc_total: totalScore,
        skrining_nyeri: "ya"
      };
      await AsesmentMedicAPI.updateSkriningNeyri(id, payload);
      toast.success("Asesmen Nyeri FLACC berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="flacc" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">10</Badge>
          <span>FLACC Behavioral Pain Assessment</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 space-y-6">
        <Alert variant="info">
          <Info className="h-4 w-4 text-sky-600" />
          <AlertDescription>
            Digunakan untuk bayi & anak kecil (2 bulan - 7 tahun) atau pasien non-verbal.
          </AlertDescription>
        </Alert>

        <div>
          <div className="grid grid-cols-2 gap-4">
            {FLACC_SECTIONS.map((section) => {
              // Menghubungkan key statis ("face") ke key state ("flacc_face")
              const formKey = `flacc_${section.key}` as keyof typeof form;
              const currentValue = form[formKey];

              return (
                <Card key={section.key}>
                  <CardHeader>
                    <CardTitle className="text-[11px] font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                      <section.icon className="h-3.5 w-3.5 text-primary" /> {section.label}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <RadioGroup
                      value={currentValue}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, [formKey]: val }))}
                      disabled={!editable || loading}
                      className="flex flex-col gap-1"
                    >
                      {section.options.map((opt) => (
                        <Label
                          key={opt.value}
                          htmlFor={`${section.key}-${opt.value}`}
                          className={`flex items-center gap-3 p-2 rounded-md border transition-all cursor-pointer ${currentValue === opt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                            : "border-transparent hover:bg-muted"
                            }`}
                        >
                          <RadioGroupItem value={opt.value} id={`${section.key}-${opt.value}`} className="sr-only" />
                          <div className="flex items-center gap-2 flex-1">
                            <Badge className={`h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] text-white shadow-none ${opt.color}`}>
                              {opt.value}
                            </Badge>
                            <span className="text-[11px] font-medium">{opt.text}</span>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
              <Calculator className="h-6 w-6 text-primary/60 mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Score</p>
              <h1 className="text-7xl font-black text-primary my-1">{totalScore}</h1>
              <div className={`mt-2 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${totalScore === 0 ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                totalScore <= 3 ? "bg-amber-100 text-amber-800 border-amber-200" :
                  totalScore <= 6 ? "bg-orange-100 text-orange-800 border-orange-200" :
                    "bg-red-100 text-red-800 border-red-200"
                }`}>
                {totalScore === 0 ? "Nyaman" : totalScore <= 3 ? "Nyeri Ringan" : totalScore <= 6 ? "Nyeri Sedang" : "Nyeri Berat"}
              </div>
            </Card>
          </div>

        </div>

        <div className="pt-6 border-t space-y-6">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Detail Karakteristik Nyeri</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" /> Lokasi Nyeri</Label>
              <Input placeholder="Dada kiri, dll" className="h-9 text-xs" value={form.lokasi_nyeri} onChange={(e) => setForm({ ...form, lokasi_nyeri: e.target.value })} disabled={!editable} />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary" /> Onset (Awitan)</Label>
              <RadioGroup value={form.onset} onValueChange={(val) => setForm({ ...form, onset: val })} disabled={!editable} className="grid grid-cols-2 gap-2">
                <Label htmlFor="onsetAkut" className={`flex-1 px-3 py-2.5 rounded-md border text-[10px] font-bold uppercase tracking-tighter cursor-pointer text-center transition-all ${form.onset === "Akut" ? "bg-red-50 border-red-500 text-red-700 shadow-sm" : "bg-white hover:bg-muted"}`}>
                  <RadioGroupItem value="Akut" id="onsetAkut" className="sr-only" /> Akut (Tiba-tiba)
                </Label>
                <Label htmlFor="onsetKronis" className={`flex-1 px-3 py-2.5 rounded-md border text-[10px] font-bold uppercase tracking-tighter cursor-pointer text-center transition-all ${form.onset === "Kronis" ? "bg-amber-50 border-amber-500 text-amber-700 shadow-sm" : "bg-white hover:bg-muted"}`}>
                  <RadioGroupItem value="Kronis" id="onsetKronis" className="sr-only" /> Kronis (Bertahap)
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold">Karakteristik / Sifat Nyeri</Label>
              <RadioGroup value={form.karakteristik} onValueChange={(val) => setForm({ ...form, karakteristik: val })} disabled={!editable} className="flex flex-wrap gap-2">
                {["Tertusuk", "Tertekan", "Berdenyut", "Lainnya"].map((item) => (
                  <Label key={item} htmlFor={`char-${item}`} className={`px-3 py-2 rounded-md border text-[10px] font-bold uppercase tracking-tighter cursor-pointer transition-all ${form.karakteristik === item ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white hover:bg-muted"}`}>
                    <RadioGroupItem value={item} id={`char-${item}`} className="sr-only" /> {item}
                  </Label>
                ))}
              </RadioGroup>
              {form.karakteristik === "Lainnya" && <Input placeholder="Sebutkan..." className="h-9 text-xs mt-2" value={form.karakteristik_lainnya} onChange={(e) => setForm({ ...form, karakteristik_lainnya: e.target.value })} />}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold">Penjalaran Nyeri</Label>
              <RadioGroup value={form.penjalaran} onValueChange={(val) => setForm({ ...form, penjalaran: val })} disabled={!editable} className="grid grid-cols-2 gap-2">
                <Label htmlFor="pjTidak" className={`flex-1 px-3 py-2.5 rounded-md border text-[10px] font-bold uppercase tracking-tighter cursor-pointer text-center transition-all ${form.penjalaran === "Tidak" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-white"}`}>
                  <RadioGroupItem value="Tidak" id="pjTidak" className="sr-only" /> Tidak Menjalar
                </Label>
                <Label htmlFor="pjYa" className={`flex-1 px-3 py-2.5 rounded-md border text-[10px] font-bold uppercase tracking-tighter cursor-pointer text-center transition-all ${form.penjalaran === "Ya" ? "bg-amber-50 border-amber-500 text-amber-700 shadow-sm" : "bg-white"}`}>
                  <RadioGroupItem value="Ya" id="pjYa" className="sr-only" /> Menjalar
                </Label>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold flex items-center gap-1.5 text-red-600 uppercase tracking-widest"><ArrowUpCircle className="h-3 w-3" /> Faktor Memperberat</Label>
              <Textarea placeholder="..." value={form.faktor_memperberat} onChange={(e) => setForm({ ...form, faktor_memperberat: e.target.value })} disabled={!editable} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold flex items-center gap-1.5 text-emerald-600 uppercase tracking-widest"><ArrowDownCircle className="h-3 w-3" /> Faktor Meringankan</Label>
              <Textarea placeholder="..." value={form.faktor_meringankan} onChange={(e) => setForm({ ...form, faktor_meringankan: e.target.value })} disabled={!editable} />
            </div>
          </div>
        </div>

        {editable && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={loading} className="min-w-[160px] h-9 text-xs">
              {loading ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-2" />} Simpan Asesmen Nyeri
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}