// app/dashboard/reports/[reportId]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { McuInputForm } from "@/components/mcu/McuInputForm"; // Komponen ini akan kita buat
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const InputMcuResultPage = () => {
  const params = useParams();
  const reportId = params.reportId as string;

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        // Panggil API yang sudah kita siapkan di Langkah 1
        const response = await fetch(`/api/mcu/reports/${reportId}`);
        if (!response.ok) {
          throw new Error("Gagal memuat data laporan untuk diinput.");
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
    return <div className="text-center p-10">Memuat form input...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link href="/dashboard/reports" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Laporan
        </Link>
        <h1 className="text-3xl font-bold mt-2">Input Hasil MCU</h1>
        {reportData && (
          <p className="text-gray-500">
            Menginput untuk: <strong>{reportData.patient.fullName}</strong> (ID: {reportData.patient.patientId})
          </p>
        )}
      </div>

      {reportData && <McuInputForm initialData={reportData} />}
    </div>
  );
};

export default InputMcuResultPage;