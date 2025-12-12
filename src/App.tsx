// src/App.tsx
import { Outlet } from "react-router-dom";
import PageLayout from "@/layout/PageLayout";

export default function App() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
