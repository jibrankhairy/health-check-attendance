import React from "react";
import { Sidebar } from "./components/Sidebar";
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
        <div className="flex min-h-screen w-full bg-gray-50 font-sans">
          <Sidebar />
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </AuthProvider>
    </AuthGuard>
  );
}
