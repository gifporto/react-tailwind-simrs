import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/app/Dashboard";
import LoginPage from "@/app/Login";
import PatientPage from "@/app/pendaftraran/pasien";
import PatientDetailPage from "@/app/pendaftraran/pasien/detail";
import PatientCreatePage from "@/app/pendaftraran/pasien/create";
import ThemeShowcase from "@/app/ThemeShowcase";
import ErrorPage from "@/app/ErrorPage";
import ForbiddenPage from "@/app/ForbiddenPage";
import PlaceholderPage from "@/components/PlaceholderPage";


import { ProtectedRoute, PublicRoute } from "@/lib/route-guard";
import EmrIgdIndexPage from "@/app/emr/igd";
import EmrIgdDetailPage from "@/app/emr/igd/detail";
import EmrIgdCreatePage from "@/app/emr/igd/create";
import EmrRadiologiIndexPage from "@/app/emr/radiologi";
import EmrRadiologiDetailPage from "@/app/emr/radiologi/detail";
import EmrLabDetailPage from "@/app/emr/lab/detail";
import EmrLabIndexPage from "@/app/emr/lab";
import RanapIndexPage from "@/app/emr/ranap";
import RanapDetailPage from "@/app/emr/ranap/detail";
import GudangIndexPage from "@/app/inventory/gudang";
import PabrikIndexPage from "@/app/inventory/pabrik";
import KategoriInventoryPage from "@/app/inventory/kategori";
import BarangIndexPage from "@/app/inventory/barang";
import BatchInventoryPage from "@/app/inventory/batch";
import InventoriStokPage from "@/app/inventory/stock";
import MutasiStokPage from "@/app/inventory/mutasi";
import PembelianPage from "@/app/inventory/order";
import AnjunganMandiri from "@/app/Apm";
import ObatIndexPage from "@/app/master/obat";

