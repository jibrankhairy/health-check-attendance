"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";

const formSchema = z.object({
  companyName: z.string().min(3, "Nama perusahaan minimal 3 karakter."),
  companyAddress: z.string().optional(),
  hrdFullName: z.string().min(3, "Nama lengkap HRD minimal 3 karakter."),
  hrdEmail: z.string().email("Format email HRD tidak valid."),
  hrdPassword: z.string().min(8, "Password HRD minimal 8 karakter."),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCompanyForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      hrdFullName: "",
      hrdEmail: "",
      hrdPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan pada server.");
      }

      toast.success(`Perusahaan ${result.newCompany.name} berhasil dibuat!`);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Informasi Perusahaan</h3>
            <Separator className="my-2" />
          </div>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Perusahaan</FormLabel>
                <FormControl>
                  <Input placeholder="cth: PT. Sejahtera Abadi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Perusahaan (Opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Masukkan alamat lengkap perusahaan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <h3 className="text-lg font-medium">Informasi Akun Login HRD</h3>
            <Separator className="my-2" />
          </div>
          <FormField
            control={form.control}
            name="hrdFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap HRD</FormLabel>
                <FormControl>
                  <Input placeholder="cth: Siti Aisyah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hrdEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Login HRD</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="hrd@sejahtera-abadi.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hrdPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Akun HRD</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan & Buat Akun"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
