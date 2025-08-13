"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import { FullReportDocument } from "@/components/mcu/report/FullReportDocument";

interface Patient {
  fullName: string;
}

interface ReportData {
  patient: Patient;
}

const ViewReportPage = () => {
  const params = useParams();
  const reportId = params.reportId as string;

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mcu/reports/${reportId}`);
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
    return <div className="text-center p-10">Memuat dokumen laporan...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!reportData) {
    return <div className="text-center p-10">Data tidak ditemukan.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Laporan MCU: {reportData.patient.fullName}
        </h1>
        <PDFDownloadLink
          document={<FullReportDocument data={reportData} />}
          fileName={`Laporan_MCU_${reportData.patient.fullName.replace(
            /\s/g,
            "_"
          )}.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Menyiapkan dokumen..."
            ) : (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Unduh PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      </div>
      <div className="flex-grow">
        <PDFViewer width="100%" height="100%">
          <FullReportDocument data={reportData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ViewReportPage;
