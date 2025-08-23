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
import { ImageUploadField } from "./ImageUploadField";

export const TreadmillForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Treadmill</CardTitle>
        <CardDescription>
          Unggah 3 gambar hasil Treadmill dan tuliskan hasil bacaannya.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="mb-4 block">Gambar Hasil Treadmill</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploadField name="treadmillImage1" label="Gambar 1" />
            <ImageUploadField name="treadmillImage2" label="Gambar 2" />
            <ImageUploadField name="treadmillImage3" label="Gambar 3" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 border-b pb-2">
            Hasil Bacaan Treadmill
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="treadmillLamaLatihan">Lama Latihan</Label>
              <Input
                id="treadmillLamaLatihan"
                {...register("treadmillLamaLatihan")}
                placeholder="cth: 10 Menit 12 Detik"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treadmillKlasifikasiKebugaran">
                Klasifikasi Kebugaran Fisik
              </Label>
              <Input
                id="treadmillKlasifikasiKebugaran"
                {...register("treadmillKlasifikasiKebugaran")}
                placeholder="cth: Average"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treadmillKerjaFisik">Treadmill Kerja Fisik</Label>
              <Input
                id="treadmillKerjaFisik"
                {...register("treadmillKerjaFisik")}
                placeholder="cth: 10,2 Mets"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treadmillKelasFungsional">Kelas Fungsional</Label>
              <Input
                id="treadmillKelasFungsional"
                {...register("treadmillKelasFungsional")}
                placeholder="cth: I"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="treadmillHasilTest">Hasil Test Treadmill</Label>
              <Textarea
                id="treadmillHasilTest"
                {...register("treadmillHasilTest")}
                placeholder="cth: Negative Stress Test, dijumpai PVC"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="treadmillSaran">Saran</Label>
              <Textarea
                id="treadmillSaran"
                {...register("treadmillSaran")}
                placeholder="cth: Konsultasi dokter SpJP"
              />
            </div>
          </div>
        </div>

        <SignatureField
          nameFieldName="treadmillValidatorName"
          qrFieldName="treadmillValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
