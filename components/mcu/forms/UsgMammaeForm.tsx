// components/mcu/forms/UsgMammaeForm.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";
import { SignatureField } from "./SignatureField";

export const UsgMammaeForm = () => {
  const { register, setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState<number | null>(null);

  const imageFields = Array.from({ length: 6 }, (_, i) => watch(`usgMammaeImage${i + 1}`));

  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return;
    setIsUploading(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal mengunggah gambar.");
      setValue(`usgMammaeImage${index + 1}`, result.url);
      toast.success(`Gambar ${index + 1} berhasil diunggah.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setValue(`usgMammaeImage${index + 1}`, null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan USG Mammae</CardTitle>
        <CardDescription>Unggah gambar hasil USG dan tuliskan laporan detailnya.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="mb-4 block">Gambar Hasil USG (Maksimal 6)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative aspect-square w-full">
                <Input id={`usg-mammae-upload-${index}`} type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], index)} disabled={!!isUploading} />
                <Label htmlFor={`usg-mammae-upload-${index}`} className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  {imageFields[index] ? <img src={imageFields[index]} alt={`USG Mammae ${index + 1}`} className="object-cover w-full h-full rounded-lg" /> : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      {isUploading === index ? <p>Uploading...</p> : <><UploadCloud className="w-8 h-8 mb-2" /><p className="text-xs text-center">Pilih Gambar</p></>}
                    </div>
                  )}
                </Label>
                {imageFields[index] && <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleRemoveImage(index)}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4 border-b pb-2">Laporan USG Mammae</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usgMammaeLaporan">Laporan USG Mammae Dextra dan Sinistra</Label>
              <Textarea id="usgMammaeLaporan" rows={8} {...register("usgMammaeLaporan")} placeholder="Intensitas echo parenchym mammae dextra dan sinistra normal..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usgMammaeKesimpulan">Kesimpulan</Label>
              <Textarea id="usgMammaeKesimpulan" {...register("usgMammaeKesimpulan")} placeholder="USG mammae dextra dan sinistra normal..." />
            </div>
          </div>
        </div>
        <SignatureField
          nameFieldName="usgMammaeValidatorName"
          qrFieldName="usgMammaeValidatorQr"
        />
      </CardContent>
    </Card>
  );
};