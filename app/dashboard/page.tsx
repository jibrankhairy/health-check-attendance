// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { CompanyTable } from "./components/CompanyTable";
import { PatientTable } from "./components/PatientTable";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { useAuth } from "../hooks/useAuth"; // <-- Impor hook yang baru dibuat

const DashboardPage = () => {
  const { user } = useAuth(); // <-- Gunakan hook untuk mendapatkan data user
  console.log("Data user saat ini:", user);

  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Gunakan useEffect untuk mengecek role user saat komponen dimuat
  useEffect(() => {
    // Jika user adalah HRD dan punya companyId, langsung set perusahaannya
    if (user && user.role === "HRD" && user.companyId && user.companyName) {
      handleSelectCompany(user.companyId, user.companyName);
    }
  }, [user]); // <-- Effect ini akan berjalan setiap kali data user berubah

  const handleBackToCompanies = () => setSelectedCompany(null);
  const handleSelectCompany = (id: string, name: string) =>
    setSelectedCompany({ id, name });

  // Tampilkan loading jika data user belum siap
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Memuat data...
      </div>
    );
  }

  // Logika utama untuk menentukan tampilan
  const renderContent = () => {
    if (user.role === "ADMINISTRASI") {
      return selectedCompany ? (
        <PatientTable
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
        />
      ) : (
        <CompanyTable onSelectCompany={handleSelectCompany} />
      );
    }

    // Jika user adalah HRD, selalu tampilkan PatientTable perusahaannya
    if (user.role === "HRD" && selectedCompany) {
      return (
        <PatientTable
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
        />
      );
    }
    
    // Fallback jika user HRD tapi data company belum ter-load
    return <div className="p-8">Memuat data perusahaan Anda...</div>;
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header
        companyName={selectedCompany?.name}
        // Admin bisa kembali, HRD tidak perlu tombol kembali
        onBack={user.role === "ADMINISTRASI" ? handleBackToCompanies : undefined}
      />
      {renderContent()}
    </>
  );
};

export default DashboardPage;