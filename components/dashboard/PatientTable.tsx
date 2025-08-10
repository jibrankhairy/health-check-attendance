"use client";

import React, { useRef } from "react";
import {
  PlusCircle,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  QrCode,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { McuProgressModal } from "@/components/McuProgressModal";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { usePatientTable } from "@/hooks/usePatientTable";
import { downloadQrCode } from "@/lib/patient-utils";

// Tipe data sudah sinkron dengan schema.prisma
export type PatientData = {
  id: number;
  patientId: string;
  fullName: string;
  email?: string;
  dob: string;
  age: number;
  gender: string;
  position: string;
  division: string;
  status: string;
  location: string;
  mcuPackage: any;
  qrCode: string;
  createdAt: string;
  mcuResults: { id: string }[];
};

type PatientTableProps = {
  companyId: string;
  companyName: string;
};

export const PatientTable = ({ companyId, companyName }: PatientTableProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    loading,
    isDialogOpen,
    editingPatient,
    deletingPatient,
    viewingMcuResultId,
    viewingPatientPackage,
    searchQuery,
    currentPage,
    rowsPerPage,
    selectedPatients,
    isDownloadingAllQrs,
    isImporting,
    setIsDialogOpen,
    setEditingPatient,
    setDeletingPatient,
    setViewingMcuResultId,
    setViewingPatientPackage,
    setSearchQuery,
    setCurrentPage,
    setRowsPerPage,
    handleDeleteConfirm,
    handleEditClick,
    handleViewProgressClick,
    handleFileChange,
    handleDownloadAllSelectedQrs,
    handleSelectPatient,
    handleSelectAllOnPage,
    fetchPatients,
    filteredPatients,
    currentRows,
    totalPages,
    areAllOnPageSelected,
  } = usePatientTable(companyId);

  return (
    <>
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, ID, atau posisi..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
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
              onClick={handleDownloadAllSelectedQrs}
              disabled={isDownloadingAllQrs || selectedPatients.size === 0}
              className="bg-[#01449D] hover:bg-[#01449D]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloadingAllQrs ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <QrCode className="mr-2 h-4 w-4" />
              )}
              Unduh QR{" "}
              {selectedPatients.size > 0 && `(${selectedPatients.size})`}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
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
                if (!open) setEditingPatient(null);
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
                {/* --- PERUBAHAN DI SINI --- */}
                <TableHead>Divisi</TableHead>
                <TableHead>Tgl. Registrasi</TableHead>
                <TableHead className="text-center">QR Code</TableHead>
                <TableHead className="w-[180px] text-center">Aksi</TableHead>
                <TableHead className="w-auto text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Checkbox
                      id="selectAll"
                      checked={areAllOnPageSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAllOnPage(checked as boolean)
                      }
                      aria-label="Pilih semua baris di halaman ini"
                    />
                    <label
                      htmlFor="selectAll"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Unduh QR
                    </label>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Memuat
                      data pasien...
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentRows.length > 0 ? (
                currentRows.map((patient, index) => (
                  <TableRow
                    key={patient.id}
                    data-state={selectedPatients.has(patient.id) && "selected"}
                  >
                    <TableCell className="font-medium text-center">
                      {currentPage * rowsPerPage - rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.patientId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {patient.fullName}
                    </TableCell>
                    {/* --- PERUBAHAN DI SINI --- */}
                    <TableCell>{patient.division}</TableCell>
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
                        <div className="flex items-center justify-center gap-1">
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
                                onClick={() => handleViewProgressClick(patient)}
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
                                className="hover:text-green-500"
                                onClick={() =>
                                  downloadQrCode(
                                    patient.qrCode,
                                    patient.fullName
                                  )
                                }
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unduh QR Code</p>
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
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedPatients.has(patient.id)}
                        onCheckedChange={(checked) =>
                          handleSelectPatient(patient.id, checked as boolean)
                        }
                        aria-label={`Pilih baris ${
                          currentPage * rowsPerPage - rowsPerPage + index + 1
                        }`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
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
            Menampilkan{" "}
            {filteredPatients.length > 0
              ? currentPage * rowsPerPage - rowsPerPage + 1
              : 0}{" "}
            sampai{" "}
            {Math.min(currentPage * rowsPerPage, filteredPatients.length)} dari{" "}
            {filteredPatients.length} pasien
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm">Baris per halaman:</p>
              <Select
                value={`${rowsPerPage}`}
                onValueChange={(value) => {
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
        packageItems={viewingPatientPackage as string[] | null}
        isOpen={!!viewingMcuResultId}
        onOpenChange={() => {
          setViewingMcuResultId(null);
          setViewingPatientPackage(null);
        }}
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
