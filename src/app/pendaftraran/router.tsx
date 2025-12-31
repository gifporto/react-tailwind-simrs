import { pasienPendaftaran } from "./pasien/router";

export const pendaftaranRoutes = [
  {
    path: "pendaftaran",
    children: [pasienPendaftaran],
  },
];
