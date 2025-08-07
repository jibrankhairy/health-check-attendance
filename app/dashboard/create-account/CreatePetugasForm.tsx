"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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

// Skema validasi khusus untuk form Petugas
const formSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePetugasForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: FormValues) {
    try {
      // Data yang dikirim ke API, termasuk role 'PETUGAS'
      const payload = {
        ...data,
        role: "PETUGAS",
      };
      
      // Mengirim data ke API endpoint BARU yang akan kita buat
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan pada server.");
      }

      toast.success(`Akun Petugas ${result.fullName} berhasil dibuat!`);
      form.reset(); // Reset form setelah berhasil
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="cth: Budi Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Login</FormLabel>
              <FormControl>
                <Input type="email" placeholder="petugas@klinik.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Akun</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Minimal 8 karakter" {...field} />
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
            {isSubmitting ? "Saving..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}