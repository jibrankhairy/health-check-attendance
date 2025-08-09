"use client";

import React from "react";
import { useAuth } from "@/components/context/AuthContext";

export const Header = () => {
  const { user } = useAuth();

  const companyName = user?.role === "HRD" ? user.companyName : "Perusahaan";

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b bg-white flex-shrink-0">
      <div>
        <h2 className="text-xl font-semibold">
          Manajemen Pasien {companyName}
        </h2>
        <p className="text-sm text-gray-500">
          Lihat dan kelola semua data pasien dari perusahaan Anda.
        </p>
      </div>
    </header>
  );
};
