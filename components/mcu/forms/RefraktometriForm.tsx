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

export const RefraktometriForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Refraktometri</CardTitle>
        <CardDescription>
          Input hasil pemeriksaan autorefraktometer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Tabel */}
        <div className="grid grid-cols-5 text-sm font-semibold text-gray-700 border-b pb-2">
          <span className="col-span-1">Mata</span>
          <span className="col-span-1">Spheris</span>
          <span className="col-span-1">Chylinder</span>
          <span className="col-span-1">Axis</span>
          <span className="col-span-1">Add</span>
        </div>

        {/* Baris Kanan / OD */}
        <div className="grid grid-cols-5 items-center gap-2">
          <Label htmlFor="refraKananSpheris">Kanan / OD</Label>
          <Input
            id="refraKananSpheris"
            {...register("refraKananSpheris")}
            placeholder="Spheris"
          />
          <Input
            id="refraKananChylinder"
            {...register("refraKananChylinder")}
            placeholder="Chylinder"
          />
          <Input
            id="refraKananAxis"
            {...register("refraKananAxis")}
            placeholder="Axis"
          />
          <Input
            id="refraKananAdd"
            {...register("refraKananAdd")}
            placeholder="Add"
          />
        </div>

        {/* Baris Kiri / OS */}
        <div className="grid grid-cols-5 items-center gap-2">
          <Label htmlFor="refraKiriSpheris">Kiri / OS</Label>
          <Input
            id="refraKiriSpheris"
            {...register("refraKiriSpheris")}
            placeholder="Spheris"
          />
          <Input
            id="refraKiriChylinder"
            {...register("refraKiriChylinder")}
            placeholder="Chylinder"
          />
          <Input
            id="refraKiriAxis"
            {...register("refraKiriAxis")}
            placeholder="Axis"
          />
          <Input
            id="refraKiriAdd"
            {...register("refraKiriAdd")}
            placeholder="Add"
          />
        </div>

        <SignatureField
          nameFieldName="refraValidatorName"
          qrFieldName="refraValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
