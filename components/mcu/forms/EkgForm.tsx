// components/mcu/forms/EkgForm.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { SignatureField } from "./SignatureField";
import { ImageUploadField } from "./ImageUploadField"; // Pakai komponen yang sama

export const EkgForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan EKG</CardTitle>
        <CardDescription>
          Unggah gambar hasil EKG dan tuliskan hasil bacaannya.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* === UPLOAD GAMBAR (DIUBAH) === */}
        <div>
          <Label className="mb-4 block">Gambar Hasil EKG</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploadField name="ekgImage1" label="Gambar 1" />
            <ImageUploadField name="ekgImage2" label="Gambar 2" />
            <ImageUploadField name="ekgImage3" label="Gambar 3" />
          </div>
        </div>

        {/* === HASIL BACAAN === */}
        <div>
          <h3 className="font-semibold mb-4 border-b pb-2">Hasil Bacaan EKG</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ekgRhythm">Rhythm</Label>
              <Input
                id="ekgRhythm"
                {...register("ekgRhythm")}
                placeholder="cth: Sinus Rhythm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgQrsRate">QRS Rate</Label>
              <Input
                id="ekgQrsRate"
                {...register("ekgQrsRate")}
                placeholder="cth: 64 bpm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgAxis">Axis</Label>
              <Input
                id="ekgAxis"
                {...register("ekgAxis")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgPWave">P. Wave</Label>
              <Input
                id="ekgPWave"
                {...register("ekgPWave")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgPrInterval">P. R Interval</Label>
              <Input
                id="ekgPrInterval"
                {...register("ekgPrInterval")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgQrsDuration">QRS Duration</Label>
              <Input
                id="ekgQrsDuration"
                {...register("ekgQrsDuration")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgQWave">Q. Wave</Label>
              <Input
                id="ekgQWave"
                {...register("ekgQWave")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgTWave">T. Wave</Label>
              <Input
                id="ekgTWave"
                {...register("ekgTWave")}
                placeholder="cth: Normal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ekgStChanges">ST-T Changes</Label>
              <Input
                id="ekgStChanges"
                {...register("ekgStChanges")}
                placeholder="cth: -"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ekgOthers">Others</Label>
              <Textarea
                id="ekgOthers"
                {...register("ekgOthers")}
                placeholder="cth: -"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ekgConclusion">Conclusion</Label>
              <Textarea
                id="ekgConclusion"
                {...register("ekgConclusion")}
                placeholder="cth: Normal ECG"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ekgAdvice">Advice</Label>
              <Textarea
                id="ekgAdvice"
                {...register("ekgAdvice")}
                placeholder="cth: Annual check up"
              />
            </div>
          </div>
        </div>

        <SignatureField
          nameFieldName="ekgValidatorName"
          qrFieldName="ekgValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
