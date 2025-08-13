// components/mcu/forms/RontgenForm.tsx
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

export const RontgenForm = () => {
  const { register, setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const rontgenImage = watch("rontgenImage");

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
      setValue("rontgenImage", result.url);
      toast.success("Gambar Rontgen berhasil diunggah.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Rontgen Thorax</CardTitle>
        <CardDescription>
          Unggah gambar hasil Rontgen dan tuliskan hasil bacaannya.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="mb-4 block">Gambar Hasil Rontgen</Label>
          <div className="relative aspect-square w-full max-w-md">
            <Input
              id="rontgen-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files[0])
              }
              disabled={isUploading}
            />
            <Label
              htmlFor="rontgen-upload"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
            >
              {rontgenImage ? (
                <img
                  src={rontgenImage}
                  alt="Hasil Rontgen"
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
            {rontgenImage && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => setValue("rontgenImage", null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4 border-b pb-2">
            Hasil Pemeriksaan Dokter
          </h3>
          <div className="space-y-2">
            <Label htmlFor="kesanRontgen">Hasil Bacaan & Kesan</Label>
            <Textarea
              id="kesanRontgen"
              rows={8}
              {...register("kesanRontgen")}
              placeholder="Cor : besar dan bentuk normal...&#10;Pulmo : tak tampak infiltrat...&#10;KESAN : Cor dan pulmo tak tampak kelainan..."
            />
          </div>
        </div>
        <SignatureField
          nameFieldName="rontgenValidatorName"
          qrFieldName="rontgenValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
