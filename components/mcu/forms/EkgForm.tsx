// components/mcu/forms/EkgForm.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";
import { SignatureField } from "./SignatureField";

export const EkgForm = () => {
  const { register, setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const ekgImage = watch("ekgImage");

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Gagal mengunggah gambar.");
      setValue("ekgImage", result.url);
      toast.success("Gambar EKG berhasil diunggah.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan EKG</CardTitle>
        <CardDescription>
          Unggah gambar hasil EKG dan tuliskan hasil bacaannya.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="mb-4 block">Gambar Hasil EKG</Label>
          <div className="relative aspect-[2/1] w-full max-w-2xl">
            <Input
              id="ekg-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files[0])
              }
              disabled={isUploading}
            />
            <Label
              htmlFor="ekg-upload"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
            >
              {ekgImage ? (
                <img
                  src={ekgImage}
                  alt="Hasil EKG"
                  className="object-contain w-full h-full rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  {isUploading ? (
                    <p>Uploading...</p>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 mb-2" />
                      <p>Pilih Gambar</p>
                    </>
                  )}
                </div>
              )}
            </Label>
            {ekgImage && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => setValue("ekgImage", null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4 border-b pb-2">Hasil Bacaan EKG</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ekgRhythm">Rhythm</Label>
              <Input
                id="ekgRhythm"
                {...register("ekgRhythm")}
                placeholder="cth: Sinus Rhythm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgQrsRate">QRS Rate</Label>
              <Input
                id="ekgQrsRate"
                {...register("ekgQrsRate")}
                placeholder="cth: 64 bpm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgAxis">Axis</Label>
              <Input
                id="ekgAxis"
                {...register("ekgAxis")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgPWave">P. Wave</Label>
              <Input
                id="ekgPWave"
                {...register("ekgPWave")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgPrInterval">P. R Interval</Label>
              <Input
                id="ekgPrInterval"
                {...register("ekgPrInterval")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgQrsDuration">QRS Duration</Label>
              <Input
                id="ekgQrsDuration"
                {...register("ekgQrsDuration")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgQWave">Q. Wave</Label>
              <Input
                id="ekgQWave"
                {...register("ekgQWave")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgTWave">T. Wave</Label>
              <Input
                id="ekgTWave"
                {...register("ekgTWave")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgStChanges">ST-T Changes</Label>
              <Input
                id="ekgStChanges"
                {...register("ekgStChanges")}
                placeholder="cth: -"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ekgOthers">Others</Label>
              <Textarea
                id="ekgOthers"
                {...register("ekgOthers")}
                placeholder="cth: -"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ekgConclusion">Conclusion</Label>
              <Textarea
                id="ekgConclusion"
                {...register("ekgConclusion")}
                placeholder="cth: Normal ECG"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ekgAdvice">Advice</Label>
              <Textarea
                id="ekgAdvice"
                {...register("ekgAdvice")}
                placeholder="cth: Annual check up"
              />
            </div>
          </div>
        </div>
        <SignatureField
          nameFieldName="ekgValidatorName"
          qrFieldName="ekgValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
