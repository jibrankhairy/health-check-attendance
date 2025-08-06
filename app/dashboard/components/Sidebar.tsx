"use client";

import React from "react";
import {
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";

export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Image
          src="/images/logo-klinik.png"
          alt="Logo"
          width={50}
          height={52}
          className="mr-2"
        />
        <h1 className="text-sm font-semibold">Klinik Yuliarpan Medika</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-6">
        <Button variant="secondary" className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Manajemen Pasien
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Laporan MCU
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Briefcase className="mr-2 h-4 w-4" />
          Paket MCU
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan
        </Button>
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://placehold.co/36x36/7c3aed/ffffff?text=A"
              alt="Admin"
            />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
