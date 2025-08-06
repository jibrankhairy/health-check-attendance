"use client";

import React, { useState } from "react";
import { CompanyTable } from "./components/CompanyTable";
import { PatientTable } from "./components/PatientTable";
import { Toaster } from "sonner";
import { Header } from "./components/Header";

const DashboardPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleBackToCompanies = () => setSelectedCompany(null);
  const handleSelectCompany = (id: string, name: string) =>
    setSelectedCompany({ id, name });

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header
        companyName={selectedCompany?.name}
        onBack={handleBackToCompanies}
      />
      {selectedCompany ? (
        <PatientTable
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
        />
      ) : (
        <CompanyTable onSelectCompany={handleSelectCompany} />
      )}
    </>
  );
};

export default DashboardPage;
