"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, FileText, FilePenLine } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

type ReportData = {
  id: string;
  updatedAt: string;
  status: string; // <-- Field status ditambahkan di sini
  patient: {
    id: number;
    patientId: string;
    fullName: string;
    company: {
      name: string;
    };
  };
};

export const ReportTable = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mcu/reports");
      if (!response.ok) throw new Error("Gagal memuat data laporan.");
      const data = await response.json();
      setReports(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = reports.filter(
    (report) =>
      report.patient.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.patient.patientId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.patient.company.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  // --- PERBAIKAN: Buat fungsi untuk merender isi tabel ---
  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            <div className="flex justify-center items-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Memuat laporan...
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (currentRows.length > 0) {
      return currentRows.map((report, index) => (
        <TableRow key={report.id}>
          <TableCell className="font-medium text-center">
            {indexOfFirstRow + index + 1}
          </TableCell>
          <TableCell>
            <Badge variant="secondary">{report.patient.patientId}</Badge>
          </TableCell>
          <TableCell className="font-semibold">
            {report.patient.fullName}
          </TableCell>
          <TableCell>{report.patient.company.name}</TableCell>
          <TableCell>
            {format(new Date(report.updatedAt), "dd MMM yyyy, HH:mm")}
          </TableCell>
          <TableCell>
            {report.status === "COMPLETED" ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Selesai
              </Badge>
            ) : (
              <Badge variant="destructive">Menunggu Input</Badge>
            )}
          </TableCell>
          <TableCell className="text-center">
            {report.status === "COMPLETED" ? (
              <Link href={`/dashboard/reports/view/${report.id}`} passHref>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Lihat Laporan
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/reports/${report.id}`} passHref>
                <Button variant="default" size="sm">
                  <FilePenLine className="mr-2 h-4 w-4" />
                  Input Hasil
                </Button>
              </Link>
            )}
          </TableCell>
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
          {searchQuery
            ? "Laporan tidak ditemukan."
            : "Belum ada data MCU yang selesai atau menunggu input."}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari nama, ID, atau perusahaan..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No.</TableHead>
              <TableHead>ID Pasien</TableHead>
              <TableHead>Nama Pasien</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          {/* --- PERBAIKAN: Panggil fungsi di sini --- */}
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>

      {/* Pagination (tidak ada perubahan) */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Menampilkan {filteredReports.length > 0 ? indexOfFirstRow + 1 : 0}{" "}
          sampai {Math.min(indexOfLastRow, filteredReports.length)} dari{" "}
          {filteredReports.length} laporan
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
                <SelectValue placeholder={`${rowsPerPage}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50].map((pageSize) => (
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
  );
};
