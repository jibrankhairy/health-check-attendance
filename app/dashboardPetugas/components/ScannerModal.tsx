"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { X, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

type ScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  selectedCheckPoint: string | null;
};

export const ScannerModal = ({
  isOpen,
  onClose,
  onScanSuccess,
  selectedCheckPoint,
}: ScannerModalProps) => {
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<
    string | undefined
  >();
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            setCameras(devices);
            if (!selectedCameraId) {
              setSelectedCameraId(devices[0].id);
            }
          }
        })
        .catch(() => toast.error("Tidak bisa mendapatkan daftar kamera."));
    }
  }, [isOpen, selectedCameraId]);

  useEffect(() => {
    if (isOpen && selectedCameraId) {
      isFetchingRef.current = false;
      const qrScanner = new Html5Qrcode("qr-reader-container", false);
      qrScannerRef.current = qrScanner;
      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      qrScanner
        .start(
          selectedCameraId,
          config,
          (decodedText) => {
            if (!isFetchingRef.current) {
              isFetchingRef.current = true;
              onScanSuccess(decodedText);
            }
          },
          () => {
            /* Abaikan error per frame */
          }
        )
        .catch(() =>
          toast.error("Gagal memulai kamera. Pastikan izin sudah diberikan.")
        );

      return () => {
        if (qrScannerRef.current && qrScannerRef.current.isScanning) {
          qrScannerRef.current
            .stop()
            .catch((err) => console.error("Gagal menghentikan scanner.", err));
        }
      };
    }
  }, [isOpen, selectedCameraId, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="p-6 bg-slate-50 border-b text-center">
          <p className="text-sm text-slate-500">Scan QR Code untuk Pos</p>
          <h2 className="text-2xl font-bold" style={{ color: "#01449D" }}>
            {selectedCheckPoint}
          </h2>
        </div>

        <div className="p-4 sm:p-6 bg-slate-900">
          <div
            id="qr-reader-container"
            className="w-full rounded-lg overflow-hidden relative"
          >
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="scan-line"></div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-100 border-t space-y-3">
          <div className="flex items-center gap-2 text-slate-600">
            <Video size={16} />
            <label className="text-sm font-medium">Pilih Kamera</label>
          </div>
          <Select onValueChange={setSelectedCameraId} value={selectedCameraId}>
            <SelectTrigger className="w-full bg-white border-slate-300">
              <SelectValue placeholder="Memilih kamera..." />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((camera) => (
                <SelectItem key={camera.id} value={camera.id}>
                  {camera.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
