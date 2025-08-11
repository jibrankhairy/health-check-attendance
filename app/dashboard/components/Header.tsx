"use client";

import React from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

type HeaderProps = {
  companyName?: string;
  onBack?: () => void;
};

export const Header = ({ companyName, onBack }: HeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b bg-white flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          {onBack ? (
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              aria-label="Kembali"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Buka Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                </SheetHeader>
                <Sidebar />
              </SheetContent>
            </Sheet>
          )}
        </div>

        {onBack && (
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            aria-label="Kembali"
            className="hidden md:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div>
          <h2 className="text-lg md:text-xl font-semibold truncate max-w-[200px] sm:max-w-none">
            {companyName ? `Pasien di ${companyName}` : "Manajemen Perusahaan"}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
            {companyName
              ? "Kelola semua pasien dari perusahaan ini."
              : "Pilih perusahaan untuk melihat rincian pasien."}
          </p>
        </div>
      </div>
    </header>
  );
};
