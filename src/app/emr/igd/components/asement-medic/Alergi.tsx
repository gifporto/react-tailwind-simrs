"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Gunakan react-router-dom
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Save, Loader2 } from "lucide-react";

// Import API
import { AsesmentMedicAPI } from "@/lib/api";

interface AlergiData {
  ada_alergi: "ya" | "tidak";
  deskripsi: string;
}

interface Props {
  initialData?: any; // Data dari getAsesment (biasanya status_alergi)
  editable?: boolean;
  onSuccess?: () => void;
}

export default function Alergi({ initialData, editable = false, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  // State internal
  const [statusAlergi, setStatusAlergi] = useState<"ya" | "tidak">("tidak");
  const [deskripsi, setDeskripsi] = useState("");

  // Sinkronisasi data awal dari API
  useEffect(() => {
    if (initialData) {
      setStatusAlergi(initialData.ada_alergi || "tidak");
      setDeskripsi(initialData.deskripsi || "");
    }
  }, [initialData]);

  const hasAlergi = statusAlergi === "ya";

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) {
      toast.error("ID tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      const payload: AlergiData = {
        ada_alergi: statusAlergi,
        deskripsi: hasAlergi ? deskripsi : "", // Kosongkan deskripsi jika pilih "tidak"
      };

      await AsesmentMedicAPI.updateAlergi(id, payload);
      toast.success("Data alergi berhasil diperbarui");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Update Alergi Error:", error);
      toast.error("Gagal menyimpan data alergi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="alergi" className="border rounded-md">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <div className="flex items-center gap-2">
          <Badge variant="outline">2</Badge>
          Alergi
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 space-y-4">
        {/* warning */}
        <Alert variant="warning">
          <AlertTriangle/>
          <AlertTitle>Penting</AlertTitle>
          <AlertDescription>
            Informasi alergi sangat penting untuk keselamatan pasien
          </AlertDescription>
        </Alert>

        {/* pilihan alergi */}
        <RadioGroup
          value={statusAlergi}
          onValueChange={(val) => setStatusAlergi(val as "ya" | "tidak")}
          className="space-y-3"
          disabled={!editable || loading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tidak" id="alergi-tidak" />
            <Label htmlFor="alergi-tidak" className="flex items-center gap-2 font-normal cursor-pointer">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Tidak ada alergi
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ya" id="alergi-ada" />
            <Label htmlFor="alergi-ada" className="flex items-center gap-2 font-normal cursor-pointer">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Ada alergi
            </Label>
          </div>
        </RadioGroup>

        {/* detail alergi */}
        {hasAlergi && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
            <Label className="text-sm font-medium">Jelaskan Alergi</Label>
            <Textarea
              rows={3}
              placeholder="Contoh: alergi obat Amoxicillin, alergi makanan seafood, dll"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              disabled={!editable || loading}
            />
          </div>
        )}

        {/* aksi */}
        {editable && (
          <div className="pt-3 border-t flex justify-end">
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={loading || !id}
              className="relative z-10 min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Alergi
                </>
              )}
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}