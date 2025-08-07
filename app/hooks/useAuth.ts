// app/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";

// Definisikan tipe data user sesuai dengan response API login
type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMINISTRASI" | "HRD" | "PETUGAS";
  companyId?: string;
  companyName?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return { user };
}