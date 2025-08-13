// components/mcu/forms/PenunjangMedisForm.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SignatureField } from "./SignatureField";

// Terima props untuk menampilkan field secara dinamis
export const PenunjangMedisForm = ({
  itemsToCheck,
}: {
  itemsToCheck: Set<string>;
}) => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Penunjang Medis</CardTitle>
        <CardDescription>
          Input kesan atau hasil dari pemeriksaan radiologi, EKG, dan USG.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {itemsToCheck.has("Radiologi thoraks") && (
          <div className="space-y-2">
            <Label htmlFor="kesanRontgen">Kesan Rontgen Thorax</Label>
            <Textarea
              id="kesanRontgen"
              placeholder="Contoh: Cor dan pulmo dalam batas normal..."
              {...register("kesanRontgen")}
            />
          </div>
        )}

        {(itemsToCheck.has("EKG") || itemsToCheck.has("Treadmill")) && (
          <div className="space-y-2">
            <Label htmlFor="kesanEkg">Kesan EKG / Treadmill</Label>
            <Textarea
              id="kesanEkg"
              placeholder="Contoh: Irama sinus normal, tidak ada tanda iskemia..."
              {...register("kesanEkg")}
            />
          </div>
        )}

        {itemsToCheck.has("USG Whole Abdomen") && (
          <div className="space-y-2">
            <Label htmlFor="kesanUsgAbdomen">Kesan USG Whole Abdomen</Label>
            <Textarea
              id="kesanUsgAbdomen"
              placeholder="Contoh: Hepar, lien, dan ginjal dalam batas normal..."
              {...register("kesanUsgAbdomen")}
            />
          </div>
        )}

        {itemsToCheck.has("USG Mammae") && (
          <div className="space-y-2">
            <Label htmlFor="kesanUsgMammae">Kesan USG Mammae</Label>
            <Textarea
              id="kesanUsgMammae"
              placeholder="Contoh: Tidak tampak massa solid atau kistik yang mencurigakan..."
              {...register("kesanUsgMammae")}
            />
          </div>
        )}
        <SignatureField
          nameFieldName="hematologiValidatorName"
          qrFieldName="hematologiValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
