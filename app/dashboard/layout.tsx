"use client";

import React from "react";
import { Sidebar } from "./components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/components/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard allowedRoles={["ADMINISTRASI", "HRD", "PETUGAS"]}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-gray-50 font-sans">
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            <div className="flex flex-1 flex-col">{children}</div>
          </div>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
