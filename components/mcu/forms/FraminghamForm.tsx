"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignatureField } from "./SignatureField";

interface FraminghamFormProps {
  patientAge?: number;
  patientGender?: string;
}

export const FraminghamForm = ({}: FraminghamFormProps) => {
  const { control, setValue } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Framingham Risk Score</CardTitle>
        <CardDescription>
          Input manual data untuk kalkulasi Framingham Risk Score.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
        <FormField
          control={control}
          name="framinghamAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usia</FormLabel>
              <FormControl>
                <Input
                  placeholder="Otomatis terisi"
                  type="number"
                  {...field}
                  value={field.value || ""}
                  readOnly
                  className="bg-gray-100"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamGender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue placeholder="Otomatis terisi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamHdlCholesterol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HDL Kolesterol</FormLabel>
              <FormControl>
                <Input
                  placeholder="cth: 50"
                  type="number"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamTotalCholesterol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Kolesterol</FormLabel>
              <FormControl>
                <Input
                  placeholder="cth: 200"
                  type="number"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamSystolicBp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tekanan Darah Sistolik</FormLabel>
              <FormControl>
                <Input
                  placeholder="cth: 120"
                  type="number"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamIsSmoker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merokok</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Opsi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ya">Ya</SelectItem>
                  <SelectItem value="Tidak">Tidak</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamIsOnHypertensionTreatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mengkonsumsi Obat Hipertensi</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Opsi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ya">Ya</SelectItem>
                  <SelectItem value="Tidak">Tidak</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div />
        <FormField
          control={control}
          name="framinghamRiskPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Risiko CVD (%)</FormLabel>
              <FormControl>
                <Input
                  placeholder="cth: 10"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamRiskCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Risiko</FormLabel>
              <FormControl>
                <Input
                  placeholder="cth: Rendah"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="framinghamVascularAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Usia Vaskular</FormLabel>
              <FormControl>
                <Input
                  placeholder="cth: 60"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SignatureField
          nameFieldName="framinghamValidatorName"
          qrFieldName="framinghamValidatorQr"
        />
      </CardContent>
    </Card>
  );
};
