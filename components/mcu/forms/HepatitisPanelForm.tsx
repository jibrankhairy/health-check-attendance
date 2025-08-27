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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignatureField } from "./SignatureField";

export const HepatitisPanelForm = () => {
  const { register, control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Panel Hepatitis</CardTitle>
        <CardDescription>
          Input hasil pemeriksaan HBsAg dan Anti-HBs sesuai dengan hasil lab.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="hbsag">HBsAg</Label>
          {/* Menggunakan Controller untuk komponen Select dari ShadCN/UI */}
          <Select
            onValueChange={(value) => control.setValue("hbsag", value)}
            defaultValue=""
          >
            <SelectTrigger id="hbsag">
              <SelectValue placeholder="Pilih hasil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Non-Reactive">Non-Reactive</SelectItem>
              <SelectItem value="Reactive">Reactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="antiHbs">Anti-HBs</Label>
          <Input
            id="antiHbs"
            {...register("antiHbs")}
            placeholder="cth: 150.5"
            type="number"
            step="0.01"
          />
        </div>

        <div className="md:col-span-2">
          <SignatureField
            nameFieldName="hepatitisValidatorName"
            qrFieldName="hepatitisValidatorQr"
          />
        </div>
      </CardContent>
    </Card>
  );
};