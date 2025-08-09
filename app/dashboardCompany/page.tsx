"use client";

import React from "react";
import { Toaster } from "sonner";
import { useAuth } from "@/components/context/AuthContext";
import { Header } from "./components/Header";
import { PatientTable } from "@/components/dashboard/PatientTable";

const DashboardCompanyPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== "HRD") {
    return (
      <div className="flex items-center justify-center h-screen">
        Memuat data...
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header />
      <main className="flex-1 overflow-y-auto">
        <PatientTable
          companyId={user.companyId}
          companyName={user.companyName}
        />
      </main>
    </>
  );
};

export default DashboardCompanyPage;
