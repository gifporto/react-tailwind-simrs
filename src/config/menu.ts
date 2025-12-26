/**
 * Hospital Management System - Menu Configuration
 * Converted from Laravel blade component
 */

import {
  Home,
  Ambulance,
  Stethoscope,
  Pill,
  Wallet,
  TrendingUp,
  Package,
  FileText,
  Briefcase,
  Shield,
  Settings,
  MessageCircle,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  type: '1' | '2'; // 1 = single menu, 2 = menu with submenu
  icon: LucideIcon;
  title: string;
  url?: string;
  module: string;
  children?: SubMenuItem[];
}

export interface SubMenuItem {
  title: string;
  url: string;
  module: string;
}

export const mainMenus: MenuItem[] = [
  {
    type: '1',
    icon: Home,
    title: 'Beranda',
    url: '/',
    module: 'beranda',
  },

  {
    type: '2',
    icon: Ambulance,
    title: 'Pendaftaran',
    module: 'pendaftaran',
    children: [
      {
        title: 'Data Pasien',
        url: '/master/pasien',
        module: 'reg_pasien',
      },
      {
        title: 'Pembatalan Transaksi',
        url: '/fo_batal',
        module: 'reg_batal',
      },
      {
        title: 'IGD',
        url: '/igd',
        module: 'reg_igd',
      },
      {
        title: 'Rawat Jalan',
        url: '/rajal',
        module: 'reg_rajal',
      },
      {
        title: 'Rawat Inap',
        url: '/ranap',
        module: 'reg_ranap',
      },
    ],
  },

  {
    type: '2',
    icon: Stethoscope,
    title: 'EMR',
    module: 'pemeriksaan',
    children: [
      { title: 'IGD', url: '/emr/igd', module: 'med_igd' },
      { title: 'Rawat Jalan', url: '/emr-rajal', module: 'med_rajal' },
      { title: 'Rawat Inap', url: '/emr/ranap', module: 'med_ranap' },
      { title: 'Laboratorium', url: '/emr/lab', module: 'med_lab' },
      { title: 'Radiologi', url: '/emr/radiology', module: 'med_rad' },
      { title: 'Form IGD', url: '/med_igd/form', module: 'med_igd_form' },
      { title: 'Fisioterapi', url: '/med_fis', module: 'med_fis' },
      { title: 'Terapi Wicara', url: '/med_ter', module: 'med_ter' },
      { title: 'Okupasi Terapi', url: '/med_oku', module: 'med_oku' },
      { title: 'Operasi', url: '/med_ope', module: 'med_ope' },
      { title: 'Gizi', url: '/med_giz', module: 'med_giz' },
    ],
  },

  {
    type: '2',
    icon: Pill,
    title: 'Farmasi',
    module: 'farmasi',
    children: [
      { title: 'Daftar Resep', url: '/farmasi/resep', module: 'farmasi_resep' },
      { title: 'Resep Klinik', url: '/farmasi/klinik', module: 'farmasi_klinik' },
      { title: 'Penjualan Langsung (OTC)', url: '/farmasi/penjualan', module: 'farmasi_penjualan' },
      { title: 'Obat', url: '/farmasi/obat', module: 'farmasi_obat' },
    ],
  },

  {
    type: '2',
    icon: Wallet,
    title: 'Billing / Kasir',
    module: 'kasir',
    children: [
      { title: 'Transaksi Kasir', url: '/kasir', module: 'kasir_transaksi' },
      { title: 'Billing Lama', url: '/billing', module: 'billing' },
    ],
  },

  {
    type: '2',
    icon: TrendingUp,
    title: 'Keuangan',
    module: 'keuangan',
    children: [
      { title: 'Tarif Layanan', url: '/keu_tarif', module: 'keu_tarif' },
      { title: 'Neraca Harian', url: '/keuangan/neraca/harian', module: 'keuangan_neraca_harian' },
      { title: 'Neraca Bulanan', url: '/keuangan/neraca/bulanan', module: 'keuangan_neraca_bulanan' },
      { title: 'Neraca Tahunan', url: '/keuangan/neraca/tahunan', module: 'keuangan_neraca_tahunan' },
      { title: 'Daftar Pembiayaan', url: '/keuangan/pembiayaan', module: 'keuangan_pembiayaan' },
      { title: 'Input Pembiayaan', url: '/keuangan/pembiayaan/create', module: 'keuangan_pembiayaan_create' },
      { title: 'Rekap Pembiayaan', url: '/keuangan/pembiayaan/rekap', module: 'keuangan_pembiayaan_rekap' },
    ],
  },

  {
    type: '2',
    icon: Package,
    title: 'Inventory',
    module: 'inventory',
    children: [
      { title: 'Gudang', url: '/inv/gudang', module: 'inv_gudang' },
      { title: 'Pabrik', url: '/inv/pabrik', module: 'inv_pabrik' },
      { title: 'Kategori', url: '/inv/kategori', module: 'inv_kategori' },
      { title: 'Barang', url: '/inv/barang', module: 'inv_barang' },
      { title: 'Batch', url: '/inv/batch', module: 'inv_batch' },
      { title: 'Stock', url: '/inv/stock', module: 'inv_stock' },
      { title: 'Mutasi', url: '/inv/mutation', module: 'inv_mutation' },
      { title: 'Perencanaan', url: '/inventory/perencanaan', module: 'inv_perencanaan' },
      { title: 'PO / Purchase Order', url: '/inventory/po', module: 'inv_po' },
      { title: 'Barang Masuk / Faktur', url: '/inventory/faktur', module: 'inv_faktur' },
      { title: 'Retur Faktur', url: '/inventory/retur', module: 'inv_retur' },
      { title: 'Stok Opname Obat', url: '/inventory/opname', module: 'inv_opname' },
    ],
  },

  {
    type: '2',
    icon: FileText,
    title: 'Laporan',
    module: 'laporan',
    children: [
      { title: 'Pendapatan', url: '/lap_income', module: 'lap_income' },
      { title: 'Pengeluaran', url: '/lap_outcome', module: 'lap_outcome' },
      { title: 'Pemakaian Obat', url: '/lap_usage', module: 'lap_usage' },
      { title: 'Laporan Hutang', url: '/lap_hutang', module: 'lap_hutang' },
    ],
  },

  {
    type: '1',
    icon: HeartPulse,
    title: 'Laporan Rekam Medis',
    url: '/lap_rm',
    module: 'lap_rm',
  },

  {
    type: '2',
    icon: Briefcase,
    title: 'HRIS',
    module: 'hris',
    children: [
      { title: 'Daftar Tenaga', url: '/employee', module: 'sdi_tenaga' },
      { title: 'Rekap Absensi', url: '/sdi_absensi', module: 'sdi_absensi' },
      { title: 'Payroll', url: '/sdi_payroll', module: 'sdi_payroll' },
      { title: 'Pernyataan Perpanjang Kontrak', url: '/sdi_surat_kontrak', module: 'sdi_surat_kontrak' },
      { title: 'Setting Master', url: '/sdi_master', module: 'sdi_master' },
    ],
  },

  {
    type: '2',
    icon: Shield,
    title: 'Bridging BPJS',
    module: 'bridging_bpjs',
    children: [
      { title: 'Daftar SEP terbit', url: '/vclaim_sep', module: 'vclaim_sep' },
    ],
  },

  {
    type: '2',
    icon: Shield,
    title: 'Klaim BPJS',
    module: 'klaim_bpjs',
    children: [
      { title: 'New Klaim', url: '/new_klaim', module: 'new_klaim' },
    ],
  },

  {
    type: '2',
    icon: Settings,
    title: 'Setting',
    module: 'setting',
    children: [
      { title: 'Akun User', url: '/users', module: 'master_user' },
      { title: 'Profesi', url: '/master/profesi', module: 'adm_profesi' },
      { title: 'Poli', url: '/master/poli', module: 'adm_poli' },
      { title: 'Obat', url: '/master/drugs', module: 'adm_obat' },
      { title: 'Kelompok Tarif', url: '/master/kelompok-tarif', module: 'adm_komp_tarif' },
      { title: 'Komponen Tarif', url: '/master/komponen-tarif', module: 'adm_komp_tarif' },
      { title: 'Dokter', url: '/master/dokter', module: 'adm_dokter' },
      { title: 'Tipe Pasien', url: '/master/tipe-pasien', module: 'adm_tipe_pasien' },
      { title: 'Layanan', url: '/master/layanan', module: 'adm_layanan' },
      { title: 'Tarif', url: '/master/tarif', module: 'adm_tarif' },
      { title: 'Kamar', url: '/master/kamar', module: 'adm_kamar' },
      { title: 'Tempat Tidur', url: '/master/tempat-tidur', module: 'adm_tempat_tidur' },
      { title: 'Penggunaan Tempat Tidur', url: '/master/penggunaan-tempat-tidur', module: 'adm_penggunaan_tempat_tidur' },
      { title: 'Lab Kategori', url: '/master/lab-kategori', module: 'lab_kategori' },
      { title: 'Lab Paket', url: '/lab/paket', module: 'lab_paket' },
      { title: 'Lab Service', url: '/lab/service', module: 'lab_service' },
      { title: 'Lab Service Item', url: '/lab/service-item', module: 'lab_service_item' },
    ],
  },

  {
    type: '1',
    icon: MessageCircle,
    title: 'WA Gateway',
    url: '/wa_gateway',
    module: 'wa_gateway',
  },
];

