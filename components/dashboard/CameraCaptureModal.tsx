"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Camera,
  RefreshCcw,
  Loader2,
  UploadCloud,
  SwitchCamera,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  patient: { id: number; fullName: string } | null;
};

export const CameraCaptureModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
  patient,
}: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          const rearCamera =
            videoDevices.find((d) => d.label.toLowerCase().includes("back")) ||
            videoDevices[0];
          setSelectedDeviceId(rearCamera.deviceId);
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
        toast.error("Tidak bisa mendapatkan daftar kamera.");
      }
    };
    if (isOpen) {
      getDevices();
    }
  }, [isOpen]);

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      selectedDeviceId
    ) {
      try {
        const constraints = {
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast.error("Gagal mengakses kamera. Pastikan izin sudah diberikan.");
        onClose();
      }
    }
  }, [selectedDeviceId, onClose]);

  // 3. Hentikan stream kamera saat ini
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, selectedDeviceId]);

  const handleSwitchCamera = () => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(
        (d) => d.deviceId === selectedDeviceId
      );
      const nextIndex = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      const isFrontCamera = devices
        .find((d) => d.deviceId === selectedDeviceId)
        ?.label.toLowerCase()
        .includes("front");
      if (isFrontCamera) {
        context?.translate(canvas.width, 0);
        context?.scale(-1, 1);
      }
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/jpeg"));
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSavePhoto = async () => {
    if (!capturedImage || !patient) return;
    setIsUploading(true);

    const response = await fetch(capturedImage);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("photo", blob, "capture.jpg");

    try {
      const uploadResponse = await fetch(
        `/api/patients/${patient.id}/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Gagal mengupload foto.");
      }

      toast.success("Foto pasien berhasil disimpan!");
      onUploadSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyimpan foto.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ambil Foto Pasien</DialogTitle>
          <DialogDescription>
            Posisikan wajah pasien <strong>{patient?.fullName}</strong> di dalam
            frame.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full"
              style={{
                transform: devices
                  .find((d) => d.deviceId === selectedDeviceId)
                  ?.label.toLowerCase()
                  .includes("front")
                  ? "scaleX(-1)"
                  : "scaleX(1)",
              }}
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          {!capturedImage && devices.length > 1 && (
            <Button variant="secondary" onClick={handleSwitchCamera}>
              <SwitchCamera className="mr-2 h-4 w-4" />
              Ganti Kamera
            </Button>
          )}

          {capturedImage ? (
            <>
              <Button
                variant="outline"
                onClick={handleRetake}
                disabled={isUploading}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Ambil Ulang
              </Button>
              <Button onClick={handleSavePhoto} disabled={isUploading}>
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                {isUploading ? "Menyimpan..." : "Simpan Foto"}
              </Button>
            </>
          ) : (
            <Button onClick={handleTakePhoto} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Ambil Foto
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
