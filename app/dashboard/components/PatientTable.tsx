"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PatientRegistrationForm } from "./PatientRegistrationForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { McuProgressModal } from "@/components/McuProgressModal";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { toast } from "sonner";

type PatientData = {
  id: number;
  patientId: string;
  fullName: string;
  email?: string;
  dob: string;
  age: number;
  gender: "LAKI-LAKI" | "PEREMPUAN";
  department: string;
  mcuPackage: string[];
  qrCode: string;
  createdAt: string;
  mcuResults: {
    id: string;
  }[];
};

type PatientTableProps = {
  companyId: string;
  companyName: string;
};

export const PatientTable = ({ companyId, companyName }: PatientTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewingMcuResultId, setViewingMcuResultId] = useState<string | null>(
    null
  );
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(
    null
  );
  const [deletingPatient, setDeletingPatient] = useState<PatientData | null>(
    null
  );

  const fetchPatients = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/patients?companyId=${companyId}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Gagal memuat data pasien.");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleEditClick = async (patientId: number) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) throw new Error("Gagal mengambil data pasien.");
      const data = await response.json();
      setEditingPatient(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pasien untuk diedit.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPatient) return;

    const promise = fetch(`/api/patients/${deletingPatient.id}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus pasien.");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: `Menghapus data ${deletingPatient.fullName}...`,
      success: () => {
        setDeletingPatient(null);
        fetchPatients();
        return `Pasien ${deletingPatient.fullName} berhasil dihapus.`;
      },
      error: (err) => err.message,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils
          .sheet_to_json(worksheet, {
            header: [
              "NIK",
              "Nama Pegawai",
              "Email",
              "Tanggal Lahir",
              "Bagian / Departemen",
              "Jenis Kelamin",
            ],
            raw: false,
            dateNF: "yyyy-mm-dd",
          })
          .slice(1);

        const newPatients = json.map((row: any, index: number) => {
          if (!row["NIK"] || !row["Nama Pegawai"] || !row["Tanggal Lahir"]) {
            throw new Error(
              `Data tidak lengkap di baris ${
                index + 2
              }. Pastikan NIK, Nama, dan Tanggal Lahir terisi.`
            );
          }

          return {
            nik: String(row["NIK"]),
            fullName: String(row["Nama Pegawai"]),
            email: row["Email"] || null,
            dob: row["Tanggal Lahir"],
            department: String(row["Bagian / Departemen"] || "N/A"),
            gender: String(row["Jenis Kelamin"]),
          };
        });

        const response = await fetch("/api/patients/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patients: newPatients, companyId }),
        });

        const resultData = await response.json();
        if (!response.ok) {
          throw new Error(resultData.message || "Gagal mengimpor data pasien.");
        }

        toast.success(resultData.message);
        await fetchPatients();
      } catch (error) {
        console.error("Error importing patients:", error);
        toast.error(
          `Error: ${
            error instanceof Error ? error.message : "Terjadi kesalahan"
          }`
        );
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPatients.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

  return (
    <>
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama, ID, atau departemen..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls"
            />
            <Button
              variant="outline"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isImporting ? "Mengimpor..." : "Import Excel"}
            </Button>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingPatient(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#01449D] hover:bg-[#01449D]/90 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Pasien
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingPatient
                      ? `Edit Data Pasien - ${editingPatient.fullName}`
                      : `Form Pendaftaran Pasien - ${companyName}`}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPatient
                      ? "Ubah data pasien di bawah ini."
                      : `Pasien ini akan terdaftar di bawah perusahaan ${companyName}.`}
                  </DialogDescription>
                </DialogHeader>
                <PatientRegistrationForm
                  setOpen={setIsDialogOpen}
                  companyId={companyId}
                  onPatientAdded={() => {
                    fetchPatients();
                    setEditingPatient(null);
                  }}
                  patientToEdit={editingPatient}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">No.</TableHead>
                <TableHead>ID Pasien</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Tgl. Registrasi</TableHead>
                <TableHead className="text-center">QR Code</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Memuat data pasien...
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentRows.length > 0 ? (
                currentRows.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium text-center">
                      {indexOfFirstRow + index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.patientId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {patient.fullName}
                    </TableCell>
                    <TableCell>{patient.department}</TableCell>
                    <TableCell>
                      {format(new Date(patient.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${patient.qrCode}`}
                        alt={`QR Code for ${patient.fullName}`}
                        className="rounded-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex items-center justify-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-blue-500"
                                disabled={
                                  !patient.mcuResults ||
                                  patient.mcuResults.length === 0
                                }
                                onClick={() => {
                                  if (
                                    patient.mcuResults &&
                                    patient.mcuResults[0]
                                  ) {
                                    setViewingMcuResultId(
                                      patient.mcuResults[0].id
                                    );
                                  }
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Lihat Progres MCU</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-yellow-500"
                                onClick={() => handleEditClick(patient.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Pasien</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-500"
                                onClick={() => setDeletingPatient(patient)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Hapus Pasien</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchQuery
                      ? "Pasien tidak ditemukan."
                      : "Belum ada data pasien untuk perusahaan ini."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Menampilkan {filteredPatients.length > 0 ? indexOfFirstRow + 1 : 0}{" "}
            sampai {Math.min(indexOfLastRow, filteredPatients.length)} dari{" "}
            {filteredPatients.length} pasien
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm">Baris per halaman:</p>
              <Select
                value={`${rowsPerPage}`}
                onValueChange={(value: string) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={rowsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm font-medium">
              Halaman {currentPage} dari {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      </div>

      <McuProgressModal
        mcuResultId={viewingMcuResultId}
        isOpen={!!viewingMcuResultId}
        onOpenChange={() => setViewingMcuResultId(null)}
      />

      <ConfirmationDialog
        isOpen={!!deletingPatient}
        onOpenChange={() => setDeletingPatient(null)}
        onConfirm={handleDeleteConfirm}
        title={`Anda yakin ingin menghapus pasien ini?`}
        description={`Aksi ini tidak dapat dibatalkan. Semua data MCU untuk pasien "${deletingPatient?.fullName}" juga akan dihapus secara permanen.`}
      />
    </>
  );
};
