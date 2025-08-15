// components/mcu/forms/FraminghamForm.tsx
"use client";

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

export const FraminghamForm = () => {
  const { control } = useFormContext(); // Kita hanya butuh 'control'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Framingham Risk Score</CardTitle>
        <CardDescription>
          Input manual data untuk kalkulasi Framingham Risk Score.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
        
        {/* Usia */}
        <FormField
          control={control}
          name="framinghamAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usia</FormLabel>
              <FormControl>
                <Input placeholder="cth: 55" type="number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jenis Kelamin */}
        <FormField
          control={control}
          name="framinghamGender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LAKI-LAKI">Laki-laki</SelectItem>
                  <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* HDL Kolesterol */}
        <FormField
          control={control}
          name="framinghamHdlCholesterol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HDL Kolesterol</FormLabel>
              <FormControl>
                <Input placeholder="cth: 50" type="number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Kolesterol */}
        <FormField
          control={control}
          name="framinghamTotalCholesterol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Kolesterol</FormLabel>
              <FormControl>
                <Input placeholder="cth: 200" type="number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Tekanan Darah Sistolik */}
        <FormField
          control={control}
          name="framinghamSystolicBp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tekanan Darah Sistolik</FormLabel>
              <FormControl>
                <Input placeholder="cth: 120" type="number" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Merokok */}
        <FormField
          control={control}
          name="framinghamIsSmoker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merokok</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        {/* Obat Hipertensi */}
        <FormField
          control={control}
          name="framinghamIsOnHypertensionTreatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mengkonsumsi Obat Hipertensi</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        
        <div /> {/* Div kosong untuk layout grid */}

        {/* Estimasi Risiko CVD (%) */}
        <FormField
          control={control}
          name="framinghamRiskPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Risiko CVD (%)</FormLabel>
              <FormControl>
                <Input placeholder="cth: 10" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Kategori Risiko */}
        <FormField
          control={control}
          name="framinghamRiskCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Risiko</FormLabel>
              <FormControl>
                <Input placeholder="cth: Rendah" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estimasi Usia Vaskular */}
        <FormField
          control={control}
          name="framinghamVascularAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Usia Vaskular</FormLabel>
              <FormControl>
                <Input placeholder="cth: 60" {...field} value={field.value || ''} />
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