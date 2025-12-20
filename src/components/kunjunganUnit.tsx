"use client"

import * as React from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, DoctorAPI, PoliAPI } from "@/lib/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  CheckCheck,
  User,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

export default function KunjunganUnit() {
  // id dari URL: /pendaftaran/:id
  const { id } = useParams<{ id: string }>()
  
  const [visits, setVisits] = React.useState<VisitItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState(false)

  // --- State Master Data ---
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
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [selectedVisit, setSelectedVisit] = React.useState<VisitItem | null>(null)
  
  const [formData, setFormData] = React.useState({
    id_dokter: "",
    id_poli: ""
  })

  const fetchVisits = React.useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await EmrIgdAPI.getVisit(id)
      setVisits(response.data || [])
    } catch (error) {
      toast.error("Gagal memuat data kunjungan")
    } finally {
      setLoading(false)
    }
  }, [id])

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
    if (isEditDialogOpen || isCreateDialogOpen) {
      setDoctorPage(1)
      fetchDoctors(1, doctorSearch, false)
    }
  }, [doctorSearch, isEditDialogOpen, isCreateDialogOpen])

  React.useEffect(() => {
    if (isCreateDialogOpen) {
      setPoliPage(1)
      fetchPolis(1, poliSearch, false)
    }
  }, [poliSearch, isCreateDialogOpen])

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

  React.useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  const handleCreateVisit = async () => {
    if (!id) return
    if (!formData.id_dokter || !formData.id_poli) {
      return toast.error("Silakan pilih poli dan dokter terlebih dahulu")
    }
    
    setActionLoading(true)
    try {
      // Mengirim ID dari URL dan payload
      await EmrIgdAPI.createVisit(id, {
        id_dokter: formData.id_dokter,
        id_poli: formData.id_poli
      })
      
      toast.success("Kunjungan baru berhasil ditambahkan")
      setIsCreateDialogOpen(false)
      setFormData({ id_dokter: "", id_poli: "" })
      fetchVisits()
    } catch (error) {
      toast.error("Gagal menambahkan kunjungan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateDoctor = async () => {
    if (!id || !selectedVisit || !formData.id_dokter) return
    setActionLoading(true)
    try {
      await EmrIgdAPI.updateVisit(id, selectedVisit.id.toString(), {
        id_dokter: formData.id_dokter,
      })
      toast.success("Dokter berhasil diperbarui")
      setIsEditDialogOpen(false)
      fetchVisits()
    } catch (error) {
      toast.error("Gagal memperbarui dokter")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteVisit = async (visitId: number) => {
    if (!id || !confirm("Apakah Anda yakin ingin menghapus kunjungan ini?")) return
    setActionLoading(true)
    try {
      await EmrIgdAPI.deleteVisit(id, visitId.toString())
      toast.success("Kunjungan berhasil dihapus")
      fetchVisits()
    } catch (error) {
      toast.error("Gagal menghapus kunjungan")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Hospital className="w-5 h-5 text-primary" />
          Kunjungan Unit
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => {
              setFormData({ id_dokter: "", id_poli: "" })
              setIsCreateDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kunjungan
          </Button>
          <Button variant="outline" size="sm" onClick={fetchVisits} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
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
                    <TableCell className="text-sm">{item.checkin_time}</TableCell>
                    <TableCell className="text-center">
                      {item.is_closed === "Y" ? (
                        <Badge variant="destructive">Tidak Aktif</Badge>
                      ) : (
                        <Badge variant="success">Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" className="h-7 w-7" 
                          variant="outline"
                          onClick={() => {
                            setSelectedVisit(item);
                            setFormData({ id_dokter: item.dokter.id.toString(), id_poli: item.poli.id.toString() });
                            setDoctorSearch("");
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="h-7 w-7" variant="success" onClick={() => handleDeleteVisit(item.id)}>
                          <Check className="h-4 w-4" />
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

      {/* MODAL CREATE */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Tambah Kunjungan Baru</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Poli / Unit</Label>
              <Popover open={openPoliCombo} onOpenChange={setOpenPoliCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.id_poli 
                      ? polis.find((p) => p.id.toString() === formData.id_poli)?.desk_poli 
                      : "Pilih poli..."}
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

            <div className="space-y-2">
              <Label>Dokter Pemeriksa</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.id_dokter 
                      ? doctors.find((d) => d.id.toString() === formData.id_dokter)?.nama_dokter 
                      : "Pilih dokter..."}
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
            <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>Batal</Button>
            <Button onClick={handleCreateVisit} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proses Kunjungan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EDIT (Ubah Dokter) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ubah Dokter Pemeriksa</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label>Pilih Dokter Baru</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {formData.id_dokter 
                      ? doctors.find((d) => d.id.toString() === formData.id_dokter)?.nama_dokter || selectedVisit?.dokter.nama_dokter
                      : "Pilih dokter..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder="Cari nama dokter..." onValueChange={setDoctorSearch} />
                    <CommandList onScroll={handleDoctorScroll} className="max-h-[250px] overflow-y-auto">
                      {doctors.length === 0 && !loadingDoctors && <CommandEmpty>Dokter tidak ditemukan.</CommandEmpty>}
                      <CommandGroup>
                        {doctors.map((doc) => (
                          <CommandItem
                            key={doc.id}
                            value={doc.id.toString()}
                            onSelect={(v) => {
                              setFormData(prev => ({ ...prev, id_dokter: v }))
                              setOpenDoctorCombo(false)
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", formData.id_dokter === doc.id.toString() ? "opacity-100" : "opacity-0")} />
                            {doc.nama_dokter}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {loadingDoctors && <div className="p-4 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button onClick={handleUpdateDoctor} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}