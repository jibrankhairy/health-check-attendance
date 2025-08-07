"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyTable } from "./components/CompanyTable";
import { PatientTable } from "./components/PatientTable";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { useAuth } from "@/components/context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === "HRD" && user.companyId && user.companyName) {
        handleSelectCompany(user.companyId, user.companyName);
      }
      
      if (user.role === "PETUGAS") {
        router.push("/dashboard/petugas");
      }
    }
  }, [user, router]);

  const handleBackToCompanies = () => setSelectedCompany(null);
  const handleSelectCompany = (id: string, name: string) =>
    setSelectedCompany({ id, name });

  if (!user || user.role === "PETUGAS") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        Memuat data...
      </div>
    );
  }

  const renderContent = () => {
    if (selectedCompany) {
      return (
        <PatientTable
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
        />
      );
    } else if (user.role === "ADMINISTRASI") {
      return <CompanyTable onSelectCompany={handleSelectCompany} />;
    } else {
      return <div className="p-8">Memuat data perusahaan Anda...</div>;
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header
        companyName={selectedCompany?.name}
        onBack={user.role === "ADMINISTRASI" ? handleBackToCompanies : undefined}
      />
      <main className="flex-1">
        {renderContent()}
      </main>
    </>
  );
};

export default DashboardPage;