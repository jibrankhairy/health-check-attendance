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
import { CheckCircle, Hourglass } from "lucide-react";
import { mcuPackages } from "@/lib/mcu-data";

type McuResultData = {
  patient: { fullName: string };
  pemeriksaanFisikStatus?: string;
  pemeriksaanFisikPetugas?: string;
  darahLengkapStatus?: string;
  darahLengkapPetugas?: string;
  kimiaDarahStatus?: string;
  kimiaDarahPetugas?: string;
  treadmillStatus?: string;
  treadmillPetugas?: string;
  tesPsikologiStatus?: string;
  tesPsikologiPetugas?: string;
  hematologiStatus?: string;
  hematologiPetugas?: string;
  rontgenThoraxStatus?: string;
  rontgenThoraxPetugas?: string;
  audiometriStatus?: string;
  audiometriPetugas?: string;
  framinghamScoreStatus?: string;
  framinghamScorePetugas?: string;
  urinalisaStatus?: string;
  urinalisaPetugas?: string;
  ekgStatus?: string;
  ekgPetugas?: string;
  spirometriStatus?: string;
  spirometriPetugas?: string;
  usgMammaeStatus?: string;
  usgMammaePetugas?: string;
  usgAbdomenStatus?: string;
  usgAbdomenPetugas?: string;
  [key: string]: any;
};

const examinationMap: {
  [key: string]: { dbKey: string; petugasDbKey: string };
} = {
  "Pemeriksaan fisik dan anamnesis oleh dokter MCU": {
    dbKey: "pemeriksaanFisikStatus",
    petugasDbKey: "pemeriksaanFisikPetugas",
  },
  "Pemeriksaan kebugaran": {
    dbKey: "framinghamScoreStatus",
    petugasDbKey: "framinghamScorePetugas",
  },
  "Pemeriksaan psikologis (FAS dan SDS)": {
    dbKey: "tesPsikologiStatus",
    petugasDbKey: "tesPsikologiPetugas",
  },
  "Hematologi (darah lengkap, golongan darah & rhesus)": {
    dbKey: "hematologiStatus",
    petugasDbKey: "hematologiPetugas",
  },
  "Profil lemak (kolesterol total, HDL, LDL, trigliserida)": {
    dbKey: "kimiaDarahStatus",
    petugasDbKey: "kimiaDarahPetugas",
  },
  "Panel diabetes (gula darah puasa, gula darah 2 jam PP)": {
    dbKey: "kimiaDarahStatus",
    petugasDbKey: "kimiaDarahPetugas",
  },
  "Fungsi hati (SGOT, SGPT)": {
    dbKey: "kimiaDarahStatus",
    petugasDbKey: "kimiaDarahPetugas",
  },
  "Fungsi ginjal (ureum, creatinin, asam urat)": {
    dbKey: "kimiaDarahStatus",
    petugasDbKey: "kimiaDarahPetugas",
  },
  HIV: { dbKey: "kimiaDarahStatus", petugasDbKey: "kimiaDarahPetugas" },
  "Urinalisa lengkap": {
    dbKey: "urinalisaStatus",
    petugasDbKey: "urinalisaPetugas",
  },
  "Radiologi thoraks": {
    dbKey: "rontgenThoraxStatus",
    petugasDbKey: "rontgenThoraxPetugas",
  },
  Audiometri: { dbKey: "audiometriStatus", petugasDbKey: "audiometriPetugas" },
  Spirometri: { dbKey: "spirometriStatus", petugasDbKey: "spirometriPetugas" },
  EKG: { dbKey: "ekgStatus", petugasDbKey: "ekgPetugas" },
  Treadmill: { dbKey: "treadmillStatus", petugasDbKey: "treadmillPetugas" },
  "Panel Hepatitis": {
    dbKey: "kimiaDarahStatus",
    petugasDbKey: "kimiaDarahPetugas",
  },
  "USG Whole Abdomen": {
    dbKey: "usgAbdomenStatus",
    petugasDbKey: "usgAbdomenPetugas",
  },
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
        .then((res) => res.json())
        .then((result) => {
          if (result.message) throw new Error(result.message);
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
            <p>Memuat data progres...</p>
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
                    const itemMapping = examinationMap[itemName];
                    const status = itemMapping
                      ? data[itemMapping.dbKey]
                      : undefined;
                    const petugas = itemMapping
                      ? data[itemMapping.petugasDbKey]
                      : undefined;

                    return (
                      <TableRow key={itemName}>
                        <TableCell className="font-medium">
                          {itemName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {petugas || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {status === "COMPLETED" ? (
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
