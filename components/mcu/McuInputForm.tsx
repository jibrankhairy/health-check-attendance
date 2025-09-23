"use client";

import { useRouter } from "next/navigation";
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
import { HepatitisPanelForm } from "./forms/HepatitisPanelForm";
import { AudiometriSpirometriForm } from "./forms/AudiometriSpirometriForm";
import { UsgAbdomenForm } from "./forms/UsgAbdomenForm";
import { UsgMammaeForm } from "./forms/UsgMammaeForm";
import { EkgForm } from "./forms/EkgForm";
import { TreadmillForm } from "./forms/TreadmillForm";
import { RontgenForm } from "./forms/RontgenForm";
import { PsikologiForm } from "./forms/PsikologiForm";
import { ConclusionForm } from "./forms/ConclusionForm";
import { FraminghamForm } from "./forms/FraminghamForm";
import { calculateFraminghamRisk } from "./forms/framinghamCalculator";
import type { PemeriksaanFisikFormValues } from "@/app/dashboardPetugas/components/PemeriksaanFisikForm";
import type { HealthHistoryValues } from "@/app/form/components/HealthHistoryForm";

const formSchema = z.object({
  gologanDarah: z.string().optional().nullable(),
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
  pemeriksaanFisikForm: z.any().optional().nullable(),
  healthHistoryAnswers: z.any().optional().nullable(),

  antiHbs: z.string().optional().nullable(),

  timbalDarah: z.string().optional().nullable(),
  arsenikUrin: z.string().optional().nullable(),

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
  audiometryKesimpulanTelingaKanan: z.string().optional().nullable(),
  audiometryKesimpulanTelingaKiri: z.string().optional().nullable(),
  audiometryKesimpulanUmum: z.string().optional().nullable(),
  audiometrySaran: z.string().optional().nullable(),
  spirometryFvc: z.coerce.string().optional().nullable(),
  spirometryFev1: z.coerce.string().optional().nullable(),
  spirometryFev1Fvc: z.coerce.string().optional().nullable(),
  kesimpulanSpirometry: z.string().optional().nullable(),
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
  ekgImage1: z.string().optional().nullable(),
  ekgImage2: z.string().optional().nullable(),
  ekgImage3: z.string().optional().nullable(),
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

  treadmillImage1: z.string().optional().nullable(),
  treadmillImage2: z.string().optional().nullable(),
  treadmillImage3: z.string().optional().nullable(),
  treadmillImage4: z.string().optional().nullable(),
  treadmillLamaLatihan: z.string().optional().nullable(),
  treadmillKlasifikasiKebugaran: z.string().optional().nullable(),
  treadmillKerjaFisik: z.string().optional().nullable(),
  treadmillKelasFungsional: z.string().optional().nullable(),
  treadmillHasilTest: z.string().optional().nullable(),
  treadmillSaran: z.string().optional().nullable(),
  treadmillValidatorName: z.string().optional().nullable(),
  treadmillValidatorQr: z.string().optional().nullable(),

  rontgenImage: z.string().optional().nullable(),
  kesanRontgen: z.string().optional().nullable(),
  kesimpulan: z.string().optional().nullable(),
  saran: z.array(z.string()).optional(),

  hematologiValidatorName: z.string().optional().nullable(),
  hematologiValidatorQr: z.string().optional().nullable(),
  kimiaDarahValidatorName: z.string().optional().nullable(),
  kimiaDarahValidatorQr: z.string().optional().nullable(),
  biomonitoringValidatorName: z.string().optional().nullable(),
  biomonitoringValidatorQr: z.string().optional().nullable(),
  urinalisaValidatorName: z.string().optional().nullable(),
  urinalisaValidatorQr: z.string().optional().nullable(),
  hepatitisValidatorName: z.string().optional().nullable(),
  hepatitisValidatorQr: z.string().optional().nullable(),
  audiometryValidatorName: z.string().optional().nullable(),
  audiometryValidatorQr: z.string().optional().nullable(),
  spirometryValidatorName: z.string().optional().nullable(),
  spirometryValidatorQr: z.string().optional().nullable(),
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
      age: number;
      gender: string;
    };
  };
}

