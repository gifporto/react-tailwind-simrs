"use client"

import * as React from "react"
import { useParams } from "react-router-dom"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  ClipboardList,
  Save,
  Loader2,
  Check,
  Search,
  X,
  SearchIcon,
  ServerIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { AsesmentMedicAPI, IcdAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface Props {
  initialData?: any;
  editable?: boolean;
}

/**
 * 1. PINDAHKAN IcdSearchSection ke luar agar tidak re-mount saat mengetik
 */
const IcdSearchSection = ({ 
  type, 
  form, 
  setForm, 
  editable, 
  loading 
}: { 
  type: 'utama' | 'sekunder', 
  form: any, 
  setForm: React.Dispatch<React.SetStateAction<any>>,
  editable: boolean,
  loading: boolean
}) => {
  const [tempSearch, setTempSearch] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const onSearch = async () => {
    if (tempSearch.length < 2) {
      toast.error("Ketik minimal 2 karakter");
      return;
    }
    try {
      setIsSearching(true);
      // Sesuaikan parameter API Anda (biasanya: limit, query)
      const res = await IcdAPI.getListIcd10("10", tempSearch);
      setResults(res.data || []);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setIsSearching(false);
    }
  };

  const currentCode = type === 'utama' ? form.diagnosis_utama_code : form.diagnosis_sekunder_code;
  const currentDesc = type === 'utama' ? form.diagnosis_utama_description : form.diagnosis_sekunder_description;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="flex h-9 w-full rounded-md border border-input bg-background px-9 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Cari kode/nama ICD-10..."
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            disabled={!editable}
          />
          {tempSearch && (
            <button 
              onClick={() => { setTempSearch(""); setResults([]); }}
              className="absolute right-2.5 top-2.5"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button 
          type="button"
          size="sm" 
          onClick={onSearch}
          disabled={isSearching || !editable}
          className="h-9 px-4 text-xs font-bold"
        >
          {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <SearchIcon/>}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-slate-50/50">
          <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-100">
            {results.map((item: any) => {
              const isSelected = currentCode === item.kd_icd;
              return (
                <div
                  key={item.kd_icd}
                  onClick={() => {
                    if (!editable) return;
                    setForm((prev: any) => ({
                      ...prev,
                      [type === 'utama' ? 'diagnosis_utama_code' : 'diagnosis_sekunder_code']: item.kd_icd,
                      [type === 'utama' ? 'diagnosis_utama_description' : 'diagnosis_sekunder_description']: item.desk_icd_indo
                    }));
                    setResults([]); 
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors",
                    isSelected ? "bg-primary/10" : "hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary border-primary text-white" : "border-slate-300 bg-white"
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-primary mr-2">{item.kd_icd}</span>
                    <span className="text-[11px] text-slate-600 line-clamp-1">{item.desk_icd_indo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-muted-foreground uppercase">
            Deskripsi {type === 'utama' ? 'Utama' : 'Sekunder'}
          </label>
          {currentCode && (
            <Badge variant="outline" className="text-[9px] h-4 bg-primary/5 text-primary border-primary/20">
              Kode: {currentCode}
            </Badge>
          )}
        </div>
        <Textarea
          rows={2}
          className="text-xs bg-white resize-none font-medium focus:ring-1 focus:ring-primary"
          placeholder="Isi deskripsi..."
          value={currentDesc}
          disabled={!editable || loading}
          onChange={(e) => {
            const val = e.target.value;
            setForm((prev: any) => ({
              ...prev,
              [type === 'utama' ? 'diagnosis_utama_description' : 'diagnosis_sekunder_description']: val
            }));
          }}
        />
      </div>
    </div>
  );
};

const Diagnosis: React.FC<Props> = ({ initialData, editable = false }) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    diagnosis: "",
    diagnosis_utama_code: "",
    diagnosis_utama_description: "",
    diagnosis_sekunder_code: "",
    diagnosis_sekunder_description: "",
  });

  React.useEffect(() => {
    if (initialData) {
      setForm({
        diagnosis: initialData.diagnosis || "",
        diagnosis_utama_code: initialData.diagnosis_utama_code || "",
        diagnosis_utama_description: initialData.diagnosis_utama_description || "",
        diagnosis_sekunder_code: initialData.diagnosis_sekunder_code || "",
        diagnosis_sekunder_description: initialData.diagnosis_sekunder_description || "",
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await AsesmentMedicAPI.updateDiagnosis(id, form);
      toast.success("Diagnosis berhasil disimpan");
    } catch (error) {
      toast.error("Gagal menyimpan diagnosis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="diagnosis" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-bold">14</Badge>
          <span>Diagnosis</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4 pt-2">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Pencarian menggunakan tombol "cari" Deskripsi dapat diedit kembali.
            </AlertDescription>
          </Alert>

          <Card className="shadow-none border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Diagnosis Kerja / Narasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={3}
                className="text-xs resize-none"
                placeholder="Narasi diagnosis..."
                value={form.diagnosis}
                onChange={(e) => setForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                disabled={!editable || loading}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-none border-muted">
              <CardHeader className="pb-2 bg-slate-50/50 border-b">
                <CardTitle className="text-[11px] uppercase font-bold text-slate-500">
                  Diagnosis Utama (ICD-10)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <IcdSearchSection 
                  type="utama" 
                  form={form} 
                  setForm={setForm} 
                  editable={editable} 
                  loading={loading}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none border-muted">
              <CardHeader className="pb-2 bg-slate-50/50 border-b">
                <CardTitle className="text-[11px] uppercase font-bold text-slate-500">
                  Diagnosis Sekunder
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <IcdSearchSection 
                  type="sekunder" 
                  form={form} 
                  setForm={setForm} 
                  editable={editable} 
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>

          {editable && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSave} disabled={loading} className="min-w-[150px] text-xs h-9">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Simpan Diagnosis
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default Diagnosis