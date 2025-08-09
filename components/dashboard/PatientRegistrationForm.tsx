"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mcuItems = [
  { id: "pemeriksaan_fisik", label: "Pemeriksaan Fisik" },
  { id: "tes_psikologi", label: "Tes Psikologi" },
  { id: "framingham_score", label: "Framingham Score" },
  { id: "darah_lengkap", label: "Darah Lengkap" },
  { id: "hematologi", label: "Hematologi" },
  { id: "urinalisa", label: "Urinalisa" },
  { id: "kimia_darah", label: "Kimia Darah" },
  { id: "rontgen_thorax", label: "Rontgen Thorax" },
  { id: "ekg_elektrokardiogram", label: "EKG (Elektrokardiogram)" },
  { id: "treadmill", label: "Treadmill" },
  { id: "audiometri", label: "Audiometri" },
  { id: "spirometri", label: "Spirometri" },
  { id: "usg_abdomen", label: "USG Abdomen" },
  { id: "usg_mammae", label: "USG Mammae" },
];

const formSchema = z.object({
  patientId: z.string().min(1, "ID Pasien tidak boleh kosong."),
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
  email: z
    .string()
    .email({ message: "Format email tidak valid." })
    .or(z.literal(""))
    .optional(),
  dob: z
    .string()
    .refine((val) => val.length > 0, { message: "Tanggal lahir harus diisi." }),
  age: z.number().min(0, "Umur tidak boleh negatif."),
  gender: z.string().min(1, { message: "Jenis kelamin harus diisi." }),
  department: z.string().min(1, { message: "Departemen harus diisi." }),
  mcuPackage: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Anda harus memilih setidaknya satu item pemeriksaan.",
    }),
});

type PatientFormValues = z.infer<typeof formSchema>;

type PatientFormProps = {
  setOpen: (open: boolean) => void;
  companyId: string;
  onPatientAdded: () => void;
  patientToEdit?: (PatientFormValues & { id: number }) | null;
};

export const PatientRegistrationForm = ({
  setOpen,
  companyId,
  onPatientAdded,
  patientToEdit,
}: PatientFormProps) => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: `MCU-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: "",
      email: "",
      dob: "",
      age: 0,
      gender: "",
      department: "",
      mcuPackage: [],
    },
  });

  useEffect(() => {
    if (patientToEdit) {
      form.reset({
        ...patientToEdit,
        email: patientToEdit.email || "",
        dob: new Date(patientToEdit.dob).toISOString().split("T")[0],
      });
    }
  }, [patientToEdit, form]);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    form.setValue("dob", dob);
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      form.setValue("age", age >= 0 ? age : 0);
    } else {
      form.setValue("age", 0);
    }
  };

  const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
    const isEditMode = !!patientToEdit;
    const url = isEditMode
      ? `/api/patients/${patientToEdit.id}`
      : "/api/patients";
    const method = isEditMode ? "PUT" : "POST";

    const dataToSubmit = {
      ...data,
      companyId: companyId,
    };

    const promise = fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSubmit),
    }).then(async (res) => {
      const responseData = await res.json();
      if (!res.ok) {
        throw responseData;
      }
      return responseData;
    });

    toast.promise(promise, {
      loading: isEditMode
        ? "Memperbarui data pasien..."
        : "Menyimpan data pasien...",
      success: (data: { fullName: string }) => {
        setOpen(false);
        onPatientAdded();
        return `Pasien ${data.fullName} berhasil ${
          isEditMode ? "diperbarui" : "didaftarkan"
        }!`;
      },
      error: (errorData) => {
        const errors = errorData?.error;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join(", ");
          return `Gagal: ${errorMessages}`;
        }
        return (
          errorData.message || "Gagal memproses data. Cek kembali input Anda."
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Pasien (Opsional)</FormLabel>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input type="date" {...field} onChange={handleDobChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umur</FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
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
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departemen</FormLabel>
                <FormControl>
                  <Input placeholder="cth: Produksi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    render={({ field }) => (
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
                    )}
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
            disabled={form.formState.isSubmitting}
          >
            {patientToEdit ? "Simpan Perubahan" : "Simpan & Buat QR Code"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
