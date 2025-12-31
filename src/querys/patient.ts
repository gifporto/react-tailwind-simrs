import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { PatientsAPI } from "@/lib/api";

export function usePatientList(
  page: number = 1,
  limit: number = 15,
  search?: string
) {
  return useQuery({
    queryKey: ["patients", "list", { page, limit, search }],
    queryFn: () => PatientsAPI.getList(page, limit, search),
    placeholderData: keepPreviousData,
    select: (data) => data,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", "detail", id],
    queryFn: () => PatientsAPI.getDetail(id),
    select: (data) => data,
  });
}

export function usePatientCreate() {
  return useMutation({
    mutationFn: (payload: any) => PatientsAPI.create(payload),
  });
}

export function usePatientUpdate(id: string) {
  return useMutation({
    mutationFn: (payload: any) => PatientsAPI.update(id, payload),
  });
}
