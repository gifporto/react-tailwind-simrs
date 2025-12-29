"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { EmrIgdAPI, EmrRanapAPI, ServiceAPI, DoctorAPI } from "@/lib/api"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Stethoscope,
  Plus,
  Loader2,
  ChevronsUpDown,
  Check,
  Trash2,
  AlertTriangle,
  User,
} from "lucide-react"

/* =====================
   Configurations & Types
===================== */

const API_MAP = {
  EmrIgdAPI: { service: EmrIgdAPI, label: "IGD" },
  EmrRanapAPI: { service: EmrRanapAPI, label: "Rawat Inap" },
}

interface ServiceApiInterface {
  getService: (id: string) => Promise<any>;
  createService: (id: string, data: any) => Promise<any>;
  deleteService: (id: string, serviceId: string) => Promise<any>;
}

interface KunjunganLayananProps {
  api: keyof typeof API_MAP;
}

/* =====================
   Component
===================== */
export default function KunjunganLayanan({ api }: KunjunganLayananProps) {
  const activeApi = API_MAP[api].service as ServiceApiInterface;
  const moduleLabel = API_MAP[api].label;

  const { id } = useParams<{ id: string }>()

  // --- States ---
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [services, setServices] = useState<any[]>([])

  // --- UI States ---
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null)

  // --- Master Data States ---
  const [masterTarif, setMasterTarif] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [openTarifCombo, setOpenTarifCombo] = useState(false)
  const [openDoctorCombo, setOpenDoctorCombo] = useState(false)
  const [searchTarif, setSearchTarif] = useState("")

  // --- Form State ---
  const [formData, setFormData] = useState({
    id_tarif: "",
    id_dokter: "",
    qty: 1,
    notes: ""
  })

  // --- Fetch List Services ---
  const fetchServices = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await activeApi.getService(id)
      setServices(res.data || [])
    } catch (e) {
      toast.error(`Gagal memuat data layanan ${moduleLabel}`)
    } finally {
      setLoading(false)
    }
  }, [id, activeApi, moduleLabel])

  useEffect(() => { fetchServices() }, [fetchServices])

  // --- Fetch Master Data ---
  useEffect(() => {
    if (isCreateOpen) {
      const fetchMaster = async () => {
        try {
          const [resTarif, resDoc] = await Promise.all([
            ServiceAPI.getList(1, 50, searchTarif),
            DoctorAPI.getList(1, 50, "")
          ])
          setMasterTarif(resTarif.data || [])
          setDoctors(resDoc.data || [])
        } catch (e) { console.error(e) }
      }
      fetchMaster()
    }
  }, [isCreateOpen, searchTarif])

  // --- Handlers ---
  const handleCreate = async () => {
    if (!id) return
    if (!formData.id_tarif || !formData.id_dokter) {
      return toast.error("Lengkapi data tarif dan dokter")
    }

    setActionLoading(true)
    try {
      const payload = {
        id_tarif: parseInt(formData.id_tarif),
        id_dokter: parseInt(formData.id_dokter),
        qty: formData.qty,
        notes: formData.notes
      }
      await activeApi.createService(id, payload)
      toast.success("Layanan berhasil ditambahkan")
      setIsCreateOpen(false)
      setFormData({ id_tarif: "", id_dokter: "", qty: 1, notes: "" })
      fetchServices()
    } catch (e) {
      toast.error("Gagal menambah layanan")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !selectedIdToDelete) return
    setActionLoading(true)
    try {
      await activeApi.deleteService(id, selectedIdToDelete)
      toast.success("Layanan berhasil dihapus")
      fetchServices()
      setIsDeleteAlertOpen(false)
    } catch (e) {
      toast.error("Gagal menghapus layanan")
    } finally {
      setActionLoading(false)
      setSelectedIdToDelete(null)
    }
  }

  const rupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val)

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Stethoscope className="w-5 h-5 text-primary" />
          Tindakan ({moduleLabel})
        </CardTitle>
        <Button size="sm" onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Tindakan
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
        ) : services.length > 0 ? (
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nama Layanan</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.nama_layanan}</div>
                      {item.notes && <p className="text-xs text-muted-foreground italic">Note: {item.notes}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        <User className="w-3 h-3 mr-1" />
                        {item.dokter.nama}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.qty}</TableCell>
                    <TableCell className="text-right">{rupiah(item.harga_s)}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      {rupiah(item.harga_s * item.qty)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.is_closed === "Y" ? (
                        <Badge variant="success">Selesai</Badge>
                      ) : (
                        <Badge variant="secondary">Proses</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="icon" className="h-7 w-7"
                        onClick={() => {
                          setSelectedIdToDelete(item.id.toString())
                          setIsDeleteAlertOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <Stethoscope className="mx-auto mb-2 h-10 w-10 opacity-20" />
            <p>Belum ada layanan {moduleLabel} yang ditambahkan.</p>
          </div>
        )}
      </CardContent>

      {/* --- DIALOG TAMBAH LAYANAN --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Tambah Layanan {moduleLabel}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Pilih Tarif */}
            <div className="space-y-2">
              <Label>Pilih Item Layanan / Tarif</Label>
              <Popover open={openTarifCombo} onOpenChange={setOpenTarifCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-auto py-2 text-left">
                    <span className="truncate">
                        {formData.id_tarif ? masterTarif.find(t => t.id.toString() === formData.id_tarif)?.nama : "Cari layanan..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Ketik nama layanan..." onValueChange={setSearchTarif} />
                    <CommandList>
                      <CommandEmpty>Layanan tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {masterTarif.map((t) => (
                          <CommandItem
                            key={t.id}
                            onSelect={() => {
                              setFormData(f => ({ ...f, id_tarif: t.id.toString() }))
                              setOpenTarifCombo(false)
                            }}
                          >
                            <div className="flex flex-col flex-1">
                              <div className="flex justify-between font-medium">
                                <span>{t.nama}</span>
                                <span className="text-emerald-600">{rupiah(t.nominal)}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground uppercase">{t.kelompok_tarif} | {t.kelas_tarif}</span>
                            </div>
                            <Check className={cn("ml-2 h-4 w-4", formData.id_tarif === t.id.toString() ? "opacity-100" : "opacity-0")} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Pilih Dokter */}
            <div className="space-y-2">
              <Label>Dokter Pelaksana</Label>
              <Popover open={openDoctorCombo} onOpenChange={setOpenDoctorCombo}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.id_dokter ? doctors.find(d => d.id.toString() === formData.id_dokter)?.nama_dokter : "Pilih dokter..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari dokter..." />
                    <CommandList>
                      <CommandGroup>
                        {doctors.map((d) => (
                          <CommandItem
                            key={d.id}
                            onSelect={() => {
                              setFormData(f => ({ ...f, id_dokter: d.id.toString() }))
                              setOpenDoctorCombo(false)
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", formData.id_dokter === d.id.toString() ? "opacity-100" : "opacity-0")} />
                            {d.nama_dokter}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 space-y-2">
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.qty}
                  onChange={e => setFormData(f => ({ ...f, qty: parseInt(e.target.value) }))}
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label>Catatan (Optional)</Label>
                <Input
                  placeholder="Contoh: Pasien minta kelas VIP"
                  value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan Layanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- ALERT DELETE --- */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Hapus Layanan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus layanan ini? Biaya yang sudah tercatat akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}