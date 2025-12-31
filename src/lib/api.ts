// lib/api.ts
"use client";

import { api } from "./axios";

const STATIC_KEY = "SERGOFUzR0YzNzhWRlc2KV5aVldGMzZERlIjJSYoUlhEJEVeKlJAQFRA";

export const ApmAPI = {
    create: async (payload: { value: string }) => {
        const res = await api.post("/apm/check-booking-code", payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': STATIC_KEY,
            }
        });
        return res.data;
    },

    checkBpjs: async (payload: { bpjs: string, }) => {
        const res = await api.post("/apm/bpjs-check", payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': STATIC_KEY,
            }
        });
        return res.data;
    },

    submit: async (payload: { nik: string, kode_booking: string, encoding: number[] }) => {
        const res = await api.post("/apm/bpjs-verify", payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': STATIC_KEY,
            }
        });
        return res.data;
    },
};

export const AuthAPI = {
    login: async (email: string, password: string) => {
        const res = await api.post("/auth/login", {
            username: email,
            password: password,
        });
        return res.data;
    },
};

export const PatientsAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/patients", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/patients/${id}`);
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/patients", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/patients/${id}`, payload);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await api.delete(`/patients/${id}`);
        return res.data;
    },
};

//emr
export const EmrIgdAPI = {
    getService: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}/services`);
        return res.data;
    },

    createService: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/services`, payload);
        return res.data;
    },

    deleteService: async (id: string, idService: string) => {
        const res = await api.delete(`/inspections/igd/${id}/services/${idService}`);
        return res.data;
    },

    getLab: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}/laboratories`);
        return res.data;
    },

    createLab: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/laboratories`, payload);
        return res.data;
    },

    deleteLab: async (id: string, idLab: string) => {
        const res = await api.delete(`/inspections/igd/${id}/laboratories/${idLab}`);
        return res.data;
    },

    getRadiologi: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}/radiologies`);
        return res.data;
    },

    createRadiologi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/radiologies`, payload);
        return res.data;
    },

    deleteRadiologi: async (id: string, idRadiologi: string) => {
        const res = await api.delete(`/inspections/igd/${id}/radiologies/${idRadiologi}`);
        return res.data;
    },

    getList: async (page = 1, perPage = 10) => {
        const res = await api.get("/inspections/igd", {
            params: { page, per_page: perPage },
        });
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}`);
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inspections/igd", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}`, payload);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await api.delete(`/inspections/igd/${id}`);
        return res.data;
    },

    getVisit: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}/visits`);
        return res.data;
    },

    createVisit: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/visits`, payload);
        return res.data;
    },

    updateVisit: async (id: string, idVisit: string, payload: { id_dokter: string }) => {
        const res = await api.put(`/inspections/igd/${id}/visits/${idVisit}`, payload);
        return res.data;
    },

    deleteVisit: async (id: string, idVisit: string) => {
        const res = await api.delete(`/inspections/igd/${id}/visits/${idVisit}`);
        return res.data;
    },
};

