"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Loader2,
  FileText,
  FilePenLine,
  Pencil,
  AlertCircle,
  Upload,
  Download,
  ChevronDown,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import * as XLSX from "xlsx";

import { pdf } from "@react-pdf/renderer";
import { FullReportDocument } from "@/components/mcu/report/FullReportDocument";

const IMAGE_TYPES = {
  rontgen: { label: "Rontgen" },
  ekg: { label: "EKG" },
  treadmill: { label: "Treadmill" },
  usgAbdomen: { label: "USG Abdomen" },
  usgMammae: { label: "USG Mammae" },
} as const;

type ImageType = keyof typeof IMAGE_TYPES;

type Company = {
  id: string;
  name: string;
};

type ReportRow = {
  id: string;
  updatedAt: string;
  status: string;
  patient: {
    id: number;
    patientId: string;
    fullName: string;
    company: { id: string; name: string };
  };
};

type ApiMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type ApiResp = {
  data: ReportRow[];
  meta: ApiMeta;
};

export const ReportTable = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [meta, setMeta] = useState<ApiMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingResults, setIsExportingResults] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportingImages, setIsImportingImages] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageType, setCurrentImageType] = useState<ImageType | null>(
    null
  );

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/mcu/companies", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat daftar perusahaan.");
      const list: any[] = await res.json();
      const simplified: Company[] = list
        .map((c) => ({ id: String(c.id), name: String(c.name) }))
        .filter((c) => !!c.id && !!c.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      setCompanies(simplified);
    } catch (e: any) {
      toast.error(e.message);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    if (!isImporting && !isImportingImages) setLoading(true);
    if (!companyId) {
      setRows([]);
      setMeta({ page: 1, pageSize, total: 0, totalPages: 1 });
      setLoading(false);
      return;
    }
    try {
      const qs = new URLSearchParams({
        companyId,
        page: String(page),
        pageSize: String(pageSize),
        ...(searchQuery ? { search: searchQuery } : {}),
      }).toString();
      const res = await fetch(`/api/mcu/reports?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data laporan.");
      const json: ApiResp = await res.json();
      setRows(json.data);
      setMeta(json.meta);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [companyId, page, pageSize, searchQuery, isImporting, isImportingImages]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleExport = async () => {
    if (!companyId) return;
    setIsExporting(true);
    const toastId = toast.loading("Mempersiapkan file untuk diunduh...");
    try {
      const res = await fetch(`/api/mcu/reports/export?companyId=${companyId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal membuat file ekspor.");
      }
      const disposition = res.headers.get("Content-Disposition");
      const fileNameMatch =
        disposition && disposition.match(/filename="(.+?)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : "template-mcu.xlsx";
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Unduhan Dimulai!", {
        id: toastId,
        description: `File ${fileName} sedang diunduh.`,
      });
    } catch (e: any) {
      toast.error("Ekspor Gagal!", { id: toastId, description: e.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportResults = async () => {
    if (!companyId) return;
    setIsExportingResults(true);
    const toastId = toast.loading("Mempersiapkan data hasil MCU...");
    try {
      const res = await fetch(
        `/api/mcu/reports/export-results?companyId=${companyId}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Gagal membuat file ekspor hasil."
        );
      }
      const disposition = res.headers.get("Content-Disposition");
      const fileNameMatch =
        disposition && disposition.match(/filename="(.+?)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : "hasil-mcu.xlsx";
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Unduhan Dimulai!", {
        id: toastId,
        description: `File ${fileName} sedang diunduh.`,
      });
    } catch (e: any) {
      toast.error("Ekspor Gagal!", { id: toastId, description: e.message });
    } finally {
      setIsExportingResults(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!companyId) return;
    setIsDownloadingAll(true);
    const toastId = toast.loading("Mempersiapkan Laporan...", {
      description: "Mengambil daftar laporan yang sudah selesai.",
    });

    try {
      const res = await fetch(
        `/api/mcu/reports/all-completed?companyId=${companyId}`
      );
      if (!res.ok) {
        throw new Error("Gagal mengambil daftar laporan.");
      }
      const reportsToDownload = await res.json();

      if (!reportsToDownload || reportsToDownload.length === 0) {
        toast.info("Tidak Ada Laporan", {
          id: toastId,
          description:
            "Tidak ada laporan yang berstatus selesai untuk diunduh.",
        });
        return;
      }

      toast.success(`Ditemukan ${reportsToDownload.length} laporan`, {
        id: toastId,
        description: "Proses unduh akan dimulai satu per satu...",
      });

      for (const report of reportsToDownload) {
        const fileName = `Laporan_MCU_${report.patient.fullName.replace(
          /\s/g,
          "_"
        )}.pdf`;
        const blob = await pdf(<FullReportDocument data={report} />).toBlob();

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } catch (e: any) {
      toast.error("Gagal Mengunduh Semua", {
        id: toastId,
        description: e.message,
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && companyId) {
      handleImport(file, companyId);
    }
    if (event.target) event.target.value = "";
  };

  const handleImport = async (file: File, companyId: string) => {
    setIsImporting(true);
    const toastId = toast.loading("Mengunggah dan memproses file...", {
      description: "Mohon tunggu, ini mungkin memakan waktu beberapa saat.",
    });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("companyId", companyId);
      const res = await fetch("/api/mcu/reports/import", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gagal mengimpor data.");
      }
      toast.success("Impor Selesai!", {
        id: toastId,
        description: result.message,
      });
      if (result.errors && result.errors.length > 0) {
        toast.warning("Beberapa baris data gagal diimpor.", {
          description: (
            <ul className="list-disc list-inside max-h-40 overflow-y-auto">
              {result.errors.slice(0, 10).map((e: string, i: number) => (
                <li key={i}>{e}</li>
              ))}
              {result.errors.length > 10 && <li>...dan lainnya.</li>}
            </ul>
          ),
          duration: 10000,
        });
      }
      fetchReports();
    } catch (e: any) {
      toast.error("Impor Gagal!", { id: toastId, description: e.message });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImageFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0 && companyId && currentImageType) {
      handleImageImport(Array.from(files), companyId, currentImageType);
    }
    if (event.target) event.target.value = "";
    setCurrentImageType(null);
  };

  const handleImageImport = async (
    files: File[],
    companyId: string,
    imageType: ImageType
  ) => {
    setIsImportingImages(true);
    const toastId = toast.loading(
      `Mengunggah ${files.length} file ${IMAGE_TYPES[imageType].label}...`,
      {
        description: "Proses ini mungkin memerlukan waktu beberapa saat...",
      }
    );

    try {
      const formData = new FormData();
      formData.append("companyId", companyId);
      formData.append("imageType", imageType);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/mcu/reports/import-images", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gagal mengimpor gambar.");
      }
      toast.success("Impor Gambar Selesai!", {
        id: toastId,
        description: `${result.successCount} file berhasil diproses.`,
      });
      if (result.errors && result.errors.length > 0) {
        toast.warning("Beberapa file gagal diimpor:", {
          description: (
            <ul className="list-disc list-inside max-h-40 overflow-y-auto">
              {result.errors.slice(0, 10).map((e: string, i: number) => (
                <li key={i}>{e}</li>
              ))}
              {result.errors.length > 10 && <li>...dan lainnya.</li>}
            </ul>
          ),
          duration: 10000,
        });
      }
      fetchReports();
    } catch (e: any) {
      toast.error("Impor Gambar Gagal!", {
        id: toastId,
        description: e.message,
      });
    } finally {
      setIsImportingImages(false);
    }
  };

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
    if (!companyId) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-gray-500">
            Pilih perusahaan terlebih dahulu untuk menampilkan pasien.
          </TableCell>
        </TableRow>
      );
    }
    if (rows.length > 0) {
      const indexOfFirstRow = (meta.page - 1) * meta.pageSize;
      return rows.map((report, i) => (
        <TableRow key={report.id}>
          <TableCell className="font-medium text-center">
            {indexOfFirstRow + i + 1}
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
            <div className="flex items-center justify-center gap-2">
              {report.status === "COMPLETED" ? (
                <>
                  <Link href={`/dashboard/reports/view/${report.id}`} passHref>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" /> Lihat
                    </Button>
                  </Link>
                  <Link href={`/dashboard/reports/${report.id}`} passHref>
                    <Button variant="secondary" size="sm">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href={`/dashboard/reports/${report.id}`} passHref>
                  <Button variant="default" size="sm">
                    <FilePenLine className="mr-2 h-4 w-4" /> Input Hasil
                  </Button>
                </Link>
              )}
            </div>
          </TableCell>
        </TableRow>
      ));
    }
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
          {searchQuery
            ? "Laporan tidak ditemukan."
            : "Belum ada data untuk perusahaan ini."}
        </TableCell>
      </TableRow>
    );
  };

  const isActionDisabled =
    !companyId ||
    isImporting ||
    isExporting ||
    isExportingResults ||
    isImportingImages ||
    isDownloadingAll;
  const paginationDisabled =
    !companyId ||
    meta.total === 0 ||
    isImporting ||
    isExporting ||
    isExportingResults ||
    isImportingImages ||
    isDownloadingAll;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Perusahaan:</span>
          <Select
            value={companyId ?? undefined}
            onValueChange={(v) => {
              setCompanyId(v);
              setPage(1);
            }}
            disabled={
              companies.length === 0 ||
              isImporting ||
              isExporting ||
              isExportingResults ||
              isImportingImages
            }
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Pilih Perusahaan" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-500">
            {companies.length > 0 ? (
              `${companies.length} prsh`
            ) : (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Kosong
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
              variant="outline"
              disabled={isActionDisabled}
              onClick={handleExport}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Template
            </Button>
            <Button
              className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
              variant="outline"
              disabled={isActionDisabled}
              onClick={handleExportResults}
            >
              {isExportingResults ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Hasil DAS FAS Health
            </Button>

            <Button
              variant="default"
              className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
              disabled={isActionDisabled}
              onClick={handleDownloadAll}
            >
              {isDownloadingAll ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Unduh Semua Hasil
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".xlsx,.xls,.csv"
            />
            <input
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageFileSelect}
              className="hidden"
              accept="image/jpeg,image/png,application/pdf"
              multiple
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
                  disabled={isActionDisabled}
                >
                  {isImporting || isImportingImages ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Import Data
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pilih Tipe Import</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  Import Hasil (Excel)
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Import Gambar</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {Object.entries(IMAGE_TYPES).map(([key, value]) => (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => {
                            setCurrentImageType(key as ImageType);
                            imageFileInputRef.current?.click();
                          }}
                        >
                          {`Import ${value.label}`}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari nama atau ID pasien…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            disabled={isActionDisabled}
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
              <TableHead>Tgl. Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-600">
          {companyId ? (
            <>
              Menampilkan{" "}
              {meta.total > 0 ? (meta.page - 1) * meta.pageSize + 1 : 0} -{" "}
              {Math.min(meta.page * meta.pageSize, meta.total)} dari{" "}
              {meta.total} laporan
            </>
          ) : (
            "Pilih perusahaan untuk melihat laporan"
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm">Baris:</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(v: string) => {
                setPageSize(Number(v));
                setPage(1);
              }}
              disabled={paginationDisabled}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50].map((ps) => (
                  <SelectItem key={ps} value={`${ps}`}>
                    {ps}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm font-medium">
            Hal {meta.page} dari {meta.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={paginationDisabled || page <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
              disabled={paginationDisabled || page >= meta.totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
