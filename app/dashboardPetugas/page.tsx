"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/components/context/AuthContext";
import { DashboardCard } from "./components/DashboardCard";
import { ScannerModal } from "./components/ScannerModal";
import { Header } from "./components/Header";

const PetugasDashboardPage = () => {
  const { user } = useAuth();
  const [checkPoints, setCheckPoints] = useState<string[]>([]);
  const [selectedCheckPoint, setSelectedCheckPoint] = useState<string | null>(
    null
  );
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCheckPoints() {
      try {
        const response = await fetch("/api/mcu/checkpoints");
        if (!response.ok) throw new Error("Gagal memuat data pos.");
        const data = await response.json();
        setCheckPoints(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    fetchCheckPoints();
  }, []);

  const handleScanResult = async (mcuResultId: string) => {
    if (user && selectedCheckPoint && !isSubmitting) {
      setIsSubmitting(true);
      setShowScanner(false);
      toast.info(`QR terdeteksi: ${mcuResultId}. Memproses...`);

      try {
        const formattedCheckPoint = selectedCheckPoint
          .toLowerCase()
          .replace(/ /g, "_")
          .replace(/[()]/g, "");
        const response = await fetch("/api/mcu/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mcuResultId,
            checkPoint: formattedCheckPoint,
            petugasName: user.fullName,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        toast.success(data.message);
      } catch (err: any) {
        toast.error(`Gagal: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-slate-100 min-h-screen flex items-center justify-center">
        Memuat data petugas...
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        #qr-reader-container video {
          width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem;
        }
        #qr-reader-container__dashboard_section_csr > div {
          border: none !important;
        }
      `}</style>

      <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-100 to-[#01449D]">
        <Header />
        <main className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
          <Toaster richColors position="top-center" />
          <DashboardCard
            user={user}
            checkPoints={checkPoints}
            selectedCheckPoint={selectedCheckPoint}
            onCheckPointChange={setSelectedCheckPoint}
            onScanClick={() => setShowScanner(true)}
          />
        </main>
        <ScannerModal
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanResult}
          selectedCheckPoint={selectedCheckPoint}
        />
      </div>
    </>
  );
};

export default PetugasDashboardPage;
