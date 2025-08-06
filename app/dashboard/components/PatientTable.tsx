"use client";

import React, { useState } from "react";
import { Filter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Tipe data dan data dummy bisa kita biarkan untuk sekarang
type PatientStatus = "Approved" | "Pending" | "Canceled";
type DummyPatient = {
  id: string;
  name: string;
  idNumber: string;
  registrationDate: string;
  mcuPackage: string;
  qrCode: string;
  status: PatientStatus;
};

const dummyPatients: DummyPatient[] = [
  {
    id: "1",
    name: "Younes (Contoh Pasien)",
    idNumber: "MCU-07",
    registrationDate: "2025-09-11",
    mcuPackage: "Paket Lengkap",
    qrCode: "qr-younes",
    status: "Approved",
  },
];

const StatusBadge = ({ status }: { status: PatientStatus }) => {
  const statusStyles: { [key in PatientStatus]: string } = {
    Approved: "bg-[#01449D] hover:bg-[#01449D]/90 text-white",
    Pending: "bg-yellow-500 hover:bg-yellow-500/90 text-white",
    Canceled: "bg-red-600 hover:bg-red-600/90 text-white",
  };
  return <Badge className={statusStyles[status]}>{status}</Badge>;
};

// --- PERUBAHAN 1: Tambahkan props untuk menerima data perusahaan ---
type PatientTableProps = {
  companyId: string;
  companyName: string;
};

export const PatientTable = ({ companyId, companyName }: PatientTableProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Nantinya, kamu akan fetch data pasien berdasarkan companyId
  // useEffect(() => { fetch(`/api/patients?companyId=${companyId}`)... }, [companyId]);

  return (
    <div className="flex-1 p-8">
      {/* Toaster dipindahkan ke page.tsx agar tidak duplikat */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Cari pasien..." className="pl-9" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#01449D] hover:bg-[#01449D]/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              {/* --- PERUBAHAN 2: Judul tombol dinamis --- */}
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              {/* --- PERUBAHAN 3: Judul dialog dinamis --- */}
              <DialogTitle className="text-2xl">
                Form Pendaftaran Pasien - {companyName}
              </DialogTitle>
              <DialogDescription>
                Pasien ini akan terdaftar di bawah perusahaan {companyName}.
              </DialogDescription>
            </DialogHeader>
            {/* --- PERUBAHAN 4: Kirim companyId ke form --- */}
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyPatients.map((patient, index) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">
          Showing 1 to {dummyPatients.length} of {dummyPatients.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
