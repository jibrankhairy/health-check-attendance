"use client";

import { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { mcuPackages } from "@/lib/mcu-data";

const formSchema = z.object({
  patientId: z.string().optional(),
  nik: z.string().min(1, "NIK tidak boleh kosong."),
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
  position: z.string().min(1, { message: "Posisi harus diisi." }),
  division: z.string().min(1, { message: "Divisi harus diisi." }),
  status: z.string().min(1, { message: "Status harus diisi." }),
  location: z.string().min(1, { message: "Lokasi harus diisi." }),
  selectedPackage: z.string().min(1, "Anda harus memilih satu paket MCU."),
  addOns: z.array(z.string()).optional(),
});

export type PatientFormValues = z.infer<typeof formSchema>;

type PatientToEdit = Omit<PatientFormValues, "selectedPackage" | "addOns"> & {
  id: number;
  mcuPackage: string[];
};

type UsePatientFormProps = {
  setOpen: (open: boolean) => void;
  companyId: string;
  onPatientAdded: () => void;
  patientToEdit?: PatientToEdit | null;
};

export const usePatientForm = ({
  setOpen,
  companyId,
  onPatientAdded,
  patientToEdit,
}: UsePatientFormProps) => {
  const initialValues = useMemo(() => {
    if (patientToEdit) {
      const mainPackage = mcuPackages.find((p) =>
        (patientToEdit.mcuPackage as string[]).includes(p.id)
      );
      const addOns = (patientToEdit.mcuPackage as string[]).filter(
        (item) => item !== mainPackage?.id
      );
      return {
        ...patientToEdit,
        dob: new Date(patientToEdit.dob).toISOString().split("T")[0],
        email: patientToEdit.email || "",
        selectedPackage: mainPackage?.id || "",
        addOns: addOns || [],
      };
    }
    return {
      nik: "",
      fullName: "",
      email: "",
      dob: "",
      age: 0,
      gender: "",
      position: "",
      division: "",
      status: "",
      location: "",
      selectedPackage: "",
      addOns: [],
    };
  }, [patientToEdit]);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    values: initialValues,
  });

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
      form.setValue("age", age >= 0 ? age : 0, { shouldValidate: true });
    } else {
      form.setValue("age", 0, { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
    const isEditMode = !!patientToEdit;
    const url = isEditMode
      ? `/api/patients/${patientToEdit!.id}`
      : "/api/patients";
    const method = isEditMode ? "PUT" : "POST";

    const finalMcuPackage = [data.selectedPackage, ...(data.addOns || [])];

    const dataToSubmit = {
      ...data,
      mcuPackage: finalMcuPackage,
      companyId: companyId,
    };
    delete (dataToSubmit as any).selectedPackage;
    delete (dataToSubmit as any).addOns;

    const promise = fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSubmit),
    }).then(async (res) => {
      const responseData = await res.json();
      if (!res.ok) throw responseData;
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

  const selectedPackageDetails = useMemo(() => {
    const selectedPkgId = form.watch("selectedPackage");
    return mcuPackages.find((pkg) => pkg.id === selectedPkgId)?.details || [];
  }, [form.watch("selectedPackage")]);

  return {
    form,
    onSubmit,
    handleDobChange,
    selectedPackageDetails,
  };
};
