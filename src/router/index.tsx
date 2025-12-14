import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/app/Dashboard";
import About from "@/app/About";
import LoginPage from "@/app/Login";
import EmployeePage from "@/app/employee";
import EmployeeDetailPage from "@/app/employee/detail";
import EmployeeCreatePage from "@/app/employee/create";
import ThemeShowcase from "@/app/ThemeShowcase";
import ErrorPage from "@/app/ErrorPage";
import ForbiddenPage from "@/app/ForbiddenPage";
import PlaceholderPage from "@/components/PlaceholderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "/",
    element: <App />,   // layout
    errorElement: <ErrorPage />,
    children: [
      { path: "dashboard", element: <Dashboard />, },
      { path: "about", element: <About />, },

      { path: "employee", element: <EmployeePage />, },
      { path: "employee/detail/:id", element: <EmployeeDetailPage /> },
      { path: "employee/create", element: <EmployeeCreatePage /> },
      
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
  // Catch-all for undefined routes
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
