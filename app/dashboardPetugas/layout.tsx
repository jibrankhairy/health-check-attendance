"use client";

import React from "react";
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
      <AuthGuard allowedRoles={["PETUGAS"]}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-gray-50 font-sans">
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
