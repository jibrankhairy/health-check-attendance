"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ArrowLeft } from "lucide-react";

import { FullReportDocument } from "@/components/mcu/report/FullReportDocument";

interface Patient {
  fullName: string;
}

interface ReportData {
  patient: Patient;
  [key: string]: any;
}

const ViewReportPage = () => {
  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        // ▼▼▼ PERUBAHAN UTAMA ADA DI SINI ▼▼▼
        const response = await fetch(`/api/mcu/reports/${reportId}`, {
          cache: "no-cache", // Memaksa browser untuk selalu mengambil data terbaru
        });
        // ▲▲▲ SAMPAI SINI ▲▲▲

        if (!response.ok) {
          throw new Error("Gagal memuat data untuk laporan.");
        }
        const data = await response.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
        <span>Memuat dokumen laporan...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!reportData) {
    return <div className="text-center p-10">Data tidak ditemukan.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/reports")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">
            Laporan MCU: {reportData.patient.fullName}
          </h1>
        </div>
        <PDFDownloadLink
          document={<FullReportDocument data={reportData} />}
          fileName={`Laporan_MCU_${reportData.patient.fullName.replace(
            /\s/g,
            "_"
          )}.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyiapkan...
              </Button>
            ) : (
              <Button className="bg-[#01449D] hover:bg-[#01449D]/90 text-white md:w-auto md:px-4">
                <Download className="mr-2 h-4 w-4" />
                Unduh PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      </div>
      <div className="flex-grow p-4">
        <PDFViewer width="100%" height="100%" className="rounded-lg shadow-lg">
          <FullReportDocument data={reportData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ViewReportPage;