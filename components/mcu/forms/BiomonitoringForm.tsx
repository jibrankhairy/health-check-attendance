"use client";

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
import { SignatureField } from "./SignatureField";

export const BiomonitoringForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Biomonitoring</CardTitle>
        <CardDescription>
          Input hasil pemeriksaan Timbal (Pb) dan Arsenik (As) sesuai dengan
          hasil lab.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="timbalDarah">Timbal dalam Darah (Pb)</Label>
          <Input
            id="timbalDarah"
            {...register("timbalDarah")}
            placeholder="cth: 5.2"
            type="number"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arsenikUrin">Arsenik dalam Urin (As)</Label>
          <Input
            id="arsenikUrin"
            {...register("arsenikUrin")}
            placeholder="cth: 15.8"
            type="number"
            step="0.01"
          />
        </div>

        <div className="md:col-span-2">
          <SignatureField
            nameFieldName="biomonitoringValidatorName"
            qrFieldName="biomonitoringValidatorQr"
          />
        </div>
      </CardContent>
    </Card>
  );
};
