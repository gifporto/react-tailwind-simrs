import PatientPage from ".";
import PatientDetailPage from "./detail";
import UpdatePatientPage from "./edit";

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
      handle: { breadcrumb: "Detail Pasien" },
      element: <PatientDetailPage />,
    },
    {
      path: ":id/edit",
      element: <UpdatePatientPage />,
    },
  ],
};
