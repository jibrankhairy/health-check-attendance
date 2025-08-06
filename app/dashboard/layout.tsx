import React from "react";
import { Sidebar } from "./components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/components/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AuthProvider>
        <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
          <div className="flex min-h-screen w-full bg-gray-50 font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
          </SidebarProvider>
      </AuthProvider>
    </AuthGuard>
  );
}
