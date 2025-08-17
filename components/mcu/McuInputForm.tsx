"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";

import { HematologiForm } from "./forms/HematologiForm";
import { KimiaDarahForm } from "./forms/KimiaDarahForm";
import { BiomonitoringForm } from "./forms/BiomonitoringForm";
import { UrinalisaForm } from "./forms/UrinalisaForm";
import { AudiometriSpirometriForm } from "./forms/AudiometriSpirometriForm";
import { UsgAbdomenForm } from "./forms/UsgAbdomenForm";
import { UsgMammaeForm } from "./forms/UsgMammaeForm";
import { EkgForm } from "./forms/EkgForm";
import { RontgenForm } from "./forms/RontgenForm";
import { PsikologiForm } from "./forms/PsikologiForm";
import { ConclusionForm } from "./forms/ConclusionForm";
import { FraminghamForm } from "./forms/FraminghamForm";

const formSchema = z.object({
  hemoglobin: z.string().optional().nullable(),
  leukosit: z.string().optional().nullable(),
  trombosit: z.string().optional().nullable(),
  hematokrit: z.string().optional().nullable(),
  eritrosit: z.string().optional().nullable(),
  led: z.string().optional().nullable(),
  mcv: z.string().optional().nullable(),
  mch: z.string().optional().nullable(),
  mchc: z.string().optional().nullable(),
  rdw: z.string().optional().nullable(),
  mpv: z.string().optional().nullable(),
  pdw: z.string().optional().nullable(),
  hitungJenisEosinofil: z.string().optional().nullable(),
  hitungJenisBasofil: z.string().optional().nullable(),
  hitungJenisNeutrofilStab: z.string().optional().nullable(),
  hitungJenisNeutrofilSegmen: z.string().optional().nullable(),
  hitungJenisLimfosit: z.string().optional().nullable(),
  hitungJenisMonosit: z.string().optional().nullable(),

  // Kimia Darah fields
  gulaDarahPuasa: z.string().optional().nullable(),
  gulaDarah2JamPP: z.string().optional().nullable(),
  hbsag: z.string().optional().nullable(),
  sgot: z.string().optional().nullable(),
  sgpt: z.string().optional().nullable(),
  ureum: z.string().optional().nullable(),
  kreatinin: z.string().optional().nullable(),
  asamUrat: z.string().optional().nullable(),
  kolesterolTotal: z.string().optional().nullable(),
  trigliserida: z.string().optional().nullable(),
  hdl: z.string().optional().nullable(),
  ldl: z.string().optional().nullable(),
  bilirubinTotal: z.string().optional().nullable(),
  bilirubinDirect: z.string().optional().nullable(),
  alkaliPhosphatase: z.string().optional().nullable(),

  timbalDarah: z.string().optional().nullable(),
  arsenikUrin: z.string().optional().nullable(),

  // Urinalisa fields
  urinWarna: z.string().optional().nullable(),
  urinKejernihan: z.string().optional().nullable(),
  urinBau: z.string().optional().nullable(),
  urinBeratJenis: z.string().optional().nullable(),
  urinPh: z.string().optional().nullable(),
  urinProtein: z.string().optional().nullable(),
  urinBilirubin: z.string().optional().nullable(),
  urinGlukosa: z.string().optional().nullable(),
  urinUrobilinogen: z.string().optional().nullable(),
  urinKeton: z.string().optional().nullable(),
  urinNitrit: z.string().optional().nullable(),
  urinLeukositEsterase: z.string().optional().nullable(),
  urinBlood: z.string().optional().nullable(),
  urinSedimenEritrosit: z.string().optional().nullable(),
  urinSedimenLeukosit: z.string().optional().nullable(),
  urinSedimenEpitel: z.string().optional().nullable(),
  urinCaOxalat: z.string().optional().nullable(),
  urinUridAcid: z.string().optional().nullable(),
  urinGranulaCast: z.string().optional().nullable(),

  // ... a bunch of other fields ...
  audioAcKanan250: z.coerce.number().optional().nullable(),
  audioAcKanan500: z.coerce.number().optional().nullable(),
  audioAcKanan1000: z.coerce.number().optional().nullable(),
  audioAcKanan2000: z.coerce.number().optional().nullable(),
  audioAcKanan3000: z.coerce.number().optional().nullable(),
  audioAcKanan4000: z.coerce.number().optional().nullable(),
  audioAcKanan6000: z.coerce.number().optional().nullable(),
  audioAcKanan8000: z.coerce.number().optional().nullable(),
  audioAcKiri250: z.coerce.number().optional().nullable(),
  audioAcKiri500: z.coerce.number().optional().nullable(),
  audioAcKiri1000: z.coerce.number().optional().nullable(),
  audioAcKiri2000: z.coerce.number().optional().nullable(),
  audioAcKiri3000: z.coerce.number().optional().nullable(),
  audioAcKiri4000: z.coerce.number().optional().nullable(),
  audioAcKiri6000: z.coerce.number().optional().nullable(),
  audioAcKiri8000: z.coerce.number().optional().nullable(),
  audioBcKanan250: z.coerce.number().optional().nullable(),
  audioBcKanan500: z.coerce.number().optional().nullable(),
  audioBcKanan1000: z.coerce.number().optional().nullable(),
  audioBcKanan2000: z.coerce.number().optional().nullable(),
  audioBcKanan3000: z.coerce.number().optional().nullable(),
  audioBcKanan4000: z.coerce.number().optional().nullable(),
  audioBcKanan6000: z.coerce.number().optional().nullable(),
  audioBcKanan8000: z.coerce.number().optional().nullable(),
  audioBcKiri250: z.coerce.number().optional().nullable(),
  audioBcKiri500: z.coerce.number().optional().nullable(),
  audioBcKiri1000: z.coerce.number().optional().nullable(),
  audioBcKiri2000: z.coerce.number().optional().nullable(),
  audioBcKiri3000: z.coerce.number().optional().nullable(),
  audioBcKiri4000: z.coerce.number().optional().nullable(),
  audioBcKiri6000: z.coerce.number().optional().nullable(),
  audioBcKiri8000: z.coerce.number().optional().nullable(),
  audiometriKesimpulanTelingaKanan: z.string().optional().nullable(),
  audiometriKesimpulanTelingaKiri: z.string().optional().nullable(),
  audiometriKesimpulanUmum: z.string().optional().nullable(),
  audiometriSaran: z.string().optional().nullable(),
  spirometriFvc: z.string().optional().nullable(),
  spirometriFev1: z.string().optional().nullable(),
  spirometriFev1Fvc: z.string().optional().nullable(),
  kesimpulanSpirometri: z.string().optional().nullable(),
  usgAbdomenImage1: z.string().optional().nullable(),
  usgAbdomenImage2: z.string().optional().nullable(),
  usgAbdomenImage3: z.string().optional().nullable(),
  usgAbdomenImage4: z.string().optional().nullable(),
  usgAbdomenImage5: z.string().optional().nullable(),
  usgAbdomenImage6: z.string().optional().nullable(),
  usgAbdomenHepar: z.string().optional().nullable(),
  usgAbdomenGallBladder: z.string().optional().nullable(),
  usgAbdomenLien: z.string().optional().nullable(),
  usgAbdomenPancreas: z.string().optional().nullable(),
  usgAbdomenGinjalDekstra: z.string().optional().nullable(),
  usgAbdomenGinjalSinistra: z.string().optional().nullable(),
  usgAbdomenKesimpulan: z.string().optional().nullable(),
  usgMammaeImage1: z.string().optional().nullable(),
  usgMammaeImage2: z.string().optional().nullable(),
  usgMammaeImage3: z.string().optional().nullable(),
  usgMammaeImage4: z.string().optional().nullable(),
  usgMammaeImage5: z.string().optional().nullable(),
  usgMammaeImage6: z.string().optional().nullable(),
  usgMammaeLaporan: z.string().optional().nullable(),
  usgMammaeKesimpulan: z.string().optional().nullable(),
  ekgImage: z.string().optional().nullable(),
  ekgRhythm: z.string().optional().nullable(),
  ekgQrsRate: z.string().optional().nullable(),
  ekgAxis: z.string().optional().nullable(),
  ekgPWave: z.string().optional().nullable(),
  ekgPrInterval: z.string().optional().nullable(),
  ekgQrsDuration: z.string().optional().nullable(),
  ekgQWave: z.string().optional().nullable(),
  ekgTWave: z.string().optional().nullable(),
  ekgStChanges: z.string().optional().nullable(),
  ekgOthers: z.string().optional().nullable(),
  ekgConclusion: z.string().optional().nullable(),
  ekgAdvice: z.string().optional().nullable(),
  rontgenImage: z.string().optional().nullable(),
  kesanRontgen: z.string().optional().nullable(),
  kesimpulan: z.string().optional().nullable(),
  saran: z.array(z.string()).optional(),

  // Validator fields
  hematologiValidatorName: z.string().optional().nullable(),
  hematologiValidatorQr: z.string().optional().nullable(),
  kimiaDarahValidatorName: z.string().optional().nullable(),
  kimiaDarahValidatorQr: z.string().optional().nullable(),
  biomonitoringValidatorName: z.string().optional().nullable(),
  biomonitoringValidatorQr: z.string().optional().nullable(),
  urinalisaValidatorName: z.string().optional().nullable(),
  urinalisaValidatorQr: z.string().optional().nullable(),
  audiometriValidatorName: z.string().optional().nullable(),
  audiometriValidatorQr: z.string().optional().nullable(),
  spirometriValidatorName: z.string().optional().nullable(),
  spirometriValidatorQr: z.string().optional().nullable(),
  usgAbdomenValidatorName: z.string().optional().nullable(),
  usgAbdomenValidatorQr: z.string().optional().nullable(),
  usgMammaeValidatorName: z.string().optional().nullable(),
  usgMammaeValidatorQr: z.string().optional().nullable(),
  ekgValidatorName: z.string().optional().nullable(),
  ekgValidatorQr: z.string().optional().nullable(),
  rontgenValidatorName: z.string().optional().nullable(),
  rontgenValidatorQr: z.string().optional().nullable(),
  conclusionValidatorName: z.string().optional().nullable(),
  conclusionValidatorQr: z.string().optional().nullable(),
  dassFasValidatorName: z.string().optional().nullable(),
  dassFasValidatorQr: z.string().optional().nullable(),

  // Framingham fields
  framinghamGender: z.string().optional().nullable(),
  framinghamAge: z.string().optional().nullable(),
  framinghamTotalCholesterol: z.string().optional().nullable(),
  framinghamHdlCholesterol: z.string().optional().nullable(),
  framinghamSystolicBp: z.string().optional().nullable(),
  framinghamIsOnHypertensionTreatment: z.string().optional().nullable(),
  framinghamIsSmoker: z.string().optional().nullable(),
  framinghamRiskPercentage: z.string().optional().nullable(),
  framinghamRiskCategory: z.string().optional().nullable(),
  framinghamVascularAge: z.string().optional().nullable(),
  framinghamValidatorName: z.string().optional().nullable(),
  framinghamValidatorQr: z.string().optional().nullable(),
});

