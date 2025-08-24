"use client";

import React, { useRef, useState } from "react";
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
  Camera,
  IdCard,
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
import { CameraCaptureModal } from "./CameraCaptureModal";
import { toast } from "sonner";

export type PatientData = {
  id: number;
  patientId: string;
  nik: string;
  fullName: string;
  photoUrl?: string | null;
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
  lastProgress?: string | null;
  progress?: number;
  mcuResults: {
    id: string;
    fileUrl?: string;
    progress: {
      id: string;
      status: "PENDING" | "COMPLETED" | "SKIPPED";
    }[];
  }[];
};

type PatientTableProps = {
  companyId: string;
  companyName: string;
};

export const PatientTable = ({ companyId, companyName }: PatientTableProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [takingPhotoFor, setTakingPhotoFor] = useState<PatientData | null>(
    null
  );

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
    isEditLoading,
  } = usePatientTable(companyId);

  const handlePrintQr = (patient: PatientData) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            @page { size: 40mm 30mm; margin: 0; }
            html, body {
              width: 40mm;
              height: 30mm;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 6pt;
            }
            .label {
              box-sizing: border-box;
              width: 40mm;
              height: 30mm;
              padding: 1.5mm 2mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              overflow: hidden;
            }
            .qr {
              width: 18mm;
              height: 18mm;
              display: block;
              margin: 0 auto 1mm;
              image-rendering: pixelated;
              image-rendering: crisp-edges;
            }
            .info {
              width: 100%;
              text-align: center;
              line-height: 1.1;
            }
            .info p {
              margin: 0 0 0.6mm 0;
              font-weight: 600;
            }
            .info p:last-child { margin-bottom: 0; }
            .info span { font-weight: 400; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <img
              class="qr"
              src="${patient.qrCode}"
              alt="QR Code"
            />
            <div class="info">
              <p>Nama: <span>${patient.fullName}</span></p>
              <p>ID: <span>${patient.patientId}</span></p>
              <p>NIK: <span>${patient.nik}</span></p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
    }
  };

  // const buildKartuKontrolItems = (patient: PatientData): string[] => {
  //   const baseItems = [
  //     "POS PEMERIKSAAN FISIK",
  //     "POS PEMERIKSAAN LAB",
  //     "POS PEMERIKSAAN URIN",
  //     "POS PEMERIKSAAN RADIOLOGI",
  //   ];

  //   const pkgArr: string[] = Array.isArray(patient.mcuPackage)
  //     ? (patient.mcuPackage as string[])
  //     : typeof patient.mcuPackage === "string"
  //     ? (patient.mcuPackage as string)
  //         .split(",")
  //         .map((s) => s.trim())
  //         .filter(Boolean)
  //     : [];

  //   const norm = pkgArr.map((s) => s.toLowerCase());

  //   const addIf = (cond: boolean, label: string) => {
  //     if (cond && !baseItems.includes(label)) baseItems.push(label);
  //   };

  //   addIf(
  //     norm.some((s) => s.includes("ekg")),
  //     "POS PEMERIKSAAN EKG"
  //   );
  //   addIf(
  //     norm.some((s) => s.includes("audiometri") || s.includes("audiometry")),
  //     "POS PEMERIKSAAN AUDIOMETRI"
  //   );
  //   addIf(
  //     norm.some((s) => s.includes("spirometri") || s.includes("spirometry")),
  //     "POS PEMERIKSAAN SPIROMETRI"
  //   );
  //   addIf(
  //     norm.some((s) => s.includes("treadmill")),
  //     "POS PEMERIKSAAN TREADMILL"
  //   );

  //   return baseItems;
  // };

  const handlePrintKartuKontrol = (patient: PatientData) => {
    if (!patient.qrCode) {
      toast.info("QR pasien belum tersedia.");
      return;
    }

    const company = companyName || "KARTU KONTROL";
    const fullName = (patient.fullName || "").toUpperCase();
    const patientId = patient.patientId || "-";
    const location = (patient.location || "").toUpperCase();

    const pkg = Array.isArray(patient.mcuPackage)
      ? (patient.mcuPackage as string[])
      : typeof patient.mcuPackage === "string"
      ? (patient.mcuPackage as string).split(",").map((s: string) => s.trim())
      : [];
    const packageText = pkg.join(", ").toUpperCase();

    const baseItems = [
      "POS PEMERIKSAAN FISIK",
      "POS PEMERIKSAAN LAB",
      "POS PEMERIKSAAN URIN",
      "POS PEMERIKSAAN RADIOLOGI",
    ];
    const norm = pkg.map((s) => s.toLowerCase());
    const addIf = (cond: boolean, label: string) => {
      if (cond && !baseItems.includes(label)) baseItems.push(label);
    };
    addIf(
      norm.some((s) => s.includes("ekg")),
      "POS PEMERIKSAAN EKG"
    );
    addIf(
      norm.some((s) => s.includes("audiometri") || s.includes("audiometry")),
      "POS PEMERIKSAAN AUDIOMETRY"
    );
    addIf(
      norm.some((s) => s.includes("spirometri") || s.includes("spirometry")),
      "POS PEMERIKSAAN SPIROMETRY"
    );
    addIf(
      norm.some((s) => s.includes("treadmill")),
      "POS PEMERIKSAAN TREADMILL"
    );
    addIf(
      norm.some((s) => s.includes("refraktometri")),
      "POS PEMERIKSAAN REFRAKTOMETRI"
    );

    const items = baseItems;

    const esc = (s: unknown) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const printWin = window.open("", "_blank");
    if (!printWin) {
      toast.error(
        "Popup diblokir. Izinkan pop-up untuk mencetak kartu kontrol."
      );
      return;
    }

    printWin.document.write(`
    <html>
      <head>
        <title>Print Kartu Kontrol</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A5 landscape; margin: 0; }
          html, body { height: 100%; margin: 0; padding: 0; }
          body {
            font-family: Arial, sans-serif;
            font-size: 9.5pt;
            color: #333;
          }
          .page {
            box-sizing: border-box;
            padding: 8mm 10mm;
            width: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            gap: 6mm;
          }
          .header {
            text-align: center;
            font-weight: 700;
            font-size: 12pt;
          }
          .top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 5mm;
            border: 1px solid #000;
            padding: 4.5mm;
          }
          .ident { flex: 1 1 auto; }
          .qrwrap {
            flex: 0 0 auto;
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            width: 36mm;
          }
          .qr {
            width: 30mm;
            height: 30mm;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
          }
          .info-row { display: flex; margin-bottom: 2mm; }
          .label { width: 33%; }
          .colon { width: 5%; text-align: center; }
          .value { width: 62%; font-weight: 700; }

          /* GRID POS: 4 kolom, item ringkas */
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 3mm 5mm;
          }
          .pos-card {
            border: 1px solid #000;
            padding: 2.5mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5mm;
            text-align: center;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .pos-title {
            font-weight: 600;
            font-size: 8pt; /* kecil & di atas kotak */
            line-height: 1.15;
            min-height: 10mm;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Tidak ada kotak di dalam kotak — hanya ruang kosong buat tanda tangan */
          .sign-space {
            height: 8mm; /* area untuk paraf/tanda tangan, tanpa border */
          }
          .name-line {
            width: 22mm;
            height: 0;
            border-bottom: 0.5px solid #000;
            margin-top: 1mm;
          }
          .hint {
            font-size: 7pt;
            line-height: 1;
            color: #444;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="title">KARTU KONTROL PESERTA MCU</div>
            <div class="company">${esc(company)}</div>
          </div>

          <div class="top">
            <div class="ident">
              <div class="info-row">
                <div class="label">NAMA</div>
                <div class="colon">:</div>
                <div class="value">${esc(fullName)}</div>
              </div>
              <div class="info-row">
                <div class="label">KODE MCU</div>
                <div class="colon">:</div>
                <div class="value">${esc(patientId)}</div>
              </div>
              <div class="info-row">
                <div class="label">LOKASI</div>
                <div class="colon">:</div>
                <div class="value">${esc(location)}</div>
              </div>
              <div class="info-row">
                <div class="label">JENIS PEMERIKSAAN</div>
                <div class="colon">:</div>
                <div class="value">${esc(packageText)}</div>
              </div>
            </div>
            <div class="qrwrap">
              <img class="qr" src="${esc(patient.qrCode)}" alt="QR" />
            </div>
          </div>

          <div class="grid">
            ${items
              .map(
                (it) => `
              <div class="pos-card">
                <div class="pos-title">${esc(it)}</div>
                <div class="sign-space"></div>
                <div class="name-line"></div>
                <div class="hint">Nama Petugas</div>
              </div>`
              )
              .join("")}
          </div>
        </div>

        <script>
          function doPrint() {
            try { window.focus(); window.print(); } catch(e) { window.print(); }
          }
          window.addEventListener('load', () => setTimeout(doPrint, 200));
          window.addEventListener('afterprint', () => window.close());
        <\/script>
      </body>
    </html>
  `);

    printWin.document.close();
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

      <DropdownMenuItem
        onClick={() => handlePrintKartuKontrol(patient)}
        disabled={!patient.mcuResults || patient.mcuResults.length === 0}
      >
        <IdCard className="mr-2 h-4 w-4" />
        <span>Print Kartu Kontrol</span>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => handleEditClick(patient.id)}>
        <Pencil className="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTakingPhotoFor(patient)}>
        <Camera className="mr-2 h-4 w-4" />
        <span>Ambil Foto</span>
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
                    {isEditLoading
                      ? "Memuat Data Pasien..."
                      : editingPatient
                      ? `Edit Data Pasien - ${editingPatient.fullName}`
                      : `Form Pendaftaran Pasien - ${companyName}`}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditLoading
                      ? "Mohon tunggu sebentar."
                      : editingPatient
                      ? "Ubah data pasien di bawah ini."
                      : `Pasien ini akan terdaftar di bawah perusahaan ${companyName}.`}
                  </DialogDescription>
                </DialogHeader>
                {isEditLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="animate-spin mr-2 h-6 w-6" /> Memuat
                    data...
                  </div>
                ) : (
                  <PatientRegistrationForm
                    setOpen={setIsDialogOpen}
                    companyId={companyId}
                    onPatientAdded={() => {
                      fetchPatients();
                      setEditingPatient(null);
                    }}
                    patientToEdit={editingPatient}
                  />
                )}
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
                  <TableHead>NIK</TableHead>
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
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Memuat
                        data...
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
                      <TableCell>
                        <span className="font-mono">{patient.nik}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {patient.fullName}
                      </TableCell>
                      <TableCell>{patient.division}</TableCell>
                      <TableCell>
                        {format(new Date(patient.createdAt), "dd MMM yyyy")}
                      </TableCell>

                      <TableCell className="flex justify-center">
                        {patient.qrCode ? (
                          <img
                            src={patient.qrCode}
                            alt={`QR Code for ${patient.fullName}`}
                            className="rounded-sm"
                            style={{ width: "40px", height: "40px" }}
                          />
                        ) : (
                          "N/A"
                        )}
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
                                  className="hover:text-purple-500"
                                  onClick={() => setTakingPhotoFor(patient)}
                                >
                                  <Camera className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ambil Foto Pasien</p>
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

                            {/* Tombol Kartu Kontrol (client-side print) */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:text-green-600"
                                  disabled={
                                    !patient.mcuResults ||
                                    patient.mcuResults.length === 0
                                  }
                                  onClick={() =>
                                    handlePrintKartuKontrol(patient)
                                  }
                                >
                                  <IdCard className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Print Kartu Kontrol</p>
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
                    <TableCell colSpan={9} className="h-24 text-center">
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
                      <IdCard className="mr-2 h-4 w-4" />
                      <span>NIK: {patient.nik}</span>
                    </div>
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
      <CameraCaptureModal
        isOpen={!!takingPhotoFor}
        onClose={() => setTakingPhotoFor(null)}
        patient={takingPhotoFor}
        onUploadSuccess={() => {
          fetchPatients();
        }}
      />
    </>
  );
};
