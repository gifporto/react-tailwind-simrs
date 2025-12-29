"use client"

import * as React from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, EmrRanapAPI, DoctorAPI, PoliAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Hospital,
  Trash2,
  Loader2,
  RefreshCw,
  Edit2,
  Plus,
  Check,
  ChevronsUpDown,
  User,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/* =====================
   Configurations & Types
===================== */

const API_MAP = {
  EmrIgdAPI: { service: EmrIgdAPI, label: "IGD" },
  EmrRanapAPI: { service: EmrRanapAPI, label: "Rawat Inap" },
}

interface VisitApiInterface {
  getVisit: (id: string) => Promise<any>;
  createVisit: (id: string, data: any) => Promise<any>;
  updateVisit: (id: string, visitId: string, data: any) => Promise<any>;
  deleteVisit: (id: string, visitId: string) => Promise<any>;
}

interface KunjunganUnitProps {
  api: keyof typeof API_MAP;
}

type VisitItem = {
  id: number
  no_reg: string
  tgl: string
  no_antrian: number
  is_checkin: "Y" | "N"
  checkin_time: string | null
  is_closed: "Y" | "N"
  closed_at: string | null
  poli: { id: number; nama_poli: string }
  dokter: { id: number; nama_dokter: string }
}

type DoctorItem = { id: number; nama_dokter: string }
type PoliItem = { id: number; desk_poli: string; desk_singkatan: string }

