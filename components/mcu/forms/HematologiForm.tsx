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

export const HematologiForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pemeriksaan Hematologi - Darah Rutin</CardTitle>
        <CardDescription>
          Input hasil pemeriksaan darah lengkap sesuai dengan hasil lab.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="hemoglobin">Hemoglobin</Label>
          <Input
            id="hemoglobin"
            {...register("hemoglobin")}
            placeholder="cth: 12.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leukosit">Leukosit</Label>
          <Input
            id="leukosit"
            {...register("leukosit")}
            placeholder="cth: 6.390"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trombosit">Trombosit</Label>
          <Input
            id="trombosit"
            {...register("trombosit")}
            placeholder="cth: 283.000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hematokrit">Hematokrit</Label>
          <Input
            id="hematokrit"
            {...register("hematokrit")}
            placeholder="cth: 38.4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eritrosit">Eritrosit</Label>
          <Input
            id="eritrosit"
            {...register("eritrosit")}
            placeholder="cth: 4.44"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="led">Laju Endap Darah</Label>
          <Input id="led" {...register("led")} placeholder="cth: 12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mcv">MCV</Label>
          <Input id="mcv" {...register("mcv")} placeholder="cth: 86.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mch">MCH</Label>
          <Input id="mch" {...register("mch")} placeholder="cth: 28.3" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mchc">MCHC</Label>
          <Input id="mchc" {...register("mchc")} placeholder="cth: 32.6" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rdw">RDW</Label>
          <Input id="rdw" {...register("rdw")} placeholder="cth: 13.8" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mpv">MPV</Label>
          <Input id="mpv" {...register("mpv")} placeholder="cth: 8.4" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdw">PDW</Label>
          <Input id="pdw" {...register("pdw")} placeholder="cth: 15.7" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hitungJenisEosinofil">Eosinofil</Label>
          <Input
            id="hitungJenisEosinofil"
            {...register("hitungJenisEosinofil")}
            placeholder="cth: 4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hitungJenisBasofil">Basofil</Label>
          <Input
            id="hitungJenisBasofil"
            {...register("hitungJenisBasofil")}
            placeholder="cth: 0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hitungJenisNeutrofilStab">Neutrofil Stab</Label>
          <Input
            id="hitungJenisNeutrofilStab"
            {...register("hitungJenisNeutrofilStab")}
            placeholder="cth: 4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hitungJenisNeutrofilSegmen">Neutrofil Segmen</Label>
          <Input
            id="hitungJenisNeutrofilSegmen"
            {...register("hitungJenisNeutrofilSegmen")}
            placeholder="cth: 44"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hitungJenisLimfosit">Limfosit</Label>
          <Input
            id="hitungJenisLimfosit"
            {...register("hitungJenisLimfosit")}
            placeholder="cth: 39"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hitungJenisMonosit">Monosit</Label>
          <Input
            id="hitungJenisMonosit"
            {...register("hitungJenisMonosit")}
            placeholder="cth: 9"
          />
        </div>

        <SignatureField
          nameFieldName="hematologiValidatorName"
          qrFieldName="hematologiValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
