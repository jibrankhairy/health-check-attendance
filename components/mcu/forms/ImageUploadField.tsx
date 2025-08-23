"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  label: string;
}

export const ImageUploadField = ({ name, label }: ImageUploadFieldProps) => {
  const { setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const imageUrl = watch(name);
  const inputId = `upload-${name}`;

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
      setValue(name, result.url, { shouldValidate: true });
      toast.success(`Gambar untuk ${label} berhasil diunggah.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative aspect-square w-full">
      <Input
        id={inputId}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
        disabled={isUploading}
      />
      <Label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="object-contain w-full h-full rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 text-center p-2">
            {isUploading ? (
              <p>Uploading...</p>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-2" />
                <p className="text-sm">{label}</p>
              </>
            )}
          </div>
        )}
      </Label>
      {imageUrl && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={() => setValue(name, null, { shouldValidate: true })}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
