"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SignatureField } from "./SignatureField";

export const PsikologiForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Validasi Hasil Tes Psikologi</CardTitle>
        <CardDescription>
          Tanda tangan digital untuk hasil tes DASS-21 dan FAS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignatureField
          nameFieldName="dassFasValidatorName"
          qrFieldName="dassFasValidatorQr"
          label="Nama Psikolog / Pemeriksa"
        />
      </CardContent>
    </Card>
  );
};
