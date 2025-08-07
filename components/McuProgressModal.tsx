"use client";

import { useEffect, useState } from "react";
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
import { CheckCircle, Hourglass } from "lucide-react";

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
  [key: string]: any;
};

const examinationMapping = [
  {
    dbKey: "pemeriksaanFisikStatus",
    petugasDbKey: "pemeriksaanFisikPetugas",
    displayName: "Pemeriksaan Fisik",
  },
  {
    dbKey: "darahLengkapStatus",
    petugasDbKey: "darahLengkapPetugas",
    displayName: "Darah Lengkap",
  },
  {
    dbKey: "kimiaDarahStatus",
    petugasDbKey: "kimiaDarahPetugas",
    displayName: "Kimia Darah",
  },
  {
    dbKey: "treadmillStatus",
    petugasDbKey: "treadmillPetugas",
    displayName: "Treadmill",
  },
  {
    dbKey: "tesPsikologiStatus",
    petugasDbKey: "tesPsikologiPetugas",
    displayName: "Tes Psikologi",
  },
  {
    dbKey: "hematologiStatus",
    petugasDbKey: "hematologiPetugas",
    displayName: "Hematologi",
  },
  {
    dbKey: "rontgenThoraxStatus",
    petugasDbKey: "rontgenThoraxPetugas",
    displayName: "Rontgen Thorax",
  },
  {
    dbKey: "audiometriStatus",
    petugasDbKey: "audiometriPetugas",
    displayName: "Audiometri",
  },
  {
    dbKey: "framinghamScoreStatus",
    petugasDbKey: "framinghamScorePetugas",
    displayName: "Framingham Score",
  },
  {
    dbKey: "urinalisaStatus",
    petugasDbKey: "urinalisaPetugas",
    displayName: "Urinalisa",
  },
  {
    dbKey: "ekgStatus",
    petugasDbKey: "ekgPetugas",
    displayName: "EKG (Elektrokardiogram)",
  },
  {
    dbKey: "spirometriStatus",
    petugasDbKey: "spirometriPetugas",
    displayName: "Spirometri",
  },
];

interface McuProgressModalProps {
  mcuResultId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function McuProgressModal({
  mcuResultId,
  isOpen,
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
        </DialogHeader>
        <div className="py-4">
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
                  {examinationMapping.map((item) => (
                    <TableRow key={item.dbKey}>
                      <TableCell className="font-medium">
                        {item.displayName}
                      </TableCell>

                      <TableCell className="text-gray-600">
                        {data[item.petugasDbKey]
                          ? data[item.petugasDbKey]
                          : "-"}
                      </TableCell>

                      <TableCell className="text-right">
                        {data[item.dbKey] === "COMPLETED" ? (
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
                  ))}
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