/**
 * Check if a menu item is active based on current path
 */
export function isMenuActive(
  menu: MenuItem | SubMenuItem,
  currentPath: string
): boolean {
  const cleanPath = currentPath.replace(/^\//, '').replace(/\/$/, '');

  // Check URL match
  if ('url' in menu && menu.url) {
    const menuUrl = menu.url.replace(/^\//, '').replace(/\/$/, '');

    // Home/Beranda special case
    if (menuUrl === 'dashboard' && (cleanPath === '' || cleanPath === 'dashboard')) {
      return true;
    }

    // Exact match
    if (menuUrl === cleanPath) {
      return true;
    }

    // Starts with (for nested routes)
    if (menuUrl && cleanPath.startsWith(menuUrl)) {
      return true;
    }
  }

  // Check children for parent menu
  if ('children' in menu && menu.children) {
    return menu.children.some((child) => {
      const childUrl = child.url.replace(/^\//, '').replace(/\/$/, '');
      return cleanPath === childUrl || cleanPath.startsWith(childUrl);
    });
  }

  return false;
}

/**
 * Get active parent menu based on current path
 */
export function getActiveParent(currentPath: string): string | null {
  for (const menu of mainMenus) {
    if (menu.type === '2' && isMenuActive(menu, currentPath)) {
      return menu.title;
    }
  }
  return null;
}
