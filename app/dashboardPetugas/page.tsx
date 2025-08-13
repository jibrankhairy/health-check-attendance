"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/components/context/AuthContext";
import { DashboardCard } from "./components/DashboardCard";
import { ScannerModal } from "./components/ScannerModal";
import { Header } from "./components/Header";
import PemeriksaanFisikFormModal, {
  type PemeriksaanFisikFormValues,
} from "./components/PemeriksaanFisikForm";
import PatientPreview from "./components/PatientPreview";

type Checkpoint = {
  id: number;
  name: string;
  slug: string;
};

const PetugasDashboardPage = () => {
  const { user } = useAuth();
  const [checkPoints, setCheckPoints] = useState<Checkpoint[]>([]);
  const [selectedCheckPointSlug, setSelectedCheckPointSlug] = useState<
    string | null
  >(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFisikForm, setShowFisikForm] = useState(false);
  const [pendingMcuResultId, setPendingMcuResultId] = useState<string | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    mcuResultId: string;
    patient: { id?: string; mcuId?: string; fullName: string; dob: string };
  } | null>(null);

  useEffect(() => {
    async function fetchCheckPoints() {
      try {
        const response = await fetch("/api/mcu/checkpoints");
        if (!response.ok) throw new Error("Gagal memuat data pos.");
        const data: Checkpoint[] = await response.json();
        setCheckPoints(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    fetchCheckPoints();
  }, []);

  async function doCheckIn(mcuResultId: string, cpSlug: string) {
    if (!user) return;
    setIsSubmitting(true);
    toast.info(`QR terdeteksi: ${mcuResultId}. Memproses...`);
    try {
      const response = await fetch("/api/mcu/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcuResultId,
          checkpointSlug: cpSlug,
          petugasName: user.fullName,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Gagal check-in.");
      toast.success(data?.message || "Berhasil check-in.");
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Check-in gagal."}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleScanResult = async (mcuResultId: string) => {
    if (!user || !selectedCheckPointSlug || isSubmitting) return;
    setShowScanner(false);
    try {
      const res = await fetch(
        `/api/mcu/preview/${encodeURIComponent(mcuResultId)}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.message || "QR tidak valid / data tidak ditemukan"
        );
      setPreviewData(data);
      setIsPreviewOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "QR tidak valid / data tidak ditemukan");
      setShowScanner(true);
    }
  };

  const handlePreviewCancel = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
  };

  const handlePreviewContinue = async () => {
    if (!previewData || !selectedCheckPointSlug) return;
    setIsPreviewOpen(false);
    if (selectedCheckPointSlug === "pemeriksaan_fisik") {
      setPendingMcuResultId(previewData.mcuResultId);
      setShowFisikForm(true);
      toast.message(`QR terdeteksi: ${previewData.mcuResultId}`, {
        description: "Silakan isi Form Pemeriksaan Fisik.",
      });
    } else {
      await doCheckIn(previewData.mcuResultId, selectedCheckPointSlug);
    }
  };

  const handleSubmitFisikForm = async (values: PemeriksaanFisikFormValues) => {
    if (!user || !selectedCheckPointSlug || !pendingMcuResultId || isSubmitting)
      return;
    if (selectedCheckPointSlug !== "pemeriksaan_fisik") {
      toast.error("Pos tidak sesuai: bukan Pemeriksaan Fisik.");
      return;
    }
    setIsSubmitting(true);
    toast.info("Menyimpan form & melakukan check-in...");
    try {
      const res = await fetch("/api/mcu/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcuResultId: pendingMcuResultId,
          checkpointSlug: selectedCheckPointSlug,
          petugasName: user.fullName,
          pemeriksaanFisikForm: values,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Gagal check-in.");
      toast.success(data?.message || "Berhasil check-in.");
      setShowFisikForm(false);
      setPendingMcuResultId(null);
    } catch (e: any) {
      toast.error(e?.message || "Gagal menyimpan form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-slate-100 min-h-screen flex items-center justify-center">
        Memuat data petugas...
      </div>
    );
  }

  const selectedCheckPointName =
    checkPoints.find((cp) => cp.slug === selectedCheckPointSlug)?.name || null;

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
            selectedCheckPoint={selectedCheckPointSlug}
            onCheckPointChange={setSelectedCheckPointSlug}
            onScanClick={() => setShowScanner(true)}
          />
        </main>
        <ScannerModal
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanResult}
          selectedCheckPoint={selectedCheckPointName}
        />
        <PatientPreview
          open={isPreviewOpen}
          patient={previewData?.patient}
          onCancel={handlePreviewCancel}
          onContinue={handlePreviewContinue}
        />
        <PemeriksaanFisikFormModal
          isOpen={showFisikForm}
          onClose={() => {
            if (!isSubmitting) {
              setShowFisikForm(false);
              setPendingMcuResultId(null);
            }
          }}
          onSubmit={handleSubmitFisikForm}
          submitting={isSubmitting}
        />
      </div>
    </>
  );
};

export default PetugasDashboardPage;