export const EmrRanapAPI = {
    getCppt: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/cppt`);
        return res.data;
    },
    createCppt: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/cppt`, payload);
        return res.data;
    },
    updateCppt: async (id: string, idCppt: string, payload: any) => {
        const res = await api.put(`/inspections/ranap/${id}/cppt/${idCppt}`, payload);
        return res.data;
    },
    deleteCppt: async (id: string, idCppt: string, payload: any) => {
        const res = await api.delete(`/inspections/ranap/${id}/cppt/${idCppt}`, payload);
        return res.data;
    },
    patchCppt: async (id: string, idCppt: string, payload: any) => {
        const res = await api.patch(`/inspections/ranap/${id}/cppt/${idCppt}/notes`, payload);
        return res.data;
    },
    verifyCppt: async (id: string, idCppt: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/cppt/${idCppt}/verify`, payload);
        return res.data;
    },


    getList: async (page = 1, perPage = 10) => {
        const res = await api.get("/inspections/ranap", {
            params: { page, per_page: perPage },
        });
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}`);
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inspections/ranap", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}`, payload);
        return res.data;
    },

    delete: async (id: string) => {
        const res = await api.delete(`/inspections/ranap/${id}`);
        return res.data;
    },

    getService: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/services`);
        return res.data;
    },

    createService: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/services`, payload);
        return res.data;
    },

    deleteService: async (id: string, idService: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/services/${idService}`);
        return res.data;
    },

    getLab: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/laboratories`);
        return res.data;
    },

    createLab: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/laboratories`, payload);
        return res.data;
    },

    deleteLab: async (id: string, idLab: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/laboratories/${idLab}`);
        return res.data;
    },

    getRadiologi: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/radiologies`);
        return res.data;
    },

    createRadiologi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/radiologies`, payload);
        return res.data;
    },

    deleteRadiologi: async (id: string, idRadiologi: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/radiologies/${idRadiologi}`);
        return res.data;
    },

    getVisit: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/visits`);
        return res.data;
    },

    createVisit: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/visits`, payload);
        return res.data;
    },

    updateVisit: async (id: string, idVisit: string, payload: { id_dokter: string }) => {
        const res = await api.put(`/inspections/ranap/${id}/visits/${idVisit}`, payload);
        return res.data;
    },

    deleteVisit: async (id: string, idVisit: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/visits/${idVisit}`);
        return res.data;
    },

    getSuhu: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/suhu`);
        return res.data;
    },
    createSuhu: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/suhu`, payload);
        return res.data;
    },
    deleteSuhu: async (id: string, idSuhu: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/suhu/${idSuhu}`);
        return res.data;
    },

    getTensi: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/tensi`);
        return res.data;
    },
    createTensi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/tensi`, payload);
        return res.data;
    },
    deleteTensi: async (id: string, idTensi: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/tensi/${idTensi}`);
        return res.data;
    },

    getNadi: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/nadi`);
        return res.data;
    },
    createNadi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/nadi`, payload);
        return res.data;
    },
    deleteNadi: async (id: string, idNadi: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/nadi/${idNadi}`);
        return res.data;
    },

    getRespiration: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/respiration-rate`);
        return res.data;
    },
    createRespiration: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/respiration-rate`, payload);
        return res.data;
    },
    deleteRespiration: async (id: string, idRespiration: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/respiration-rate/${idRespiration}`);
        return res.data;
    },

    getNyeri: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/skala-nyeri`);
        return res.data;
    },
    createNyeri: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/skala-nyeri`, payload);
        return res.data;
    },
    deleteNyeri: async (id: string, idNyeri: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/skala-nyeri/${idNyeri}`);
        return res.data;
    },

    getTinggiBadan: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/tinggi-badan`);
        return res.data;
    },
    createTinggiBadan: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/tinggi-badan`, payload);
        return res.data;
    },
    deleteTinggiBadan: async (id: string, idTinggi: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/tinggi-badan/${idTinggi}`);
        return res.data;
    },

    getBeratBadan: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/berat-badan`);
        return res.data;
    },
    createBeratBadan: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/berat-badan`, payload);
        return res.data;
    },
    deleteBeratBadan: async (id: string, idBerat: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/berat-badan/${idBerat}`);
        return res.data;
    },

    getSpo: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/spo2`);
        return res.data;
    },
    createSpo: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/spo2`, payload);
        return res.data;
    },
    deleteSpo: async (id: string, idSpo: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/spo2/${idSpo}`);
        return res.data;
    },

    getIntervensi: async (id: string) => {
        const res = await api.get(`/inspections/ranap/${id}/ttv/intervensi-nyeri`);
        return res.data;
    },
    createIntervensi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/ranap/${id}/ttv/intervensi-nyeri`, payload);
        return res.data;
    },
    deleteIntervensi: async (id: string, idIntervensi: string) => {
        const res = await api.delete(`/inspections/ranap/${id}/ttv/intervensi-nyeri/${idIntervensi}`);
        return res.data;
    },
};

export const EmrRadiologyAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inspections/radiologies", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/inspections/radiologies/${id}`);
        return res.data;
    },

    process: async (id: string) => {
        const res = await api.post(`/inspections/radiologies/${id}/process`);
        return res.data;
    },

    complete: async (id: string, payload: FormData, config?: any) => {
        const res = await api.post(`/inspections/radiologies/${id}/complete`, payload, config);
        return res.data;
    },

    publish: async (id: string) => {
        const res = await api.post(`/inspections/radiologies/${id}/publish`);
        return res.data;
    },

    abort: async (id: string) => {
        const res = await api.delete(`/inspections/radiologies/${id}`);
        return res.data;
    },

    restart: async (id: string) => {
        const res = await api.post(`/inspections/radiologies/${id}/restart`);
        return res.data;
    },

    processDetail: async (id: string, idDetail: string, payload: any, config?: any) => {
        const res = await api.post(`/inspections/radiologies/${id}/process/${idDetail}`, payload, config);
        return res.data;
    },

    deleteFile: async (id: string, idDetail: string, fileName: string) => {
        const res = await api.delete(`/inspections/radiologies/${id}/process/${idDetail}/file/${fileName}`);
        return res.data;
    },
};

