"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PatientData } from "./PatientTable";

type PreCheckFormValues = {
  kondisiKesehatan?: "BAIK" | "SEDANG" | "BURUK";
  kesadaran?: string;
  beratBadanKg?: number | "";
  tinggiBadanCm?: number | "";
  bmi?: number | "";
  lingkarPerutCm?: number | "";
  suhuC?: number | "";
  tensiSistol?: number | "";
  tensiDiastol?: number | "";
  visusOD?: string;
  visusOS?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient: PatientData | null;
};

export const PreCheckFisikModal = ({
  isOpen,
  onClose,
  onSuccess,
  patient,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, control } =
    useForm<PreCheckFormValues>();

  useEffect(() => {
    if (isOpen && patient?.mcuResults?.[0]?.pemeriksaanFisikForm) {
      const initialData = patient.mcuResults[0].pemeriksaanFisikForm;
      reset(initialData);
    } else if (isOpen) {
      reset({
        kondisiKesehatan: "BAIK",
        kesadaran: "",
        beratBadanKg: "",
        tinggiBadanCm: "",
        bmi: "",
        lingkarPerutCm: "",
        suhuC: "",
        tensiSistol: "",
        tensiDiastol: "",
        visusOD: "",
        visusOS: "",
      });
    }
  }, [isOpen, patient, reset]);

  const bb = watch("beratBadanKg");
  const tb = watch("tinggiBadanCm");

  useEffect(() => {
    const w = Number(bb);
    const hcm = Number(tb);

    if (Number.isFinite(w) && w > 0 && Number.isFinite(hcm) && hcm > 0) {
      const hm = hcm / 100;
      const calculatedBmi = parseFloat((w / (hm * hm)).toFixed(2));
      setValue("bmi", calculatedBmi, { shouldDirty: true });
    } else {
      setValue("bmi", "", { shouldDirty: true });
    }
  }, [bb, tb, setValue]);

  const handleFormSubmit = async (formData: PreCheckFormValues) => {
    if (!patient || !patient.mcuResults?.[0]?.id) {
      toast.error("ID MCU pasien tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mcu/pre-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcuResultId: patient.mcuResults[0].id,
          formData,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data.");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrasi Awal Pemeriksaan Fisik</DialogTitle>
          <DialogDescription>
            Input data awal untuk pasien{" "}
            <span className="font-semibold">{patient?.fullName}</span>. Sisa
            data akan dilengkapi oleh dokter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label>Kondisi Kesehatan</Label>
              <Controller
                name="kondisiKesehatan"
                control={control}
                defaultValue="BAIK"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BAIK" id="baik" />
                      <Label htmlFor="baik">Baik</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SEDANG" id="sedang" />
                      <Label htmlFor="sedang">Sedang</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BURUK" id="buruk" />
                      <Label htmlFor="buruk">Buruk</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kesadaran">Kesadaran Umum</Label>
              <Input
                id="kesadaran"
                placeholder="cth. Compos Mentis"
                {...register("kesadaran")}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beratBadanKg">Berat Badan (kg)</Label>
                <Input
                  id="beratBadanKg"
                  type="number"
                  step="0.1"
                  placeholder="cth. 70.5"
                  {...register("beratBadanKg", {
                    setValueAs: (v) => (v === "" ? "" : parseFloat(v)),
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tinggiBadanCm">Tinggi Badan (cm)</Label>
                <Input
                  id="tinggiBadanCm"
                  type="number"
                  placeholder="cth. 175"
                  {...register("tinggiBadanCm", {
                    setValueAs: (v) => (v === "" ? "" : parseInt(v, 10)),
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi">Body Mass Index</Label>
                <div className="relative">
                  <Input
                    id="bmi"
                    readOnly
                    tabIndex={-1}
                    className="bg-gray-100 dark:bg-gray-800"
                    {...register("bmi")}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lingkarPerutCm">Lingkar Perut (cm)</Label>
                <Input
                  id="lingkarPerutCm"
                  type="number"
                  placeholder="cth. 90"
                  {...register("lingkarPerutCm", {
                    setValueAs: (v) => (v === "" ? "" : parseInt(v, 10)),
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suhuC">Suhu Badan (°C)</Label>
                <Input
                  id="suhuC"
                  type="number"
                  step="0.1"
                  placeholder="cth. 36.5"
                  {...register("suhuC", {
                    setValueAs: (v) => (v === "" ? "" : parseFloat(v)),
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tensiSistol">Tensi Sistol (mmHg)</Label>
                <Input
                  id="tensiSistol"
                  type="number"
                  placeholder="cth. 120"
                  {...register("tensiSistol", {
                    setValueAs: (v) => (v === "" ? "" : parseInt(v, 10)),
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tensiDiastol">Tensi Diastol (mmHg)</Label>
                <Input
                  id="tensiDiastol"
                  type="number"
                  placeholder="cth. 80"
                  {...register("tensiDiastol", {
                    setValueAs: (v) => (v === "" ? "" : parseInt(v, 10)),
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visusOD">Visus — OD</Label>
                <Input
                  id="visusOD"
                  placeholder="cth. 6/38"
                  {...register("visusOD")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visusOS">Visus — OS</Label>
                <Input
                  id="visusOS"
                  placeholder="cth. 6/38"
                  {...register("visusOS")}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              className="bg-[#01449D] hover:bg-[#01449D]/90 text-white md:w-auto md:px-4"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Simpan Data Awal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
