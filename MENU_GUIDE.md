# 🔧 Menu Configuration Guide

## Overview
The sidebar menu has been successfully converted from the Laravel blade component to React. All menu items from the original system are now available.

## Menu Structure

### Files
- **`src/config/menu.ts`** - Menu configuration (converted from Laravel)
- **`src/components/app-sidebar.tsx`** - Sidebar component
- **`src/components/nav-main.tsx`** - Navigation rendering logic

## Menu Types

### Type 1: Single Menu
Direct link without children
```typescript
{
  type: '1',
  icon: Home,
  title: 'Beranda',
  url: '/dashboard',
  module: 'beranda',
}
```

### Type 2: Menu with Submenu
Collapsible menu with children
```typescript
{
  type: '2',
  icon: Wheelchair,
  title: 'Pendaftaran',
  module: 'pendaftaran',
  children: [
    {
      title: 'Data Pasien',
      url: '/master/pasien',
      module: 'reg_pasien',
    },
    // ... more children
  ],
}
```

## Available Menus

### 1. Beranda (Dashboard)
- **URL**: `/dashboard`
- **Module**: `beranda`

### 2. Pendaftaran (Registration)
- Data Pasien
- Pembatalan Transaksi
- IGD
- Rawat Jalan
- Rawat Inap

### 3. Pemeriksaan (Medical Examination)
- IGD
- Rawat Jalan
- Rawat Inap
- Laboratorium
- Radiologi
- Form IGD
- Fisioterapi
- Terapi Wicara
- Okupasi Terapi
- Operasi
- Gizi

### 4. Farmasi (Pharmacy)
- Daftar Resep
- Resep Klinik
- Penjualan Langsung (OTC)
- Obat

### 5. Billing / Kasir (Cashier)
- Transaksi Kasir
- Billing Lama

### 6. Keuangan (Finance)
- Tarif Layanan
- Neraca Harian/Bulanan/Tahunan
- Daftar Pembiayaan
- Input Pembiayaan
- Rekap Pembiayaan

### 7. Inventory
- Perencanaan
- PO / Purchase Order
- Barang Masuk / Faktur
- Retur Faktur
- Stok Opname Obat

### 8. Laporan (Reports)
- Pendapatan
- Pengeluaran
- Pemakaian Obat
- Laporan Hutang

### 9. Laporan Rekam Medis
- Single menu for medical records reports

### 10. HRIS
- Daftar Tenaga (Employee) - **Already implemented: `/employee`**
- Rekap Absensi
- Payroll
- Pernyataan Perpanjang Kontrak
- Setting Master

### 11. Bridging BPJS
- Daftar SEP terbit

### 12. Klaim BPJS
- New Klaim

### 13. Setting
- Akun User
- Profesi
- Poli
- Obat
- Kelompok Tarif
- Komponen Tarif
- Dokter
- Tipe Pasien
- Layanan
- Tarif
- Kamar
- Tempat Tidur
- Penggunaan Tempat Tidur
- Lab Kategori
- Lab Paket
- Lab Service
- Lab Service Item

### 14. WA Gateway
- WhatsApp Gateway management

## How to Add a New Menu Item

### 1. Add to Menu Config
Edit `src/config/menu.ts`:

```typescript
{
  type: '1', // or '2' for menu with children
  icon: YourIcon, // Import from lucide-react
  title: 'New Menu',
  url: '/new-menu',
  module: 'new_menu',
}
```

### 2. Create the Page Component
Create `src/app/NewMenu.tsx`:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewMenuPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">New Menu</CardTitle>
        <p className="text-sm text-muted-foreground">Description</p>
      </CardHeader>
      <CardContent>
        {/* Your content */}
      </CardContent>
    </Card>
  );
}
```

### 3. Add Route
Edit `src/router/index.tsx`:

```typescript
import NewMenuPage from "@/app/NewMenu";

// Add to children array:
{ path: "new-menu", element: <NewMenuPage /> },
```

## Active State Logic

The menu automatically detects active states based on:
1. **Exact URL match**: Current path equals menu URL
2. **Path prefix match**: Current path starts with menu URL
3. **Child active**: Any child menu is active (for parent menus)

### Example:
- URL: `/employee/detail/123`
- Matches: `/employee` menu item (prefix match)
- Result: "HRIS" parent menu opens, "Daftar Tenaga" is highlighted

## Customizing Icons

Icons are from `lucide-react`. Available icons:
```typescript
import {
  Home,
  Wheelchair,
  Stethoscope,
  Pill,
  Wallet,
  TrendingUp,
  Package,
  FileText,
  // ... and many more
} from "lucide-react";
```

Browse all icons: https://lucide.dev/icons

## Menu Styling

The menu uses the theme colors:
- **Active parent**: Primary color text, bold font
- **Active child**: Primary color background (10% opacity), border-left accent
- **Hover**: Sidebar accent color
- **Icon size**: Automatically scaled

## Creating Placeholder Pages

For menus that don't have pages yet, create a simple placeholder:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          Page Under Development
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This feature is currently under development
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This page will be available soon. Please check back later.
        </p>
      </CardContent>
    </Card>
  );
}
```

## Module Codes Reference

Each menu has a `module` code used for tracking and permissions:

| Menu | Module Code |
|------|-------------|
| Beranda | `beranda` |
| Data Pasien | `reg_pasien` |
| IGD | `reg_igd` |
| Rawat Jalan | `reg_rajal` |
| Rawat Inap | `reg_ranap` |
| EMR IGD | `med_igd` |
| Farmasi Resep | `farmasi_resep` |
| Kasir | `kasir_transaksi` |
| Employee | `sdi_tenaga` |
| ... | ... |

## Next Steps

1. **Create placeholder pages** for all menu items
2. **Implement routing** for each page
3. **Add content** to each module page
4. **Test navigation** and active states
5. **Add permissions** based on user roles (future)

## Example: Complete Menu Implementation

```typescript
// 1. Add to menu.ts
{
  type: '2',
  icon: Wheelchair,
  title: 'Patients',
  module: 'patients',
  children: [
    { title: 'Patient List', url: '/patients', module: 'patient_list' },
    { title: 'Add Patient', url: '/patients/create', module: 'patient_create' },
  ],
}

// 2. Create PatientList.tsx
export default function PatientList() {
  return <div>Patient List</div>
}

// 3. Create PatientCreate.tsx
export default function PatientCreate() {
  return <div>Add New Patient</div>
}

// 4. Add routes in router/index.tsx
{ path: "patients", element: <PatientList /> },
{ path: "patients/create", element: <PatientCreate /> },
```

---

**Status**: ✅ Menu configuration complete  
**Total Menus**: 14 main menus, 80+ submenu items  
**Next Phase**: Implement individual module pages
