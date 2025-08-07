"use client";

import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/components/context/AuthContext";
import { ScanLine, MapPin, Lock, X, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

const PetugasDashboardPage = () => {
  const { user } = useAuth();

  const [checkPoints, setCheckPoints] = useState<string[]>([]);
  const [selectedCheckPoint, setSelectedCheckPoint] = useState<string | null>(
    null
  );

  const [showScanner, setShowScanner] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(
    undefined
  );

  const qrScannerRef = useRef<Html5Qrcode | null>(null);

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

  useEffect(() => {
    const startScanner = (cameraId: string) => {
      const qrboxFunction = (
        viewfinderWidth: number,
        viewfinderHeight: number
      ) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdge * 0.7);
        return {
          width: qrboxSize,
          height: qrboxSize,
        };
      };

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: qrboxFunction,
        aspectRatio: 1.0,
      };

      if (!qrScannerRef.current) {
        qrScannerRef.current = new Html5Qrcode("qr-reader-container", false);
      }

      const qrScanner = qrScannerRef.current;

      if (qrScanner && !qrScanner.isScanning) {
        qrScanner
          .start(
            cameraId,
            config,
            (decodedText) => {
              if (qrScanner.isScanning) {
                qrScanner.stop();
              }
              handleScanResult(decodedText);
            },
            (errorMessage) => {
              console.error(errorMessage);
            }
          )
          .catch((err) => {
            toast.error("Gagal memulai kamera. Pastikan izin sudah diberikan.");
            console.error(err);
          });
      }
    };

    const stopScanner = () => {
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current
          .stop()
          .catch((err) => console.error("Gagal menghentikan scanner.", err));
      }
    };

    if (showScanner) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            setCameras(devices);
            if (!selectedCameraId) {
              setSelectedCameraId(devices[0].id);
            }
          }
        })
        .catch((err) => {
          toast.error("Tidak bisa mendapatkan daftar kamera.");
          console.error(err);
        });
    }

    if (showScanner && selectedCameraId) {
      startScanner(selectedCameraId);
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [showScanner, selectedCameraId]);

  const handleScanResult = async (mcuResultId: string) => {
    if (user && selectedCheckPoint && !isFetching) {
      setIsFetching(true);
      setShowScanner(false);
      toast.info(
        `QR terdeteksi: ${mcuResultId}. Memproses check-in untuk ${selectedCheckPoint}...`
      );

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
        if (!response.ok) {
          throw new Error(data.message || "Gagal melakukan check-in.");
        }

        toast.success(data.message);
      } catch (err: any) {
        toast.error(`Gagal: ${err.message}`);
      } finally {
        setIsFetching(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-slate-100 min-h-screen">
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
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            to right,
            transparent,
            #34d399,
            transparent
          );
          box-shadow: 0 0 10px #34d399, 0 0 20px #34d399;
          animation: scan 2.5s infinite ease-in-out;
        }
        @keyframes scan {
          0% {
            top: 10%;
          }
          50% {
            top: 90%;
          }
          100% {
            top: 10%;
          }
        }
      `}</style>

      <div
        className="relative min-h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url(/images/sampul.png)" }}
      >
        <div className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-sm" />
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
          <Toaster richColors position="top-center" />

          <Card className="w-full max-w-2xl shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md border border-white/20">
            <CardHeader className="bg-white/80 border-b border-white/20 p-6">
              <div className="flex flex-col items-center text-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName}`}
                  />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">
                    Selamat Datang, {user.fullName}!
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Anda login sebagai Petugas.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-8 md:space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-sky-600" size={24} />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800">
                    Langkah 1: Pilih Pos Anda
                  </h3>
                </div>
                <Select
                  onValueChange={setSelectedCheckPoint}
                  value={selectedCheckPoint || undefined}
                >
                  <SelectTrigger className="w-full h-14 text-base md:text-lg border-2 focus:ring-sky-500 focus:border-sky-500 rounded-xl bg-white">
                    <SelectValue placeholder="-- Klik untuk memilih Pos Pemeriksaan --" />
                  </SelectTrigger>
                  <SelectContent>
                    {checkPoints.map((point) => (
                      <SelectItem
                        key={point}
                        value={point}
                        className="text-base md:text-lg py-2"
                      >
                        {point}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ScanLine
                    className={
                      selectedCheckPoint ? "text-green-600" : "text-slate-500"
                    }
                    size={24}
                  />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800">
                    Langkah 2: Scan QR Pasien
                  </h3>
                </div>
                <Button
                  onClick={() => setShowScanner(true)}
                  disabled={!selectedCheckPoint}
                  className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 transform 
                             disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed
                             enabled:bg-green-500 enabled:hover:bg-green-600 enabled:shadow-green-500/50 enabled:hover:scale-105
                             flex items-center gap-4"
                >
                  {selectedCheckPoint ? (
                    <>
                      <ScanLine size={32} />
                      <span>Mulai Scan</span>
                    </>
                  ) : (
                    <>
                      <Lock size={28} />
                      <span>Pilih Pos Dulu</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
            <div className="relative bg-black border-4 border-slate-700 p-2 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  onClick={() => setShowScanner(false)}
                  variant="destructive"
                  size="icon"
                  className="rounded-full h-10 w-10"
                >
                  <X size={24} />
                </Button>
              </div>
              <div className="p-4 md:p-6 bg-slate-800 rounded-t-lg text-white text-center">
                <p className="text-sm text-slate-400">Scan untuk Pos</p>
                <h2 className="text-xl md:text-2xl font-bold">
                  {selectedCheckPoint}
                </h2>
              </div>
              <div className="p-4 bg-slate-900 space-y-3">
                <div className="flex items-center gap-2 text-white">
                  <Video size={16} />
                  <label className="text-sm font-medium">Pilih Kamera</label>
                </div>
                <Select
                  onValueChange={setSelectedCameraId}
                  value={selectedCameraId}
                >
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
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
              <div
                id="qr-reader-container"
                className="w-full bg-slate-900 p-2"
              ></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PetugasDashboardPage;
