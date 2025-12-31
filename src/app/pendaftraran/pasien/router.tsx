import PatientPage from ".";
import PatientDetailPage from "./detail";

export const pasienPendaftaran = {
  path: "pasien",
  handle: { breadcrumb: "List Pasien" },
  children: [
    {
      index: true,
      element: <PatientPage />,
    },
    {
      path: ":id",
      element: <PatientDetailPage />,
    },
  ],
};
