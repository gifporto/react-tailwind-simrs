// lib/api.ts
"use client";

import { api } from "./axios";

export const AuthAPI = {
    login: async (email: string, password: string) => {
        const res = await api.post("/v2/auth/login", {
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
};

export const RadiologyAPI = {
    getCategory: async (page = 1, limit = 30, search = "") => {
        const res = await api.get("/master/radiologies/categories", {
            params: { page, limit, search },
        });
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

    getListIcd10: async ( limit = "", search = "") => {
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





