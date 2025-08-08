"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const healthHistorySchema = z.object({
  asma: z.string().min(1, "Pilihan wajib diisi"),
  kencingManis: z.string().min(1, "Pilihan wajib diisi"),
  kejang: z.string().min(1, "Pilihan wajib diisi"),
  penyakitJantung: z.string().min(1, "Pilihan wajib diisi"),
  batukDarah: z.string().min(1, "Pilihan wajib diisi"),
  rheumatik: z.string().min(1, "Pilihan wajib diisi"),
  darahTinggi: z.string().min(1, "Pilihan wajib diisi"),
  darahRendah: z.string().min(1, "Pilihan wajib diisi"),
  bengkakWajahKaki: z.string().min(1, "Pilihan wajib diisi"),
  riwayatOperasi: z.string().min(1, "Pilihan wajib diisi"),
  jenisOperasi: z.string().optional(),
  obatTerusMenerus: z.string().min(1, "Pilihan wajib diisi"),
  alergi: z.string().min(1, "Pilihan wajib diisi"),
  sakitKuning: z.string().min(1, "Pilihan wajib diisi"),
  kecanduanObat: z.string().min(1, "Pilihan wajib diisi"),
  patahTulang: z.string().min(1, "Pilihan wajib diisi"),
  gangguanPendengaran: z.string().min(1, "Pilihan wajib diisi"),
  olahraga: z.string().min(1, "Pilihan wajib diisi"),
  merokok: z.string().min(1, "Pilihan wajib diisi"),
  nyeriBuangAirKecil: z.string().min(1, "Pilihan wajib diisi"),
  keputihan: z.string().min(1, "Pilihan wajib diisi"),
  epilepsi: z.string().min(1, "Pilihan wajib diisi"),
  catatanEpilepsi: z.string().optional(),
  keluhanSaatIni: z.string().optional(),
});

export type HealthHistoryValues = z.infer<typeof healthHistorySchema>;

type HealthHistoryFormProps = {
  onNext: (data: HealthHistoryValues) => void;
  onBack: () => void;
};

const healthQuestions = [
  { id: "asma", label: "Asma" },
  { id: "kencingManis", label: "Kencing Manis" },
  { id: "kejang", label: "Kejang-kejang berulang" },
  { id: "penyakitJantung", label: "Penyakit jantung" },
  { id: "batukDarah", label: "Batuk disertai dahak berdarah" },
  { id: "rheumatik", label: "Rheumatik" },
  { id: "darahTinggi", label: "Tekanan darah tinggi" },
  { id: "darahRendah", label: "Tekanan darah rendah" },
  { id: "bengkakWajahKaki", label: "Sering bengkak di wajah/kaki" },
  { id: "riwayatOperasi", label: "Riwayat operasi" },
  { id: "obatTerusMenerus", label: "Menggunakan obat tertentu terus menerus" },
  { id: "alergi", label: "Alergi" },
  { id: "sakitKuning", label: "Sakit kuning / hepatitis" },
  { id: "kecanduanObat", label: "Kecanduan obat-obatan" },
  { id: "patahTulang", label: "Patah tulang" },
  { id: "gangguanPendengaran", label: "Gangguan pendengaran" },
  { id: "olahraga", label: "Apakah Anda berolahraga teratur" },
  { id: "merokok", label: "Apakah Anda merokok" },
  { id: "nyeriBuangAirKecil", label: "Nyeri saat buang air kecil" },
  { id: "keputihan", label: "Sering keputihan (khusus wanita)" },
  { id: "epilepsi", label: "Epilepsi (ayan)" },
];

export const HealthHistoryForm = ({
  onNext,
  onBack,
}: HealthHistoryFormProps) => {
  const form = useForm<HealthHistoryValues>({
    resolver: zodResolver(healthHistorySchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-8 animate-fade-in"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {healthQuestions.map((q) => (
            <FormField
              key={q.id}
              control={form.control}
              name={q.id as keyof HealthHistoryValues}
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4 shadow-sm">
                  <FormLabel className="text-sm font-normal mb-3 sm:mb-0 sm:pr-4">
                    {q.label}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4 self-end sm:self-center"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="ya" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          Ya
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="tidak" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          Tidak
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Separator />

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="keluhanSaatIni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Keluhan yang Anda rasakan saat ini (jika ada)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contoh: Sering pusing, nyeri di bagian dada, dll."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <CardFooter className="px-0 pt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button
            type="submit"
            className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
          >
            Lanjutkan
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