export type McuFormData = z.infer<typeof formSchema>;

interface McuInputFormProps {
  initialData: Partial<McuFormData> & {
    id: string;
    patient: {
      mcuPackage: string[];
    };
  };
}

export const McuInputForm = ({ initialData }: McuInputFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id, patient, ...formValues } = initialData;

  const typedResolver: Resolver<McuFormData> = zodResolver(
    formSchema
  ) as unknown as Resolver<McuFormData>;

  const methods = useForm<McuFormData>({
    resolver: typedResolver,
    defaultValues: {
      ...(formValues as Partial<McuFormData>),
      saran: Array.isArray(initialData.saran) ? initialData.saran : [],
    },
  });

  const {
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("VALIDATION ERRORS:", errors);
    }
  }, [errors]);

  const onSubmit = async (data: McuFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/mcu/reports/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan data.");
      }
      const updatedData = await response.json();
      toast.success("Hasil MCU berhasil disimpan!");

      if (updatedData.saran && typeof updatedData.saran === "string") {
        try {
          updatedData.saran = JSON.parse(updatedData.saran);
        } catch {
          updatedData.saran = [];
        }
      }

      methods.reset({
        ...(updatedData as Partial<McuFormData>),
        saran: updatedData.saran || [],
      });
    } catch (error) {
      let errorMessage = "Terjadi kesalahan.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        toast.error("Gagal membaca file.");
        return;
      }

      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        if (jsonData.length === 0) {
          toast.error("File Excel kosong atau format tidak sesuai.");
          return;
        }

        const importedData = jsonData[0] as Record<string, any>;
        const processedData: Partial<McuFormData> = {};

        for (const key in importedData) {
          if (Object.prototype.hasOwnProperty.call(importedData, key)) {
            (processedData as any)[key] =
              importedData[key] != null ? String(importedData[key]) : null;
          }
        }

        if (importedData.saran && typeof importedData.saran === "string") {
          processedData.saran = importedData.saran
            .split(";")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        methods.reset({ ...methods.getValues(), ...processedData });
        toast.success("Data dari Excel berhasil di-import!");
      } catch (error) {
        let errorMessage =
          "Gagal memproses file Excel. Pastikan formatnya benar.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/mcu/template");
      if (!response.ok) {
        throw new Error("Gagal mengunduh template.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template-hasil-mcu.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Template berhasil diunduh!");
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat mengunduh template.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const packageItemsLower = (initialData?.patient?.mcuPackage || []).map(
    (p: string) => p.toLowerCase()
  );
  const hasItem = (item: string) =>
    packageItemsLower.includes(item.toLowerCase());

  const showHematologi =
    hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
  const showKimiaDarah =
    hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
  const showBiomonitoring =
    hasItem("mcu regular") ||
    hasItem("mcu eksekutif") ||
    hasItem("mcu akhir") ||
    hasItem("biomonitoring");
  const showUrinalisa =
    hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
  const showAudioSpiro =
    hasItem("mcu eksekutif") || hasItem("audiometri") || hasItem("spirometri");
  const showUsgAbdomen =
    hasItem("mcu eksekutif") || hasItem("usg whole abdomen");
  const showUsgMammae = hasItem("mcu eksekutif") || hasItem("usg mammae");
  const showEkg =
    hasItem("mcu eksekutif") || hasItem("ekg") || hasItem("treadmill");
  const showRontgen =
    hasItem("mcu regular") ||
    hasItem("mcu eksekutif") ||
    hasItem("mcu akhir") ||
    hasItem("radiologi thoraks");

  const showFramingham = true;

  const itemsToCheck = new Set<string>(initialData.patient.mcuPackage || []);
  if (hasItem("mcu eksekutif")) {
    itemsToCheck.add("Audiometri");
    itemsToCheck.add("Spirometri");
  }

  return (
    <FormProvider {...methods}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".xlsx, .xls, .csv"
        style={{ display: "none" }}
      />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Input Hasil MCU</h1>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import from Excel
            </Button>
          </div>
        </div>

        <PsikologiForm />

        {showFramingham && <FraminghamForm />}

        {showHematologi && <HematologiForm />}
        {showKimiaDarah && <KimiaDarahForm />}

        {showBiomonitoring && <BiomonitoringForm />}

        {showUrinalisa && <UrinalisaForm />}
        {showAudioSpiro && (
          <AudiometriSpirometriForm itemsToCheck={itemsToCheck} />
        )}
        {showUsgAbdomen && <UsgAbdomenForm />}
        {showUsgMammae && <UsgMammaeForm />}
        {showEkg && <EkgForm />}
        {showRontgen && <RontgenForm />}

        <ConclusionForm />

        {Object.keys(errors).length > 0 && (
          <div className="p-4 my-4 border-l-4 border-red-600 bg-red-50 rounded-md">
            <h3 className="font-bold text-red-800">Error Validasi</h3>
            <p className="text-sm text-red-700 mt-1">
              Form tidak bisa disimpan karena ada data yang tidak valid.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Semua Hasil"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};