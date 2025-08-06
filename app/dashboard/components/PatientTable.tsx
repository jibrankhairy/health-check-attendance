"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Eye, Pencil, Trash2 } from "lucide-react";
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
} from "@/components/ui/tooltip"; // Import Tooltip

// Tipe data ini akan kita gunakan saat fetch data asli
type PatientData = {
  id: string;
  name: string;
  idNumber: string;
  registrationDate: string;
  mcuPackage: string;
  qrCode: string;
  status: "Approved" | "Pending" | "Canceled";
};

const StatusBadge = ({
  status,
}: {
  status: "Approved" | "Pending" | "Canceled";
}) => {
  const statusStyles: { [key in "Approved" | "Pending" | "Canceled"]: string } =
    {
      Approved: "bg-[#01449D] hover:bg-[#01449D]/90 text-white",
      Pending: "bg-yellow-500 hover:bg-yellow-500/90 text-white",
      Canceled: "bg-red-600 hover:bg-red-600/90 text-white",
    };
  return <Badge className={statusStyles[status]}>{status}</Badge>;
};

type PatientTableProps = {
  companyId: string;
  companyName: string;
};

export const PatientTable = ({ companyId, companyName }: PatientTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // --- PERUBAHAN 2: State patients dimulai dengan array kosong ---
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // --- PERUBAHAN 3: Hapus data dummy, siapkan untuk fetch API ---
    setLoading(true);
    // Di sini nanti kamu akan fetch data pasien dari API berdasarkan companyId
    // const response = await fetch(`/api/patients?companyId=${companyId}`);
    // const data = await response.json();
    // setPatients(data);
    setTimeout(() => {
      // Simulasi loading
      setPatients([]); // Mulai dengan tabel kosong
      setLoading(false);
    }, 500);
  }, [companyId]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPatients.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

  if (loading) {
    return <div className="p-8">Memuat data pasien untuk {companyName}...</div>;
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama pasien..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#01449D] hover:bg-[#01449D]/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Form Pendaftaran Pasien - {companyName}
              </DialogTitle>
              <DialogDescription>
                Pasien ini akan terdaftar di bawah perusahaan {companyName}.
              </DialogDescription>
            </DialogHeader>
            <PatientRegistrationForm
              setOpen={setIsDialogOpen}
              companyId={companyId}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No.</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>ID Pasien</TableHead>
              <TableHead>Tgl. Registrasi</TableHead>
              <TableHead>Paket MCU</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((patient, index) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium text-center">
                    {indexOfFirstRow + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.idNumber}</TableCell>
                  <TableCell>{patient.registrationDate}</TableCell>
                  <TableCell>{patient.mcuPackage}</TableCell>
                  <TableCell>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${patient.qrCode}`}
                      alt="QR Code"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={patient.status} />
                  </TableCell>
                  {/* --- PERUBAHAN 4: Ganti DropdownMenu dengan ikon berjejer --- */}
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-blue-500"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Lihat Detail</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-yellow-500"
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
          Menampilkan {Math.min(indexOfFirstRow + 1, filteredPatients.length)}{" "}
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
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
