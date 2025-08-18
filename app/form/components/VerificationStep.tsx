"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type VerifiedDetails = {
  name: string;
  resultId: string;
};

export const VerificationStep = ({
  onVerified,
}: {
  onVerified: (details: VerifiedDetails) => void;
}) => {
  const [nik, setNik] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedData, setVerifiedData] = useState<VerifiedDetails | null>(
    null
  );

  const handleVerify = async () => {
    if (!nik && !patientId) {
      return toast.error("Silakan masukkan NIK atau ID Pasien Anda.");
    }
    setIsLoading(true);
    setIsVerified(false);
    setVerifiedData(null);

    try {
      const response = await fetch("/api/form/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik, patientId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setNik(data.nik);
      setPatientId(data.patientId);
      setVerifiedData({ name: data.fullName, resultId: data.mcuResultId });
      setIsVerified(true);
      toast.success(`Data ditemukan! Selamat datang, ${data.fullName}.`);
    } catch (error: any) {
      toast.error(
        error.message || "Verifikasi gagal, periksa kembali data Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (verifiedData) {
      onVerified(verifiedData);
    }
  };

  return (
    <Card className="w-full max-w-md animate-fade-in border-0 shadow-none bg-transparent">
      <CardContent className="pt-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Verifikasi Data Peserta</h2>
          <p className="text-sm text-gray-500 mt-1">
            Silakan masukkan NIK atau No. ID MCU Anda, lalu klik "Verifikasi".
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="nik" className="text-sm font-medium text-gray-700">
              NIK Anda
            </label>
            <Input
              id="nik"
              placeholder="Masukkan NIK..."
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              disabled={isLoading || isVerified}
            />
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4">ATAU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div>
            <label
              htmlFor="patientId"
              className="text-sm font-medium text-gray-700"
            >
              No. ID MCU Anda
            </label>
            <Input
              id="patientId"
              placeholder="cth: MCU-1234"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value.toUpperCase())}
              disabled={isLoading || isVerified}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        {!isVerified ? (
          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-[#01449D] hover:bg-[#01449D]/90 text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Verifikasi..." : "Verifikasi"}
          </Button>
        ) : (
          <Button
            onClick={handleContinue}
            className="w-full bg-[#01449D] hover:bg-[#01449D]/90 text-white"
          >
            Lanjutkan ke Formulir
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
