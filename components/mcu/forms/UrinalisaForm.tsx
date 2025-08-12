// components/mcu/forms/UrinalisaForm.tsx
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

export const UrinalisaForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Urin Rutin</CardTitle>
        <CardDescription>
          Input hasil pemeriksaan makroskopis dan mikroskopis urin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Makroskopis */}
        <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Makroskopis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="urinWarna">Warna</Label>
                    <Input id="urinWarna" {...register("urinWarna")} placeholder="cth: KUNING" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinKejernihan">Kejernihan</Label>
                    <Input id="urinKejernihan" {...register("urinKejernihan")} placeholder="cth: JERNIH" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinBau">Bau</Label>
                    <Input id="urinBau" {...register("urinBau")} placeholder="cth: TIDAK MENYENGAT" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinBeratJenis">Berat Jenis</Label>
                    <Input id="urinBeratJenis" {...register("urinBeratJenis")} placeholder="cth: 1.015" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinPh">pH</Label>
                    <Input id="urinPh" {...register("urinPh")} placeholder="cth: 6.5" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinProtein">Protein</Label>
                    <Input id="urinProtein" {...register("urinProtein")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinBilirubin">Bilirubin</Label>
                    <Input id="urinBilirubin" {...register("urinBilirubin")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinGlukosa">Glukosa</Label>
                    <Input id="urinGlukosa" {...register("urinGlukosa")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinUrobilinogen">Urobilinogen</Label>
                    <Input id="urinUrobilinogen" {...register("urinUrobilinogen")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinKeton">Keton</Label>
                    <Input id="urinKeton" {...register("urinKeton")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinNitrit">Nitrit</Label>
                    <Input id="urinNitrit" {...register("urinNitrit")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinLeukositEsterase">Leukosit Esterase</Label>
                    <Input id="urinLeukositEsterase" {...register("urinLeukositEsterase")} placeholder="cth: POSITIF 1 (+)" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinBlood">Blood</Label>
                    <Input id="urinBlood" {...register("urinBlood")} placeholder="cth: NEGATIF" />
                </div>
            </div>
        </div>

        {/* Mikroskopis */}
        <div>
            <h3 className="font-semibold mb-4 border-b pb-2">Mikroskopis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="urinSedimenEritrosit">Eritrosit</Label>
                    <Input id="urinSedimenEritrosit" {...register("urinSedimenEritrosit")} placeholder="cth: 1-2" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinSedimenLeukosit">Leukosit</Label>
                    <Input id="urinSedimenLeukosit" {...register("urinSedimenLeukosit")} placeholder="cth: 6-8" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinSedimenEpitel">Epitel Sel</Label>
                    <Input id="urinSedimenEpitel" {...register("urinSedimenEpitel")} placeholder="cth: 4-6" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinCaOxalat">Ca Oxalat</Label>
                    <Input id="urinCaOxalat" {...register("urinCaOxalat")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinUridAcid">Urid Acid</Label>
                    <Input id="urinUridAcid" {...register("urinUridAcid")} placeholder="cth: NEGATIF" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="urinGranulaCast">Granula Cast</Label>
                    <Input id="urinGranulaCast" {...register("urinGranulaCast")} placeholder="cth: NEGATIF" />
                </div>
            </div>
        </div>
        <SignatureField
            nameFieldName="urinalisaValidatorName"
            qrFieldName="urinalisaValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
