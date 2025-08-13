"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Hourglass, Loader2 } from "lucide-react";
import { mcuPackages } from "@/lib/mcu-data";

type ProgressData = {
  petugasName: string | null;
  checkpoint: {
    slug: string;
  };
};

type McuResultData = {
  patient: { fullName: string };
  progress: ProgressData[];
};

const examinationToSlugMap: { [key: string]: string } = {
  "Pemeriksaan fisik dan anamnesis oleh dokter MCU": "pemeriksaan_fisik",
  "Pemeriksaan kebugaran": "pemeriksaan_fisik",
  "Pemeriksaan psikologis (FAS dan SDS)": "tes_psikologi",
  "Hematologi (darah lengkap, golongan darah & rhesus)": "pemeriksaan_lab",
  "Profil lemak (kolesterol total, HDL, LDL, trigliserida)": "pemeriksaan_lab",
  "Panel diabetes (gula darah puasa, gula darah 2 jam PP)": "pemeriksaan_lab",
  "Fungsi hati (SGOT, SGPT)": "pemeriksaan_lab",
  "Fungsi ginjal (ureum, creatinin, asam urat)": "pemeriksaan_lab",
  HIV: "pemeriksaan_lab",
  "Urinalisa lengkap": "pemeriksaan_urin",
  "Radiologi thoraks": "pemeriksaan_radiologi",
  Audiometri: "pemeriksaan_audiometry",
  Spirometri: "pemeriksaan_spirometry",
  EKG: "pemeriksaan_ekg",
  Treadmill: "pemeriksaan_treadmill",
  "Panel Hepatitis": "pemeriksaan_lab",
  "USG Whole Abdomen": "pemeriksaan_radiologi",
};

interface McuProgressModalProps {
  mcuResultId: string | null;
  isOpen: boolean;
  packageItems: string[] | null;
  onOpenChange: (open: boolean) => void;
}

export function McuProgressModal({
  mcuResultId,
  isOpen,
  packageItems,
  onOpenChange,
}: McuProgressModalProps) {
  const [data, setData] = useState<McuResultData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mcuResultId && isOpen) {
      setLoading(true);
      setData(null);
      fetch(`/api/mcu/results/${mcuResultId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data progres.");
          return res.json();
        })
        .then((result) => {
          setData(result);
        })
        .catch((err) => console.error("Failed to fetch MCU details:", err))
        .finally(() => setLoading(false));
    }
  }, [mcuResultId, isOpen]);

  const mainPackageName = useMemo(() => {
    if (!packageItems) return null;
    const mainPackage = mcuPackages.find((p) => packageItems.includes(p.id));
    return mainPackage ? mainPackage.label : null;
  }, [packageItems]);

  const displayedItems = useMemo(() => {
    if (!packageItems) return [];
    const allDetails = new Set<string>();
    packageItems.forEach((item) => {
      const pkg = mcuPackages.find((p) => p.id === item);
      if (pkg) {
        pkg.details.forEach((detail) => allDetails.add(detail));
      } else {
        allDetails.add(item);
      }
    });
    return Array.from(allDetails);
  }, [packageItems]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Progres Medical Check Up
          </DialogTitle>
          {data?.patient?.fullName && (
            <DialogDescription>
              Status pemeriksaan untuk pasien:{" "}
              <strong>{data.patient.fullName}</strong>
            </DialogDescription>
          )}
          {mainPackageName && (
            <div className="pt-2">
              <Badge variant="secondary">{mainPackageName}</Badge>
            </div>
          )}
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin mr-2" /> Memuat data progres...
            </div>
          ) : data ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Pemeriksaan</TableHead>
                    <TableHead>Petugas</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedItems.map((itemName) => {
                    const relevantSlug = examinationToSlugMap[itemName];

                    const progressEntry = relevantSlug
                      ? data.progress.find(
                          (p) => p.checkpoint.slug === relevantSlug
                        )
                      : undefined;

                    const isCompleted = !!progressEntry;
                    const petugas = progressEntry?.petugasName || "-";

                    return (
                      <TableRow key={itemName}>
                        <TableCell className="font-medium">
                          {itemName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {petugas}
                        </TableCell>
                        <TableCell className="text-right">
                          {isCompleted ? (
                            <span className="flex items-center justify-end gap-2 text-green-600 font-semibold">
                              <CheckCircle size={16} /> Selesai
                            </span>
                          ) : (
                            <span className="flex items-center justify-end gap-2 text-gray-500">
                              <Hourglass size={16} /> Menunggu
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Gagal memuat data atau tidak ada data.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
