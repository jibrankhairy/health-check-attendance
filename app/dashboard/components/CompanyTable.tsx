"use client";

import React, { useState, useEffect } from "react";
import { Building, Search, Users, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyData = {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    patients: number;
  };
};

type CompanyTableProps = {
  onSelectCompany: (companyId: string, companyName: string) => void;
};

export const CompanyTable = ({ onSelectCompany }: CompanyTableProps) => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/companies");
        if (!response.ok) {
          throw new Error("Gagal memuat data perusahaan");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCompanies.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);

  if (loading) {
    return <div className="p-4 md:p-8">Memuat data perusahaan...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari perusahaan..."
            className="pl-9 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Tampilan Tabel untuk Desktop */}
      <div className="hidden md:block rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No.</TableHead>
              <TableHead>Nama Perusahaan</TableHead>
              <TableHead>ID Perusahaan</TableHead>
              <TableHead>Jumlah Pasien</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((company, index) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectCompany(company.id, company.name)}
                >
                  <TableCell className="font-medium text-center">
                    {indexOfFirstRow + index + 1}
                  </TableCell>
                  <TableCell className="font-medium flex items-center">
                    <Building className="mr-3 h-5 w-5 text-gray-400" />
                    {company.name}
                  </TableCell>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company._count.patients} orang</TableCell>
                  <TableCell>
                    {new Date(company.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchQuery
                    ? "Perusahaan tidak ditemukan."
                    : "Belum ada data perusahaan."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Tampilan Card untuk Mobile */}
      <div className="md:hidden space-y-4">
        {currentRows.length > 0 ? (
          currentRows.map((company) => (
            <Card
              key={company.id}
              className="cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
              onClick={() => onSelectCompany(company.id, company.name)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Building className="mr-2 h-5 w-5 text-blue-600" />
                  {company.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-1 pt-2">
                <div className="flex items-center">
                  <Hash className="mr-2 h-4 w-4" />
                  <span>ID: {company.id}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{company._count.patients} Pasien</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Dibuat:{" "}
                    {new Date(company.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchQuery
              ? "Perusahaan tidak ditemukan."
              : "Belum ada data perusahaan."}
          </div>
        )}
      </div>

      {/* Paginasi */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-600 order-last md:order-first">
          Menampilkan {Math.min(indexOfFirstRow + 1, filteredCompanies.length)}{" "}
          - {Math.min(indexOfLastRow, filteredCompanies.length)} dari{" "}
          {filteredCompanies.length} perusahaan
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm hidden sm:block">Baris:</p>
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
            Hal {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
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
