import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { PatientsAPI } from "@/lib/api"

export function usePatients(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: ["patients", page, limit, search],
    queryFn: async () => {
      const res: any = await PatientsAPI.getList(page, limit, search)
      return res
    },
    placeholderData: keepPreviousData,
  })
}
