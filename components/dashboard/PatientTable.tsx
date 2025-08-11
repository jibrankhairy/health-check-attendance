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
  Mail,
  MoreVertical,
  Briefcase,
  Calendar,
  Printer,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export type PatientData = {
  id: number;
  patientId: string;
  nik: string;
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
  mcuResults: { id: string; fileUrl?: string }[];
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
    fetchPatients,
    filteredPatients,
    currentRows,
    totalPages,
    isImportConfirmOpen,
    setIsImportConfirmOpen,
    parsedPatients,
    handleConfirmImport,
    isSendingEmail,
    handleSendQrEmail,
    setParsedPatients,
  } = usePatientTable(companyId);

  const handlePrintQr = (patient: PatientData) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              @page { margin: 0; size: 58mm auto; }
              body {
                font-family: 'Arial', sans-serif;
                font-size: 10pt;
                text-align: center;
                margin: 5mm;
                padding: 0;
                width: 48mm;
              }
              .qr-code { width: 150px; height: 150px; margin: 10px auto; }
              .info { text-align: left; margin-top: 10px; word-wrap: break-word; }
              .info p { margin: 2px 0; font-weight: bold; }
              .info span { font-weight: normal; }
            </style>
          </head>
          <body>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${patient.qrCode}" alt="QR Code" class="qr-code" />
            <div class="info">
              <p>Nama: <span>${patient.fullName}</span></p>
              <p>ID: <span>${patient.patientId}</span></p>
              <p>NIK: <span>${patient.nik}</span></p>
            </div>
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const renderPatientActions = (patient: PatientData) => (
    <>
      <DropdownMenuItem
        onClick={() => handleViewProgressClick(patient)}
        disabled={!patient.mcuResults || patient.mcuResults.length === 0}
      >
        <Eye className="mr-2 h-4 w-4" />
        <span>Lihat Progres</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleEditClick(patient.id)}>
        <Pencil className="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleSendQrEmail(patient)}
        disabled={!patient.email || isSendingEmail === patient.id}
      >
        {isSendingEmail === patient.id ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        <span>Kirim Email</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handlePrintQr(patient)}>
        <Printer className="mr-2 h-4 w-4" />
        <span>Print QR</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 focus:text-red-600 focus:bg-red-50"
        onClick={() => setDeletingPatient(patient)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Hapus</span>
      </DropdownMenuItem>
    </>
  );

  return (
    <>
      <div className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, ID, atau posisi..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="md:w-auto md:px-4"
                  >
                    {isImporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline ml-2">
                      {isImporting ? "Memproses..." : "Import"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="md:hidden">
                  <p>Import Excel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setEditingPatient(null);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="bg-[#01449D] hover:bg-[#01449D]/90 text-white md:w-auto md:px-4"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">Tambah Pasien</span>
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
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">No.</TableHead>
                  <TableHead>ID Pasien</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Tgl. Registrasi</TableHead>
                  <TableHead className="text-center">QR Code</TableHead>
                  <TableHead className="w-[200px] text-center">Aksi</TableHead>
                  <TableHead className="text-center">Hasil</TableHead>
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
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium text-center">
                        {currentPage * rowsPerPage - rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{patient.patientId}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {patient.fullName}
                      </TableCell>
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
                                  onClick={() =>
                                    handleViewProgressClick(patient)
                                  }
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
                                  className="hover:text-sky-500"
                                  disabled={
                                    !patient.email ||
                                    isSendingEmail === patient.id
                                  }
                                  onClick={() => handleSendQrEmail(patient)}
                                >
                                  {isSendingEmail === patient.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Mail className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Kirim QR ke Email</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:text-indigo-500"
                                  onClick={() => handlePrintQr(patient)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Print QR Code</p>
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={
                                  !patient.mcuResults ||
                                  patient.mcuResults.length === 0 ||
                                  !patient.mcuResults[0].fileUrl
                                }
                                onClick={() =>
                                  window.open(
                                    patient.mcuResults[0]?.fileUrl,
                                    "_blank"
                                  )
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {!patient.mcuResults ||
                                patient.mcuResults.length === 0 ||
                                !patient.mcuResults[0].fileUrl
                                  ? "Hasil belum tersedia"
                                  : "Unduh Hasil MCU"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchQuery
                        ? "Pasien tidak ditemukan."
                        : "Belum ada data pasien."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Memuat...
              </div>
            ) : currentRows.length > 0 ? (
              currentRows.map((patient) => (
                <Card key={patient.id}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {patient.fullName}
                      </CardTitle>
                      <Badge variant="secondary">{patient.patientId}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {renderPatientActions(patient)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2 pt-2">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>{patient.division}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        Reg:{" "}
                        {format(new Date(patient.createdAt), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled={
                          !patient.mcuResults ||
                          patient.mcuResults.length === 0 ||
                          !patient.mcuResults[0].fileUrl
                        }
                        onClick={() =>
                          window.open(patient.mcuResults[0]?.fileUrl, "_blank")
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Unduh Hasil MCU
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                {searchQuery
                  ? "Pasien tidak ditemukan."
                  : "Belum ada data pasien."}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-600 order-last md:order-first">
            Menampilkan{" "}
            {filteredPatients.length > 0
              ? currentPage * rowsPerPage - rowsPerPage + 1
              : 0}{" "}
            - {Math.min(currentPage * rowsPerPage, filteredPatients.length)}{" "}
            dari {filteredPatients.length} pasien
          </div>
          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm hidden sm:block">Baris:</p>
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
              Hal {currentPage} dari {totalPages || 1}
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

      <AlertDialog
        open={isImportConfirmOpen}
        onOpenChange={setIsImportConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Impor Data</AlertDialogTitle>
            <AlertDialogDescription>
              Ditemukan <strong>{parsedPatients.length} data pasien</strong> di
              dalam file Excel. <br /> Pilih bagaimana Anda ingin menyimpan data
              ini:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setParsedPatients([])}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmImport(false)}>
              Simpan Saja
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => handleConfirmImport(true)}
              className="bg-[#01449D] hover:bg-[#01449D]/90"
            >
              Simpan & Kirim Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