export const router = createBrowserRouter([
  // ================== PUBLIC ==================
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/apm",
        element: <AnjunganMandiri />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  // ================== PROTECTED ==================
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,   // layout
        errorElement: <ErrorPage />,
        handle: { breadcrumb: "Dashboard" },
        children: [

          {
            path: "/",
            element: <Dashboard />,
            handle: { breadcrumb: "Dashboard" },
          },

          // ✅ PASIEN
          {
            path: "daftar/pasien",
            element: <PatientPage />,
            handle: { breadcrumb: "Pasien" },
          },
          {
            path: "daftar/pasien/create",
            element: <PatientCreatePage />,
            handle: { breadcrumb: "Tambah Pasien" },
          },
          {
            path: "master/pasien/detail/:id",
            element: <PatientDetailPage />,
            handle: { breadcrumb: "Detail Pasien" },
          },

          {
            path: "emr/igd",
            element: <EmrIgdIndexPage />,
            handle: { breadcrumb: "EMR IGD" },
          },
          {
            path: "emr/igd/create",
            element: <EmrIgdCreatePage />,
            handle: { breadcrumb: "Tambah EMR IGD" },
          },
          {
            path: "emr/igd/detail/:id",
            element: <EmrIgdDetailPage />,
            handle: { breadcrumb: "Detail EMR IGD" },
          },

          {
            path: "emr/radiology",
            element: <EmrRadiologiIndexPage />,
            handle: { breadcrumb: "EMR Radiologi" },
          },
          {
            path: "emr/radiology/detail/:id",
            element: <EmrRadiologiDetailPage />,
            handle: { breadcrumb: "Detail EMR Radiologi" },
          },

          {
            path: "emr/lab",
            element: <EmrLabIndexPage />,
            handle: { breadcrumb: "EMR Lab" },
          },
          {
            path: "emr/lab/detail/:id",
            element: <EmrLabDetailPage />,
            handle: { breadcrumb: "Detail EMR Lab" },
          },

          {
            path: "emr/ranap",
            element: <RanapIndexPage />,
            handle: { breadcrumb: "Rawat Inap" },
          },
          {
            path: "emr/ranap/detail/:id",
            element: <RanapDetailPage />,
            handle: { breadcrumb: "Detail Rawat Inap" },
          },

          //inventory
          {
            path: "inv/gudang",
            element: <GudangIndexPage />,
            handle: { breadcrumb: "Gudang" },
          },
          {
            path: "inv/pabrik",
            element: <PabrikIndexPage />,
            handle: { breadcrumb: "Pabrik" },
          },
          {
            path: "inv/kategori",
            element: <KategoriInventoryPage />,
            handle: { breadcrumb: "Kategori" },
          },
          {
            path: "inv/barang",
            element: <BarangIndexPage />,
            handle: { breadcrumb: "Barang" },
          },
          {
            path: "inv/batch",
            element: <BatchInventoryPage />,
            handle: { breadcrumb: "Batch" },
          },
          {
            path: "inv/stock",
            element: <InventoriStokPage />,
            handle: { breadcrumb: "Stock" },
          },
          {
            path: "inv/mutation",
            element: <MutasiStokPage />,
            handle: { breadcrumb: "Mutasi" },
          },
          {
            path: "inv/order",
            element: <PembelianPage />,
            handle: { breadcrumb: "Order" },
          },

          //master
          {
            path: "master/obat",
            element: <ObatIndexPage />,
            handle: { breadcrumb: "Obat" },
          },

          // Theme showcase for reference
          { path: "theme-showcase", element: <ThemeShowcase /> },

          // Patient Registration
          {
            path: "pendaftaran",
            element: <PlaceholderPage
              title="Patient Registration"
              description="Comprehensive patient registration and management system"
              module="PENDAFTARAN"
              features={[
                "Patient registration (Rawat Jalan, IGD, Rawat Inap)",
                "Patient data management",
                "Medical record number generation",
                "Insurance verification (BPJS/Private)",
                "Appointment scheduling",
                "Patient search and history"
              ]}
              estimatedDate="Q1 2026"
            />,
          },
          {
            path: "pendaftaran/:type",
            element: <PlaceholderPage
              title="Patient Registration"
              description="Registration module is under development"
              module="PENDAFTARAN"
            />,
          },

          // Medical Examination
          {
            path: "pemeriksaan",
            element: <PlaceholderPage
              title="Medical Examination"
              description="Patient examination and treatment modules"
              module="PEMERIKSAAN"
              features={[
                "IGD/Emergency Room",
                "Outpatient (Rawat Jalan)",
                "Inpatient (Rawat Inap)",
                "Electronic Medical Records",
                "Doctor's notes and prescriptions",
                "Vital signs monitoring"
              ]}
              estimatedDate="Q1 2026"
            />,
          },
          {
            path: "pemeriksaan/:type",
            element: <PlaceholderPage
              title="Medical Examination"
              description="Examination module is under development"
              module="PEMERIKSAAN"
            />,
          },

          // Pharmacy
          {
            path: "farmasi",
            element: <PlaceholderPage
              title="Pharmacy Management"
              description="Complete pharmacy and medication management system"
              module="FARMASI"
              features={[
                "Prescription processing",
                "Medication dispensing",
                "Drug inventory management",
                "Stock alerts and expiry tracking",
                "Formulary management",
                "Drug interaction checking"
              ]}
              estimatedDate="Q2 2026"
            />,
          },
          {
            path: "farmasi/:sub",
            element: <PlaceholderPage
              title="Pharmacy"
              description="Pharmacy module is under development"
              module="FARMASI"
            />,
          },

          // Billing & Cashier
          {
            path: "billing",
            element: <PlaceholderPage
              title="Billing & Cashier"
              description="Patient billing and payment processing"
              module="BILLING"
              features={[
                "Invoice generation",
                "Payment processing",
                "Cashier operations",
                "Billing reports",
                "Insurance claims",
                "Discount management"
              ]}
              estimatedDate="Q2 2026"
            />,
          },
          {
            path: "billing/:sub",
            element: <PlaceholderPage
              title="Billing & Cashier"
              description="Billing module is under development"
              module="BILLING"
            />,
          },

          // Finance
          {
            path: "keuangan",
            element: <PlaceholderPage
              title="Finance Management"
              description="Hospital financial management system"
              module="KEUANGAN"
              features={[
                "Service rates configuration",
                "Revenue tracking",
                "Expense management",
                "Balance sheet",
                "Budgeting",
                "Financial reports"
              ]}
              estimatedDate="Q2 2026"
            />,
          },
          {
            path: "keuangan/:sub",
            element: <PlaceholderPage
              title="Finance"
              description="Finance module is under development"
              module="KEUANGAN"
            />,
          },

          // Inventory
          {
            path: "inventory",
            element: <PlaceholderPage
              title="Inventory Management"
              description="Hospital inventory and procurement system"
              module="INVENTORY"
              features={[
                "Purchase orders",
                "Supplier management",
                "Stock management",
                "Stock opname",
                "Item catalog",
                "Inventory reports"
              ]}
              estimatedDate="Q3 2026"
            />,
          },
          {
            path: "inventory/:sub",
            element: <PlaceholderPage
              title="Inventory"
              description="Inventory module is under development"
              module="INVENTORY"
            />,
          },

          // Reports
          {
            path: "laporan",
            element: <PlaceholderPage
              title="Reports & Analytics"
              description="Comprehensive reporting system"
              module="LAPORAN"
              features={[
                "Revenue reports",
                "Expense reports",
                "Patient statistics",
                "Service utilization",
                "Performance metrics",
                "Custom report builder"
              ]}
              estimatedDate="Q3 2026"
            />,
          },
          {
            path: "laporan/:sub",
            element: <PlaceholderPage
              title="Reports"
              description="Report module is under development"
              module="LAPORAN"
            />,
          },

          // Medical Records
          {
            path: "laporan-rm",
            element: <PlaceholderPage
              title="Medical Records Reports"
              description="Medical records and clinical documentation reports"
              module="LAPORAN_RM"
              features={[
                "Patient medical history",
                "Treatment summaries",
                "Discharge summaries",
                "Clinical statistics",
                "ICD-10 coding reports",
                "Medical documentation audit"
              ]}
              estimatedDate="Q3 2026"
            />,
          },
          {
            path: "laporan-rm/:sub",
            element: <PlaceholderPage
              title="Medical Records"
              description="Medical records module is under development"
              module="LAPORAN_RM"
            />,
          },

          // BPJS
          {
            path: "bpjs",
            element: <PlaceholderPage
              title="BPJS Integration"
              description="BPJS healthcare integration system"
              module="BPJS"
              features={[
                "BPJS eligibility verification",
                "SEP (Surat Eligibilitas Peserta) generation",
                "Claim submission",
                "Claim tracking",
                "BPJS reports",
                "VClaim integration"
              ]}
              estimatedDate="Q4 2026"
            />,
          },
          {
            path: "bpjs/:sub",
            element: <PlaceholderPage
              title="BPJS"
              description="BPJS module is under development"
              module="BPJS"
            />,
          },

          // Settings
          {
            path: "setting",
            element: <PlaceholderPage
              title="System Settings"
              description="Hospital information system configuration"
              module="SETTING"
              features={[
                "Master data management",
                "User management",
                "Role & permissions",
                "System parameters",
                "Department configuration",
                "Service catalog"
              ]}
              estimatedDate="Q1 2026"
            />,
          },
          {
            path: "setting/:sub",
            element: <PlaceholderPage
              title="Settings"
              description="Settings module is under development"
              module="SETTING"
            />,
          },

          // Catch-all for undefined routes within dashboard
          {
            path: "*",
            element: <ErrorPage />,
          },
        ],
      },
    ],
  },

  // ================== OTHER ==================
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
