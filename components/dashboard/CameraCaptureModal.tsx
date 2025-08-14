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
import { Camera, RefreshCcw, Loader2, UploadCloud } from "lucide-react";

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

  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast.error("Gagal mengakses kamera. Pastikan izin sudah diberikan.");
        onClose();
      }
    }
  }, [onClose]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/jpeg"));
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSavePhoto = async () => {
    if (!capturedImage || !patient) return;
    setIsUploading(true);

    const response = await fetch(capturedImage);
    const blob = await response.blob();

    try {
      const uploadResponse = await fetch(
        `/api/patients/${patient.id}/upload-photo`,
        {
          method: "POST",
          headers: { "Content-Type": "image/jpeg" },
          body: blob,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengupload foto.");
      }

      toast.success("Foto pasien berhasil disimpan!");
      onUploadSuccess();
      onClose();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan foto.");
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
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
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
