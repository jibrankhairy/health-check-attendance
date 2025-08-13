// components/mcu/forms/components/SignatureField.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type SignatureFieldProps = {
  nameFieldName: string;
  qrFieldName: string;
  label?: string;
};

export const SignatureField = ({
  nameFieldName,
  qrFieldName,
  label = "Nama Pemeriksa / Validator",
}: SignatureFieldProps) => {
  const { register, watch, setValue, getValues } = useFormContext();

  const initialQrValue = getValues(qrFieldName);
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrValue || "");

  const validatorName = watch(nameFieldName);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (validatorName && validatorName.trim() !== "") {
        QRCode.toDataURL(validatorName)
          .then((url) => {
            setQrCodeUrl(url);
            setValue(qrFieldName, url, {
              shouldValidate: false,
              shouldDirty: true,
            });
          })
          .catch((err) => {
            console.error("Failed to generate QR code", err);
          });
      } else {
        setQrCodeUrl("");
        setValue(qrFieldName, "", { shouldValidate: false, shouldDirty: true });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [validatorName, qrFieldName, setValue]);

  return (
    <div className="mt-6 border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor={nameFieldName}>{label}</Label>
          <Input
            id={nameFieldName}
            {...register(nameFieldName)}
            placeholder="Ketik nama lengkap..."
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="QR Code Tanda Tangan"
              width={80}
              height={80}
              className="rounded-md"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 text-center rounded-md p-2">
              QR Code akan muncul di sini
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
