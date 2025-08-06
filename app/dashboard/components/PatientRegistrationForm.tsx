"use client";

import React from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";

const mcuItems = [
  { id: "pemeriksaan_fisik", label: "Pemeriksaan Fisik" },
  { id: "tes_psikologi", label: "Tes Psikologi" },
  { id: "framingham_score", label: "Framingham Score" },
  { id: "darah_lengkap", label: "Darah Lengkap" },
  { id: "hematologi", label: "Hematologi" },
  { id: "urinalisa", label: "Urinalisa" },
  { id: "kimia_darah", label: "Kimia Darah" },
  { id: "rontgen", label: "Rontgen Thorax" },
  { id: "ekg", label: "EKG (Elektrokardiogram)" },
  { id: "treadmill", label: "Treadmill" },
  { id: "audiometri", label: "Audiometri" },
  { id: "spirometri", label: "Spirometri" },
];

const formSchema = z.object({
  patientId: z.string().optional(),
  registrationDate: z.string(),
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  dob: z
    .string()
    .refine((val) => val.length > 0, { message: "Tanggal lahir harus diisi." }),
  healthHistory: z.string().optional(),
  recommendation: z.string().optional(),
  mcuPackage: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Anda harus memilih setidaknya satu item pemeriksaan.",
  }),
});

type PatientFormValues = z.infer<typeof formSchema>;

type PatientFormProps = {
  setOpen: (open: boolean) => void;
  companyId: string;
};

export const PatientRegistrationForm = ({
  setOpen,
  companyId,
}: PatientFormProps) => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: `MCU-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationDate: new Date().toISOString().split("T")[0],
      fullName: "",
      email: "",
      dob: "",
      healthHistory: "",
      recommendation: "",
      mcuPackage: [],
    },
  });

  function onSubmit(data: PatientFormValues) {
    const dataToSubmit = {
      ...data,
      companyId: companyId,
    };

    const promise = new Promise((resolve) =>
      setTimeout(() => {
        console.log("Data siap dikirim ke backend:", dataToSubmit);
        resolve({ name: data.fullName });
      }, 2000)
    );

    toast.promise(promise, {
      loading: "Menyimpan data pasien dan membuat QR Code...",
      success: (data: any) => {
        setOpen(false);
        return `Pasien ${data.name} berhasil didaftarkan! QR Code dikirim ke email.`;
      },
      error: "Gagal mendaftarkan pasien. Silakan coba lagi.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Pasien</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tgl. Registrasi</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="cth: Budi Santoso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Pasien</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Untuk mengirim QR Code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Riwayat Kesehatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="cth: Alergi obat, riwayat penyakit jantung, dll."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recommendation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kesimpulan & Rekomendasi (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Diisi oleh dokter setelah pemeriksaan selesai."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="mcuPackage"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Paket Medical Check Up
                </FormLabel>
                <FormDescription>
                  Pilih item pemeriksaan yang akan diambil.
                </FormDescription>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-50 border">
                <Checkbox
                  id="select-all"
                  onCheckedChange={(checked) => {
                    form.setValue(
                      "mcuPackage",
                      checked ? mcuItems.map((item) => item.id) : []
                    );
                  }}
                  checked={form.watch("mcuPackage").length === mcuItems.length}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none"
                >
                  Pilih Semua (Paket Lengkap)
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {mcuItems.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="mcuPackage"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        PatientFormValues,
                        "mcuPackage"
                      >;
                    }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item.id,
                                    ])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value: string) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
          >
            Simpan & Kirim QR Code
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