export const EmrLabAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inspections/laboratories", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/inspections/laboratories/${id}`);
        return res.data;
    },

    process: async (id: string) => {
        const res = await api.post(`/inspections/laboratories/${id}/process`);
        return res.data;
    },

    complete: async (id: string) => {
        const res = await api.post(`/inspections/laboratories/${id}/complete`);
        return res.data;
    },

    abort: async (id: string) => {
        const res = await api.delete(`/inspections/laboratories/${id}`);
        return res.data;
    },
};

export const AsesmentMedicAPI = {
    getAsesment: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}/asesmen-medis`);
        return res.data;
    },

    updateAnamnesa: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/anamnesa`, payload);
        return res.data;
    },

    updateAlergi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/alergi`, payload);
        return res.data;
    },

    updatePsikologi: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/status-psikologis`, payload);
        return res.data;
    },

    updateKeadaanUmum: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/keadaan-umum`, payload);
        return res.data;
    },

    updateGscScore: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/gsc-score`, payload);
        return res.data;
    },

    updateVitalSign: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/vital-signs`, payload);
        return res.data;
    },

    deleteVitalSign: async (id: string, idVitalSign: string) => {
        const res = await api.delete(`/inspections/igd/${id}/asesmen-medis/vital-signs/${idVitalSign}`);
        return res.data;
    },

    updateSkriningNeyri: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/skrining-nyeri`, payload);
        return res.data;
    },

    updatePemeriksaanFisik: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/pemeriksaan-fisik`, payload);
        return res.data;
    },

    updatePenunjang: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/pemeriksaan-penunjang`, payload);
        return res.data;
    },

    updateDiagnosis: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/diagnosis`, payload);
        return res.data;
    },

    updatePerencanaanTindakan: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/perencanaan-tindakan`, payload);
        return res.data;
    },

    updateTindakLanjut: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/rencana-tindak-lanjut`, payload);
        return res.data;
    },

    updateKondisiMeninggalkan: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/kondisi-meninggalkan-igd`, payload);
        return res.data;
    },

    updateDischargePlan: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/asesmen-medis/discharge-planning`, payload);
        return res.data;
    },

    // updateResepObat: async (id: string, payload: any) => {
    //     const res = await api.post(`/inspections/igd/${id}/asesmen-medis/resep-obat`, payload);
    //     return res.data;
    // },
    updateResepObat: async (payload: any) => {
        const res = await api.post("/prescriptions", payload)
        return res.data
    },

    deleteResepObat: async (id: string, idResepObat: string) => {
        const res = await api.delete(`/inspections/igd/${id}/asesmen-medis/resep-obat/${idResepObat}`);
        return res.data;
    },
};

export const AsesmentTriageAPI = {
    getList: async (id: string) => {
        const res = await api.get(`/inspections/igd/${id}/triage`);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.post(`/inspections/igd/${id}/triage`, payload);
        return res.data;
    },
};

//inventory
export const InvGudangAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/warehouses", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/warehouses", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/warehouses/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/warehouses/${id}`, payload);
        return res.data;
    },
};
export const InvPabrikAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/factories", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/factories", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/factories/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/factories/${id}`, payload);
        return res.data;
    },
};
export const InvKategoriAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/categories", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/categories", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/categories/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/categories/${id}`, payload);
        return res.data;
    },
};
export const InvBarangAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/items", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/items", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/items/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/items/${id}`, payload);
        return res.data;
    },
};
export const InvBatchAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/batches", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/batches", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/batches/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/batches/${id}`, payload);
        return res.data;
    },
};
export const InvUnitAPI = {
    getList: async () => {
        const res = await api.get("/inventory/units");
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/units", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/units/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/units/${id}`, payload);
        return res.data;
    },
};
export const InvStockAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/stok", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/stok", payload);
        return res.data;
    },

    getSummary: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/stok/summary", {
            params: { page, limit, search },
        });
        return res.data;
    },
    getSummaryWarehouse: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/stok/by-warehouse", {
            params: { page, limit, search },
        });
        return res.data;
    },
    getSummaryBatch: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/stok/by-batch", {
            params: { page, limit, search },
        });
        return res.data;
    },
    getAlert: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/stok/alerts", {
            params: { page, limit, search },
        });
        return res.data;
    },
};
export const InvMutasiAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/inventory/i-mutasi", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/i-mutasi", payload);
        return res.data;
    },

    transfer: async (payload: any) => {
        const res = await api.post("/inventory/i-mutasi", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/batches/${id}`, payload);
        return res.data;
    },

    delete: async (id: string, payload: any) => {
        const res = await api.delete(`/inventory/batches/${id}`, payload);
        return res.data;
    },
};
export const InvOrderAPI = {
    getList: async () => {
        const res = await api.get("/inventory/pembelian");
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/inventory/pembelian", payload);
        return res.data;
    },

    update: async (id: string, payload: any) => {
        const res = await api.put(`/inventory/pembelian/${id}`, payload);
        return res.data;
    },

    approve: async (id: string) => {
        const res = await api.post(`/inventory/pembelian/${id}/approve`);
        return res.data;
    },

    reject: async (id: string) => {
        const res = await api.post(`/inventory/pembelian/${id}/reject`);
        return res.data;
    },
};

//Farmasi
export const FarResepAPI = {
    getList: async () => {
        const res = await api.get("/prescriptions");
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/prescriptions/${id}`);
        return res.data;
    },

    approve: async (id: string, payload: { items: { id: number; stock_id: number }[] }) => {
    const res = await api.post(`/prescriptions/${id}/approve`, payload);
    return res.data;
},
};

