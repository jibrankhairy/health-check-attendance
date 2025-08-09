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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const healthHistorySchema = z
  .object({
    merasaSehat: z.string().min(1, "Pilihan wajib diisi"),
    keluhanKesehatan: z.string().min(1, "Pilihan wajib diisi"),
    keluhanDetail: z.string().optional(),
    riwayatPenyakit: z.string().min(1, "Pilihan wajib diisi"),
    dirawatDiRS: z.string().optional(),
    memilikiRiwayatPenyakit: z.string().optional(),
    riwayatPenyakitDetail: z.string().optional(),
    pernahDioperasi: z.string().optional(),
    riwayatPenyakitKeluarga: z.string().min(1, "Pilihan wajib diisi"),
    riwayatPenyakitKeluargaDetail: z.string().optional(),
    makanTeratur: z.string().min(1, "Pilihan wajib diisi"),
    alkohol: z.string().min(1, "Pilihan wajib diisi"),
    rokok: z.string().min(1, "Pilihan wajib diisi"),
    rokokDetail: z.string().optional(),
    olahraga: z.string().min(1, "Pilihan wajib diisi"),
    obatDiabetes: z.string().min(1, "Pilihan wajib diisi"),
    obatHipertensi: z.string().min(1, "Pilihan wajib diisi"),
    suplemen: z.string().min(1, "Pilihan wajib diisi"),
    obatLainnya: z.string().min(1, "Pilihan wajib diisi"),
  })
  .refine(
    (data) => {
      if (data.keluhanKesehatan === "ada" && !data.keluhanDetail) return false;
      return true;
    },
    { message: "Harap sebutkan keluhan Anda.", path: ["keluhanDetail"] }
  );

export type HealthHistoryValues = z.infer<typeof healthHistorySchema>;

type HealthHistoryFormProps = {
  onNext: (data: HealthHistoryValues) => void;
  onBack: () => void;
  defaultValues: any;
};

const RadioQuestion = ({
  name,
  label,
  options,
}: {
  name: keyof HealthHistoryValues;
  label: string;
  options: string[];
}) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4 shadow-sm">
        <FormLabel className="text-sm font-normal mb-3 sm:mb-0 sm:pr-4">
          {label}
        </FormLabel>
        <FormControl>
          {/* --- PERUBAHAN DI SINI --- */}
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-wrap gap-x-4 gap-y-2 justify-start sm:justify-end sm:flex-nowrap"
          >
            {options.map((opt) => (
              <FormItem key={opt} className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem
                    value={opt.toLowerCase().replace(/\s+/g, "")}
                  />
                </FormControl>
                <FormLabel className="font-normal text-sm capitalize">
                  {opt}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
      </FormItem>
    )}
  />
);

