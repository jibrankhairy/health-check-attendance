"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { McuInputForm } from "@/components/mcu/McuInputForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Patient {
  fullName: string;
  patientId: string;
  mcuPackage: string[];
  age: number;
  gender: string;
}

interface ReportData {
  id: string;
  patient: Patient;
  saran?: string[];
  [key: string]: any;
}

const InputMcuResultPage = () => {
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
          throw new Error("Gagal memuat data laporan untuk diinput.");
        }

        const rawData: {
          id: string;
          patient: Patient;
          saran?: string | string[] | null;
          [key: string]: any;
        } = await response.json();

        let finalSaran: string[] | undefined = undefined;
        if (Array.isArray(rawData.saran)) {
          finalSaran = rawData.saran;
        } else if (typeof rawData.saran === "string") {
          try {
            const parsed = JSON.parse(rawData.saran);
            if (Array.isArray(parsed)) {
              finalSaran = parsed;
            }
          } catch (e) {
            console.warn(
              "Field 'saran' is a non-JSON string and will be ignored:",
              rawData.saran
            );
          }
        }

        const processedData: ReportData = {
          ...rawData,
          saran: finalSaran,
        };

        setReportData(processedData);
      } catch (err: any) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
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
        <span>Memuat form input...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/dashboard/reports"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Laporan
        </Link>
        <h1 className="text-3xl font-bold mt-2">Input Hasil MCU</h1>
        {reportData && (
          <p className="text-gray-500">
            Menginput untuk: <strong>{reportData.patient.fullName}</strong> (ID:{" "}
            {reportData.patient.patientId})
          </p>
        )}
      </div>

      {reportData && <McuInputForm initialData={reportData} />}
    </div>
  );
};

export default InputMcuResultPage;
