export interface AddDrugItem {
  obat_id: number;
  jumlah: number;
  is_racikan: boolean;
  racikan_id: string | null;
  racikan_data?: CostumeDrug;
  aturan_pakai: string;
  dosis: string;
  satuan: string;
  catatan_dokter: string;
  pagi: number;
  siang: number;
  sore: number;
  malam: number;
  indikasi: string | null;
  instruksi_khusus: string | null;
}

// ========== costume drugs =========
interface CostumeDrug {
  nama_racikan: string;
  bentuk: string;
  aturan_pakai: string;
  jumlah: number;
  satuan: string;
  items: CostumeDrugItem[];
}

interface CostumeDrugItem {
  obat_id: number;
  dosis: string;
  satuan_dosis: string;
  catatan: string;
}