export const McuInputForm = ({ initialData }: McuInputFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id, patient, ...formValues } = initialData;

  const typedResolver: Resolver<McuFormData> = zodResolver(
    formSchema
  ) as unknown as Resolver<McuFormData>;

  const pemeriksaanFisikData =
    typeof formValues.pemeriksaanFisikForm === "string"
      ? (JSON.parse(
          formValues.pemeriksaanFisikForm
        ) as PemeriksaanFisikFormValues)
      : (formValues.pemeriksaanFisikForm as PemeriksaanFisikFormValues) || {};

  const healthHistoryData =
    typeof formValues.healthHistoryAnswers === "string"
      ? (JSON.parse(formValues.healthHistoryAnswers) as HealthHistoryValues)
      : (formValues.healthHistoryAnswers as HealthHistoryValues) || {};

  const methods = useForm<McuFormData>({
    resolver: typedResolver,
    defaultValues: {
      ...(formValues as Partial<McuFormData>),
      saran: Array.isArray(initialData.saran) ? initialData.saran : [],
      framinghamAge: String(initialData.patient.age || ""),
      framinghamGender: initialData.patient.gender || "",
      framinghamHdlCholesterol: initialData.hdl || "",
      framinghamTotalCholesterol: initialData.kolesterolTotal || "",
      framinghamSystolicBp: String(pemeriksaanFisikData?.tensiSistol || ""),
      framinghamIsSmoker:
        healthHistoryData?.rokok === "rutin" ||
        healthHistoryData?.rokok === "kadang-kadang"
          ? "Ya"
          : "Tidak",
      framinghamIsOnHypertensionTreatment:
        healthHistoryData?.obatHipertensi === "ada" ? "Ya" : "Tidak",
    },
  });

  const {
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const [
    hdl,
    kolesterolTotal,
    pemeriksaanFisik,
    healthHistory,
    framinghamAge,
    framinghamGender,
    framinghamIsSmoker,
    framinghamIsOnHypertensionTreatment,
  ] = watch([
    "hdl",
    "kolesterolTotal",
    "pemeriksaanFisikForm",
    "healthHistoryAnswers",
    "framinghamAge",
    "framinghamGender",
    "framinghamIsSmoker",
    "framinghamIsOnHypertensionTreatment",
  ]);

  useEffect(() => {
    const systolicBp = (pemeriksaanFisik as PemeriksaanFisikFormValues)
      ?.tensiSistol
      ? String((pemeriksaanFisik as PemeriksaanFisikFormValues).tensiSistol)
      : "";

    const isSmoker =
      (healthHistory as HealthHistoryValues)?.rokok === "rutin" ||
      (healthHistory as HealthHistoryValues)?.rokok === "kadang-kadang"
        ? "Ya"
        : "Tidak";

    const isOnHypertensionTreatment =
      (healthHistory as HealthHistoryValues)?.obatHipertensi === "ada"
        ? "Ya"
        : "Tidak";

    setValue("framinghamHdlCholesterol", hdl || "");
    setValue("framinghamTotalCholesterol", kolesterolTotal || "");
    setValue("framinghamSystolicBp", systolicBp);
    setValue("framinghamIsSmoker", isSmoker);
    setValue("framinghamIsOnHypertensionTreatment", isOnHypertensionTreatment);

    const data = {
      gender: framinghamGender || "",
      age: Number(framinghamAge),
      hdlCholesterol: Number(hdl),
      totalCholesterol: Number(kolesterolTotal),
      systolicBp: Number(systolicBp),
      isSmoker: isSmoker === "Ya",
      isOnHypertensionTreatment: isOnHypertensionTreatment === "Ya",
    };

    if (
      data.age &&
      data.gender &&
      !isNaN(data.hdlCholesterol) &&
      !isNaN(data.totalCholesterol) &&
      !isNaN(data.systolicBp) &&
      data.isSmoker !== undefined &&
      data.isOnHypertensionTreatment !== undefined
    ) {
      const { riskPercentage, riskCategory, vascularAge } =
        calculateFraminghamRisk(data);

      setValue("framinghamRiskPercentage", String(riskPercentage), {
        shouldValidate: true,
      });
      setValue("framinghamRiskCategory", riskCategory, {
        shouldValidate: true,
      });
      setValue("framinghamVascularAge", String(vascularAge), {
        shouldValidate: true,
      });
    } else {
      setValue("framinghamRiskPercentage", "");
      setValue("framinghamRiskCategory", "");
      setValue("framinghamVascularAge", "");
    }
  }, [
    hdl,
    kolesterolTotal,
    pemeriksaanFisik,
    healthHistory,
    framinghamAge,
    framinghamGender,
    setValue,
  ]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("VALIDATION ERRORS:", errors);
    }
  }, [errors]);

  const onSubmit = async (data: McuFormData) => {
    setIsSubmitting(true);
    const reportId = initialData.id;

    try {
      const payload = {
        ...data,
        pemeriksaanFisikForm: JSON.stringify(data.pemeriksaanFisikForm),
        healthHistoryAnswers: JSON.stringify(data.healthHistoryAnswers),
        saran: data.saran ? JSON.stringify(data.saran) : null,
      };

      const response = await fetch(`/api/mcu/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan data.");
      }

      toast.success("Hasil MCU berhasil disimpan!");

      toast.info("Memproses file PDF di latar belakang...", {
        description: "Laporan akan segera tersedia untuk diunduh.",
      });

      fetch(`/api/mcu/reports/${reportId}/generate-and-save-pdf`, {
        method: "POST",
      }).catch((err) => {
        console.error("Gagal memulai proses pembuatan PDF:", err);
      });

      router.push("/dashboard/reports");
      router.refresh();
    } catch (error) {
      let errorMessage = "Terjadi kesalahan.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error("Penyimpanan Gagal", { description: errorMessage });
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
  const showHepatitisPanel =
    hasItem("mcu regular") ||
    hasItem("mcu eksekutif") ||
    hasItem("mcu akhir") ||
    hasItem("panel hepatitis");
  const showUrinalisa =
    hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir");
  const showAudioSpiro =
    hasItem("mcu eksekutif") || hasItem("audiometry") || hasItem("spirometry");
  const showUsgAbdomen =
    hasItem("mcu eksekutif") || hasItem("usg whole abdomen");
  const showUsgMammae = hasItem("mcu eksekutif") || hasItem("usg mammae");
  const showEkg =
    hasItem("mcu eksekutif") || hasItem("ekg") || hasItem("treadmill");
  const showTreadmill =
    hasItem("mcu reguler") ||
    hasItem("mcu eksekutif") ||
    hasItem("mcu akhir") ||
    hasItem("treadmill");
  const showRontgen =
    hasItem("mcu regular") ||
    hasItem("mcu eksekutif") ||
    hasItem("mcu akhir") ||
    hasItem("radiologi thoraks");

  const showFramingham = true;

  const itemsToCheck = new Set<string>(initialData.patient.mcuPackage || []);
  if (hasItem("mcu eksekutif")) {
    itemsToCheck.add("Audiometry");
    itemsToCheck.add("Spirometry");
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
        {showHepatitisPanel && <HepatitisPanelForm />}
        {showBiomonitoring && <BiomonitoringForm />}
        {showUrinalisa && <UrinalisaForm />}
        {showAudioSpiro && (
          <AudiometriSpirometriForm itemsToCheck={itemsToCheck} />
        )}
        {showUsgAbdomen && <UsgAbdomenForm />}
        {showUsgMammae && <UsgMammaeForm />}
        {showEkg && <EkgForm />}
        {showTreadmill && <TreadmillForm />} {showRontgen && <RontgenForm />}
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
          <Button
            className="bg-[#01449D] hover:bg-[#01449D]/90 text-white md:w-auto md:px-4"
            type="submit"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan & Selesaikan Laporan"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
