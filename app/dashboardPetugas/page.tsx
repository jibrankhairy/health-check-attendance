"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/components/context/AuthContext";
import { mcuPackages } from "@/lib/mcu-data";
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

type PreviewData = {
  mcuResultId: string;
  patient: {
    id?: string;
    mcuId?: string;
    fullName: string;
    dob: string;
    mcuPackage: any;
  };
  progress: {
    checkpoint: {
      slug: string;
    };
  }[];
};

const slugToExaminationMap: { [key: string]: string[] } = {
  pemeriksaan_fisik: [
    "Pemeriksaan fisik dan anamnesis oleh dokter MCU",
    "Pemeriksaan kebugaran",
  ],
  tes_psikologi: ["Pemeriksaan psikologis (FAS dan SDS)"],
  pemeriksaan_lab: [
    "Hematologi (darah lengkap, golongan darah & rhesus)",
    "Profil lemak (kolesterol total, HDL, LDL, trigliserida)",
    "Panel diabetes (gula darah puasa, gula darah 2 jam PP)",
    "Fungsi hati (SGOT, SGPT)",
    "Fungsi ginjal (ureum, creatinin, asam urat)",
    "HIV",
    "Panel Hepatitis",
  ],
  pemeriksaan_urin: ["Urinalisa lengkap"],
  pemeriksaan_radiologi: ["Radiologi thoraks", "USG Whole Abdomen"],
  pemeriksaan_audiometry: ["Audiometri"],
  pemeriksaan_spirometry: ["Spirometri"],
  pemeriksaan_ekg: ["EKG"],
  pemeriksaan_treadmill: ["Treadmill"],
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
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

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

  const handleScanResult = async (scannedText: string) => {
    if (!user || !selectedCheckPointSlug || isSubmitting) return;

    setShowScanner(false);
    toast.info("QR terdeteksi, memverifikasi data pasien...");

    let mcuResultId: string;

    try {
      const parsedData = JSON.parse(scannedText);
      if (typeof parsedData === 'object' && parsedData !== null && parsedData.mcuResultId) {
        mcuResultId = parsedData.mcuResultId;
      } else {
        throw new Error("Format QR tidak valid (tidak ditemukan mcuResultId).");
      }
    } catch (e) {
      toast.error("Format QR Code tidak valid atau tidak terbaca.");
      return;
    }

    try {
      const res = await fetch(
        `/api/mcu/preview/${encodeURIComponent(mcuResultId)}`
      );
      const data: PreviewData = await res.json();

      if (!res.ok) {
        throw new Error((data as any).message || "QR tidak valid");
      }

      const isAlreadyCompleted = data.progress.some(
        (p) => p.checkpoint.slug === selectedCheckPointSlug
      );

      if (isAlreadyCompleted) {
        toast.warning("Pemeriksaan Sudah Selesai", {
          description: `Pasien ${data.patient.fullName} telah menyelesaikan pemeriksaan di pos ini.`,
        });
        return;
      }

      const patientPackageIds: string[] = data.patient.mcuPackage || [];
      const allowedExaminations = new Set<string>();

      patientPackageIds.forEach((packageId) => {
        const pkg = mcuPackages.find((p) => p.id === packageId);
        if (pkg) {
          pkg.details.forEach((detail) => allowedExaminations.add(detail));
        } else {
          allowedExaminations.add(packageId);
        }
      });

      const currentExaminations =
        slugToExaminationMap[selectedCheckPointSlug] || [];
      const isAllowed = currentExaminations.some((exam) =>
        allowedExaminations.has(exam)
      );

      if (!isAllowed) {
        toast.error("Pemeriksaan Tidak Sesuai", {
          description: `Pemeriksaan di pos ini tidak termasuk dalam paket MCU pasien ${data.patient.fullName}.`,
          duration: 5000,
        });
        return;
      }

      setPreviewData(data);
      setIsPreviewOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "Gagal memverifikasi data.");
    }
  };

  async function doCheckIn(mcuResultId: string, cpSlug: string) {
    if (!user) return;
    setIsSubmitting(true);
    toast.info(`Memproses check-in untuk ID: ${mcuResultId}...`);
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
      toast.message(`Memproses pasien...`, {
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