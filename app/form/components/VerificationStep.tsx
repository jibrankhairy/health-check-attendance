"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const VerificationStep = ({
  onVerified,
}: {
  onVerified: (details: { name: string; resultId: string }) => void;
}) => {
  const [patientId, setPatientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleVerify = async () => {
    if (!patientId) return toast.error("Silakan masukkan ID Pasien Anda.");
    setIsLoading(true);
    try {
      const response = await fetch("/api/form/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(`ID Terverifikasi! Selamat datang, ${data.fullName}.`);
      onVerified({ name: data.fullName, resultId: data.mcuResultId });
    } catch (error: any) {
      toast.error(
        error.message || "Verifikasi gagal, periksa kembali ID Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md animate-fade-in border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <label htmlFor="patientId" className="text-lg font-medium block mb-6">
            Masukkan ID Pasien Anda
          </label>
          <Input
            id="patientId"
            placeholder="cth: MCU-1234"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value.toUpperCase())}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-[#01449D] hover:bg-[#01449D]/90 text-white"
        >
          {isLoading ? "Memverifikasi..." : "Lanjutkan"}
        </Button>
      </CardFooter>
    </Card>
  );
};
