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

export const KimiaDarahForm = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kimia Darah & Lainnya</CardTitle>
        <CardDescription>
          Input hasil pemeriksaan sesuai laporan lab.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gulaDarahPuasa">Gula Darah Puasa</Label>
              <Input
                id="gulaDarahPuasa"
                {...register("gulaDarahPuasa")}
                placeholder="cth: 95"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gulaDarah2JamPP">Gula Darah 2 Jam PP</Label>
              <Input
                id="gulaDarah2JamPP"
                {...register("gulaDarah2JamPP")}
                placeholder="cth: 102"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kolesterolTotal">Kolesterol Total</Label>
              <Input
                id="kolesterolTotal"
                {...register("kolesterolTotal")}
                placeholder="cth: 189"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hdl">HDL - Cholesterol</Label>
              <Input id="hdl" {...register("hdl")} placeholder="cth: 67" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ldl">LDL - Cholesterol</Label>
              <Input id="ldl" {...register("ldl")} placeholder="cth: 112" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigliserida">Trigliserida</Label>
              <Input
                id="trigliserida"
                {...register("trigliserida")}
                placeholder="cth: 72"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sgot">SGOT</Label>
              <Input id="sgot" {...register("sgot")} placeholder="cth: 22" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sgpt">SGPT</Label>
              <Input id="sgpt" {...register("sgpt")} placeholder="cth: 18" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asamUrat">Asam Urat</Label>
              <Input
                id="asamUrat"
                {...register("asamUrat")}
                placeholder="cth: 5.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ureum">Ureum</Label>
              <Input id="ureum" {...register("ureum")} placeholder="cth: 24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kreatinin">Creatinin</Label>
              <Input
                id="kreatinin"
                {...register("kreatinin")}
                placeholder="cth: 0.8"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 border-b pb-2">
            Hepatitis & Liver Function Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hbsag">Hepatitis Marker (HBsAg)</Label>
              <Input
                id="hbsag"
                {...register("hbsag")}
                placeholder="cth: NEGATIF (-)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bilirubinTotal">Bilirubin Total</Label>
              <Input
                id="bilirubinTotal"
                {...register("bilirubinTotal")}
                placeholder="cth: 0.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bilirubinDirect">Bilirubin Direct</Label>
              <Input
                id="bilirubinDirect"
                {...register("bilirubinDirect")}
                placeholder="cth: 0.15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alkaliPhosphatase">Alkali Phosphatase</Label>
              <Input
                id="alkaliPhosphatase"
                {...register("alkaliPhosphatase")}
                placeholder="cth: 143"
              />
            </div>
          </div>
        </div>
        <SignatureField
          nameFieldName="kimiaDarahValidatorName"
          qrFieldName="kimiaDarahValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