export const HealthHistoryForm = ({
  onNext,
  onBack,
  defaultValues,
}: HealthHistoryFormProps) => {
  const form = useForm<HealthHistoryValues>({
    resolver: zodResolver(healthHistorySchema),
    defaultValues,
  });

  const watchKeluhan = form.watch("keluhanKesehatan");
  const watchRiwayatPenyakit = form.watch("riwayatPenyakit");
  const watchRiwayatKeluarga = form.watch("riwayatPenyakitKeluarga");
  const watchRokok = form.watch("rokok");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-10 animate-fade-in"
      >
        <FormField
          name="merasaSehat"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4 shadow-sm">
              <FormLabel className="text-base font-semibold">
                1. Apakah Pasien Merasa Sehat Saat Ini?
              </FormLabel>
              <FormControl className="pt-2">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="sehat" />
                    </FormControl>
                    <FormLabel className="font-normal">Sehat</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="tidak" />
                    </FormControl>
                    <FormLabel className="font-normal">Tidak</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="keluhanKesehatan"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4 shadow-sm">
              <FormLabel className="text-base font-semibold">
                2. Keluhan Kesehatan Pasien Saat Ini
              </FormLabel>
              <FormControl className="pt-2">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="ada" />
                    </FormControl>
                    <FormLabel className="font-normal">Ada</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="tidak_ada" />
                    </FormControl>
                    <FormLabel className="font-normal">Tidak Ada</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              {watchKeluhan === "ada" && (
                <FormField
                  name="keluhanDetail"
                  render={({ field }) => (
                    <FormItem className="mt-4 animate-fade-in">
                      <FormControl>
                        <Textarea
                          placeholder="Sebutkan keluhan Anda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="riwayatPenyakit"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4 shadow-sm space-y-4">
              <FormLabel className="text-base font-semibold">
                3. Riwayat Penyakit Pasien
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="ada" />
                    </FormControl>
                    <FormLabel className="font-normal">Ada</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="tidak_ada" />
                    </FormControl>
                    <FormLabel className="font-normal">Tidak Ada</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              {watchRiwayatPenyakit === "ada" && (
                <div className="pl-6 space-y-4 border-l-2 ml-2 pt-2 animate-fade-in">
                  <RadioQuestion
                    name="dirawatDiRS"
                    label="a. Dirawat di RS > 1 Minggu (Dalam 1 Tahun Terakhir)"
                    options={["Ya", "Tidak"]}
                  />
                  <RadioQuestion
                    name="memilikiRiwayatPenyakit"
                    label="b. Memiliki Riwayat Penyakit (Diabetes, Hipertensi, Asma, dll.)"
                    options={["Ya", "Tidak"]}
                  />
                  {form.watch("memilikiRiwayatPenyakit") === "ya" && (
                    <FormField
                      name="riwayatPenyakitDetail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Sebutkan penyakit..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <RadioQuestion
                    name="pernahDioperasi"
                    label="c. Pernah Dioperasi"
                    options={["Ya", "Tidak"]}
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="riwayatPenyakitKeluarga"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4 shadow-sm space-y-4">
              <FormLabel className="text-base font-semibold">
                4. Riwayat Penyakit Keluarga
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="ada" />
                    </FormControl>
                    <FormLabel className="font-normal">Ada</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="tidak_ada" />
                    </FormControl>
                    <FormLabel className="font-normal">Tidak Ada</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              {watchRiwayatKeluarga === "ada" && (
                <div className="pl-6 space-y-4 border-l-2 ml-2 pt-2 animate-fade-in">
                  <FormField
                    name="riwayatPenyakitKeluargaDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Sebutkan riwayat penyakit keluarga (Diabetes,
                          Hipertensi, Asma, dll.)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sebutkan penyakit keluarga..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border p-4 shadow-sm space-y-4">
          <h3 className="text-base font-semibold">
            5. Riwayat Kebiasaan Hidup
          </h3>
          <div className="pl-6 space-y-4 border-l-2 ml-2 pt-2">
            <RadioQuestion
              name="makanTeratur"
              label="a. Makan Teratur"
              options={["Tidak", "Kadang-kadang", "Rutin"]}
            />
            <RadioQuestion
              name="alkohol"
              label="b. Alkohol"
              options={["Tidak", "Kadang-kadang", "Rutin"]}
            />
            <RadioQuestion
              name="rokok"
              label="c. Rokok"
              options={["Tidak", "Kadang-kadang", "Rutin"]}
            />
            {watchRokok && watchRokok !== "tidak" && (
              <FormField
                name="rokokDetail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Sebutkan: ... batang/hari"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <RadioQuestion
              name="olahraga"
              label="d. Olahraga"
              options={["Tidak", "Kadang-kadang", "Rutin"]}
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 shadow-sm space-y-4">
          <h3 className="text-base font-semibold">
            6. Riwayat Konsumsi Obat-Obatan Teratur
          </h3>
          <div className="pl-6 space-y-4 border-l-2 ml-2 pt-2">
            <RadioQuestion
              name="obatDiabetes"
              label="a. Obat Diabetes"
              options={["Ada", "Tidak Ada"]}
            />
            <RadioQuestion
              name="obatHipertensi"
              label="b. Obat Hipertensi"
              options={["Ada", "Tidak Ada"]}
            />
            <RadioQuestion
              name="suplemen"
              label="c. Suplemen"
              options={["Ada", "Tidak Ada"]}
            />
            <RadioQuestion
              name="obatLainnya"
              label="d. Obat-Obatan Lainnya"
              options={["Ada", "Tidak Ada"]}
            />
          </div>
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
