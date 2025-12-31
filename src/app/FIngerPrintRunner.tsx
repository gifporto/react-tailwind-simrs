import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HandHelping, Loader2 } from 'lucide-react';

interface FingerprintRunnerProps {
  noPeserta: string;
  onSuccess?: () => void;
}

const FingerprintRunner: React.FC<FingerprintRunnerProps> = ({ noPeserta, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleActivation = () => {
    if (!noPeserta) {
      alert("Nomor peserta tidak ditemukan");
      return;
    }

    setLoading(true);
    setOutput("Sedang memproses di tab baru...");
   
    const url = `http://localhost:5000/run_exe?no_peserta=${noPeserta}`;
    const newWindow = window.open(url, '_blank');

    // Jeda 5 detik
    setTimeout(() => {
      if (newWindow) {
        newWindow.close();
      }
      setLoading(false);
      setOutput("Tab ditutup otomatis setelah 5 detik.");
      if (onSuccess) onSuccess();
    }, 3000);
  };

  return (
    <div className="space-y-4 w-full">
      <Button
        onClick={handleActivation}
        disabled={loading || !noPeserta}
        className="flex items-center gap-2 w-full"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <HandHelping className="mr-2 h-4 w-4" />
        )}
        {loading ? "PROSES AKTIVASI..." : "AKTIVASI FINGERPRINT"}
      </Button>

      {output && (
        <div className="text-[11px] p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
          <strong>Status:</strong> {output}
        </div>
      )}
    </div>
  );
};

export default FingerprintRunner;
