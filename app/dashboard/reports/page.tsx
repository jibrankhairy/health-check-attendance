import React from 'react';
import { Header } from '../components/Header';
import { ReportTable } from './ReportTable';

const LaporanMcuPage = () => {
  return (
    <>
      <Header companyName="Laporan Medical Check Up" />
      <main className="flex-1 p-4 sm:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Hasil MCU Selesai</h1>
          <p className="text-gray-600 mb-6">
            Daftar ini berisi semua pasien yang telah menyelesaikan seluruh rangkaian pemeriksaan MCU.
          </p>
          <ReportTable />
        </div>
      </main>
    </>
  );
};

export default LaporanMcuPage;
