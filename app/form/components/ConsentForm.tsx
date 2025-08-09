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
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// --- PERBAIKAN: Gunakan z.boolean().refine() untuk validasi checkbox ---
const persetujuanSchema = z.object({
  persetujuan: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui pernyataan ini untuk melanjutkan.",
  }),
});

type PersetujuanFormValues = z.infer<typeof persetujuanSchema>;

type PersetujuanFormProps = {
  onSubmit: () => void;
  onBack: () => void;
};

export const ConsentForm = ({ onSubmit, onBack }: PersetujuanFormProps) => {
  const form = useForm<PersetujuanFormValues>({
    resolver: zodResolver(persetujuanSchema),
    defaultValues: {
      persetujuan: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-fade-in"
      >
        <div className="prose prose-sm max-w-none text-gray-700">
          <h3 className="text-base font-semibold text-center mb-4">
            PERNYATAAN PERSETUJUAN PEMERIKSAAN KESEHATAN
          </h3>
          <p>
            Melalui pengisian formulir MCU (Medical Check Up) secara elektronik,
            dengan ini saya menyatakan persetujuan ketentuan sebagai berikut:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Seluruh pernyataan yang saya jawab diatas adalah benar dan dapat
              dipertanggungjawabkan, apabila terdapat ketidaksesuaian dikemudian
              hari, saya bersedia diberi sanksi sesuai dengan ketentuan
              perusahaan.
            </li>
            <li>
              Saya menyetujui bahwa hasil pemeriksaan kesehatan yang telah
              dilakukan dapat disimpan dalam bentuk tertulis (hardcopy) ataupun
              elektronik (softcopy) oleh perusahaan.
            </li>
            <li>
              Saya menyetujui dan memberikan kewenangan pada staf kesehatan
              kerja perusahaan untuk melakukan analisa terkait hasil pemeriksaan
              kesehatan saya. Hal tersebut terkait kegunaan untuk dievaluasi
              berkaitan dengan pekerjaan saya diperusahaan ini.
            </li>
            <li>
              Saya memberikan wewenang bagi staf kesehatan kerja perusahaan
              untuk memberikan hasil analisa dan evaluasi pemeriksaan terhadap
              kesehatan saya kepada manajemen perusahaan agar dilakukan
              tindaklanjut berdasarkan hasil pemeriksaan kondisi fisik dan
              kesehatan saya.
            </li>
          </ol>
          <p className="mt-4">
            Demikian pernyataan persetujuan ini saya buat dengan sebenar
            benarnya dalam keadaan sadar dan tanpa ada paksaan dari pihak
            manapun.
          </p>
        </div>

        <FormField
          control={form.control}
          name="persetujuan"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Saya telah membaca, memahami, dan menyetujui semua poin
                  pernyataan di atas.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <CardFooter className="px-0 pt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-600/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Mengirim..."
              : "Kirim Semua Jawaban"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
