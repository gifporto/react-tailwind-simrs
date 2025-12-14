import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/app/Dashboard";
import About from "@/app/About";
import LoginPage from "@/app/Login";
import EmployeePage from "@/app/employee";
import EmployeeDetailPage from "@/app/employee/detail";
import EmployeeCreatePage from "@/app/employee/create";
import ThemeShowcase from "@/app/ThemeShowcase";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,   // layout
    children: [
      { path: "dashboard", element: <Dashboard />, },
      { path: "about", element: <About />, },

      { path: "employee", element: <EmployeePage />, },
      { path: "employee/detail/:id", element: <EmployeeDetailPage /> },
      { path: "employee/create", element: <EmployeeCreatePage /> },
      
      // Theme showcase for reference
      { path: "theme-showcase", element: <ThemeShowcase /> },
    ],
  },
]);
