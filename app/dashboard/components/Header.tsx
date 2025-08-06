"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  companyName?: string;
  onBack: () => void;
};

export const Header = ({ companyName, onBack }: HeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b bg-white flex-shrink-0">
      <div className="flex items-center gap-4">
        {companyName && (
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            aria-label="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h2 className="text-xl font-semibold">
            {companyName ? `Pasien di ${companyName}` : "Manajemen Perusahaan"}
          </h2>
          <p className="text-sm text-gray-500">
            {companyName
              ? "Kelola semua pasien dari perusahaan ini."
              : "Pilih perusahaan untuk melihat detail pasien."}
          </p>
        </div>
      </div>
    </header>
  );
};