export default function KunjunganUnit({ api }: KunjunganUnitProps) {
  const activeApi = API_MAP[api].service as VisitApiInterface;
  const moduleLabel = API_MAP[api].label;
  const { id } = useParams<{ id: string }>()

  const [visits, setVisits] = React.useState<VisitItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState(false)

  // --- Master Data States ---
  const [doctors, setDoctors] = React.useState<DoctorItem[]>([])
  const [doctorSearch, setDoctorSearch] = React.useState("")
  const [doctorPage, setDoctorPage] = React.useState(1)
  const [doctorHasMore, setDoctorHasMore] = React.useState(true)
  const [loadingDoctors, setLoadingDoctors] = React.useState(false)

  const [polis, setPolis] = React.useState<PoliItem[]>([])
  const [poliSearch, setPoliSearch] = React.useState("")
  const [poliPage, setPoliPage] = React.useState(1)
  const [poliHasMore, setPoliHasMore] = React.useState(true)
  const [loadingPolis, setLoadingPolis] = React.useState(false)

  // --- UI States ---
  const [openDoctorCombo, setOpenDoctorCombo] = React.useState(false)
  const [openPoliCombo, setOpenPoliCombo] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedVisit, setSelectedVisit] = React.useState<VisitItem | null>(null)

  const [formData, setFormData] = React.useState({
    id_dokter: "",
    id_poli: ""
  })

  /* =====================
     Data Fetching
  ===================== */

  const fetchVisits = React.useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await activeApi.getVisit(id)
      setVisits(response.data || [])
    } catch (error) {
      toast.error(`Gagal memuat data kunjungan ${moduleLabel}`)
    } finally {
      setLoading(false)
    }
  }, [id, activeApi, moduleLabel])

  const fetchDoctors = async (pageNum: number, searchKey: string, append: boolean = false) => {
    if (loadingDoctors) return
    setLoadingDoctors(true)
    try {
      const res = await DoctorAPI.getList(pageNum, 30, searchKey)
      const newData = res.data || []
      setDoctors(prev => append ? [...prev, ...newData] : newData)
      setDoctorHasMore(newData.length > 0 && pageNum < res.meta.pagination.total_pages)
    } catch (error) {
      toast.error("Gagal memuat dokter")
    } finally {
      setLoadingDoctors(false)
    }
  }

  const fetchPolis = async (pageNum: number, searchKey: string, append: boolean = false) => {
    if (loadingPolis) return
    setLoadingPolis(true)
    try {
      const res = await PoliAPI.getList(pageNum, 10, searchKey)
      const newData = res.data || []
      setPolis(prev => append ? [...prev, ...newData] : newData)
      setPoliHasMore(newData.length > 0 && pageNum < res.meta.pagination.total_pages)
    } catch (error) {
      toast.error("Gagal memuat poli")
    } finally {
      setLoadingPolis(false)
    }
  }

  React.useEffect(() => {
    if (isDialogOpen) {
      setDoctorPage(1)
      fetchDoctors(1, doctorSearch, false)
    }
  }, [doctorSearch, isDialogOpen])

  React.useEffect(() => {
    if (isDialogOpen && !selectedVisit) {
      setPoliPage(1)
      fetchPolis(1, poliSearch, false)
    }
  }, [poliSearch, isDialogOpen, selectedVisit])

  React.useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  /* =====================
     Handlers
  ===================== */

  const handleOpenCreate = () => {
    setSelectedVisit(null)
    setFormData({ id_dokter: "", id_poli: "" })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (item: VisitItem) => {
    setSelectedVisit(item)
    setFormData({
      id_dokter: item.dokter.id.toString(),
      id_poli: item.poli.id.toString()
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!id) return
    if (!formData.id_dokter || (!selectedVisit && !formData.id_poli)) {
      return toast.error("Silakan lengkapi data terlebih dahulu")
    }

    setActionLoading(true)
    try {
      if (selectedVisit) {
        // Mode Update (Hanya Update Dokter biasanya di EMR)
        await activeApi.updateVisit(id, selectedVisit.id.toString(), {
          id_dokter: formData.id_dokter,
        })
        toast.success("Data kunjungan berhasil diperbarui")
      } else {
        // Mode Create
        await activeApi.createVisit(id, {
          id_dokter: formData.id_dokter,
          id_poli: formData.id_poli
        })
        toast.success(`Kunjungan ${moduleLabel} berhasil ditambahkan`)
      }

      setIsDialogOpen(false)
      fetchVisits()
    } catch (error) {
      toast.error(selectedVisit ? "Gagal memperbarui data" : "Gagal menambahkan kunjungan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !selectedVisit) return
    setActionLoading(true)
    try {
      await activeApi.deleteVisit(id, selectedVisit.id.toString())
      toast.success("Kunjungan berhasil dihapus")
      setIsDeleteDialogOpen(false)
      fetchVisits()
    } catch (error) {
      toast.error("Gagal menghapus kunjungan")
    } finally {
      setActionLoading(false)
      setSelectedVisit(null)
    }
  }

  // Infinite Scroll Handlers
  const handleDoctorScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 10 && doctorHasMore && !loadingDoctors) {
      const nextPage = doctorPage + 1
      setDoctorPage(nextPage)
      fetchDoctors(nextPage, doctorSearch, true)
    }
  }

  const handlePoliScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 10 && poliHasMore && !loadingPolis) {
      const nextPage = poliPage + 1
      setPoliPage(nextPage)
      fetchPolis(nextPage, poliSearch, true)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Hospital className="w-5 h-5 text-primary" />
          Kunjungan Unit ({moduleLabel})
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kunjungan
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Menarik data kunjungan...</p>
          </div>
        ) : visits.length > 0 ? (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>No. Registrasi</TableHead>
                  <TableHead>Poli / Unit</TableHead>
                  <TableHead>Dokter Pemeriksa</TableHead>
                  <TableHead className="text-center">Antrian</TableHead>
                  <TableHead>Waktu Check-in</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Badge variant="outline">{item.no_reg}</Badge></TableCell>
                    <TableCell className="font-bold">{item.poli.nama_poli}</TableCell>
                    <TableCell>
                      <Badge variant="info">
                        <User className="w-3 h-3 mr-1" />
                        {item.dokter.nama_dokter}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.no_antrian}</TableCell>
                    <TableCell className="text-sm">{item.checkin_time || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.is_closed === "Y" ? "destructive" : "success"}>
                        {item.is_closed === "Y" ? "Selesai" : "Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon" className="h-7 w-7" variant="outline"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon" className="h-7 w-7" variant="destructive"
                          onClick={() => {
                            setSelectedVisit(item);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground italic">Tidak ada riwayat kunjungan.</div>
        )}
      </CardContent>

      {/* MODAL CREATE / EDIT */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{selectedVisit ? "Ubah Dokter Pemeriksa" : `Tambah Kunjungan ${moduleLabel}`}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Field Poli (Hanya muncul saat Create) */}
            {!selectedVisit && (
              <div className="space-y-2">
                <Label>Poli / Unit</Label>
                <Popover open={openPoliCombo} onOpenChange={setOpenPoliCombo}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                      <span className="truncate">
                        {formData.id_poli
                          ? polis.find((p) => p.id.toString() === formData.id_poli)?.desk_poli
                          : "Pilih poli..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput placeholder="Cari poli..." onValueChange={setPoliSearch} />
                      <CommandList onScroll={handlePoliScroll} className="max-h-[200px]">
                        {polis.length === 0 && !loadingPolis && <CommandEmpty>Poli tidak ditemukan.</CommandEmpty>}
                        <CommandGroup>
                          {polis.map((p) => (
                            <CommandItem
                              key={p.id}
                              value={p.id.toString()}
                              onSelect={(v) => {
                                setFormData(prev => ({ ...prev, id_poli: v }))
                                setOpenPoliCombo(false)
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", formData.id_poli === p.id.toString() ? "opacity-100" : "opacity-0")} />
                              {p.desk_poli}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        {loadingPolis && <div className="p-2 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Field Dokter */}
            <div className="space-y-2">
              <Label>Dokter Pemeriksa</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    <span className="truncate">
                      {formData.id_dokter
                        ? doctors.find((d) => d.id.toString() === formData.id_dokter)?.nama_dokter || (selectedVisit?.dokter.nama_dokter)
                        : "Pilih dokter..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder="Cari dokter..." onValueChange={setDoctorSearch} />
                    <CommandList onScroll={handleDoctorScroll} className="max-h-[200px]">
                      {doctors.length === 0 && !loadingDoctors && <CommandEmpty>Dokter tidak ditemukan.</CommandEmpty>}
                      <CommandGroup>
                        {doctors.map((d) => (
                          <CommandItem
                            key={d.id}
                            value={d.id.toString()}
                            onSelect={(v) => {
                              setFormData(prev => ({ ...prev, id_dokter: v }))
                              setOpenDoctorCombo(false)
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", formData.id_dokter === d.id.toString() ? "opacity-100" : "opacity-0")} />
                            {d.nama_dokter}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {loadingDoctors && <div className="p-2 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedVisit ? "Simpan Perubahan" : "Proses Kunjungan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ALERT DIALOG DELETE */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Apakah Anda benar-benar yakin?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data kunjungan
              <strong> {selectedVisit?.no_reg}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus Kunjungan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}