// Master
export const DoctorAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/doctors", {
            params: { page, limit, search },
        });
        return res.data;
    },
};

export const PoliAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/polis", {
            params: { page, limit, search },
        });
        return res.data;
    },
};

export const RadiologyAPI = {
    getCategory: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/radiologies/categories", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getService: async () => {
        const res = await api.get("/master/radiologies?mode=tree");
        return res.data;
    },

    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/radiologies", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getDetail: async (id: string) => {
        const res = await api.get(`/master/radiologies/${id}`);
        return res.data;
    },
};

export const LabAPI = {
    getCategory: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/laboratories/categories", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/laboratories", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getService: async () => {
        const res = await api.get("/master/laboratories?mode=tree");
        return res.data;
    },
};

export const ServiceAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/services", {
            params: { page, limit, search },
        });
        return res.data;
    },
};

export const IcdAPI = {
    getListIcd9: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/icd9", {
            params: { page, limit, search },
        });
        return res.data;
    },

    getListIcd10: async (limit = "", search = "") => {
        const res = await api.get("/master/icd10", {
            params: { limit, search },
        });
        return res.data;
    },
};

export const HakKelasAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/hak-kelas", {
            params: { page, limit, search },
        });
        return res.data;
    },
};

export const ObatAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/drugs", {
            params: { page, limit, search },
        });
        return res.data;
    },

    create: async (payload: any) => {
        const res = await api.post("/master/drugs", payload);
        return res.data;
    },
};

export const TriageAPI = {
    getList: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/triage", {
            params: { page, limit, search },
        });
        return res.data;
    },
};





