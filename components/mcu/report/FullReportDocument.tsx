// components/mcu/report/FullReportDocument.tsx
"use client";

import React from "react";
import { Document } from "@react-pdf/renderer";

// Import semua bagian dokumen
import { MainCoverDocument } from "./MainCoverDocument";
import { CoverPageDocument } from "./CoverPageDocument";
import { PemeriksaanFisikDocument } from "./PemeriksaanFisikDocument";
import { HealthHistoryDocument } from "./HealthHistoryDocument";
import { DassDocument } from "./DassDocument";
import { FasDocument } from "./FasDocument";
import { ConsentDocument } from "./ConsentDocument";
import { HematologiDocument } from "./HematologiDocument";
import { UrinalisaDocument } from "./UrinalisaDocument";
import { KimiaDarahDocument } from "./KimiaDarahDocument";
import { RontgenDocument } from "./RontgenDocument";
import { EkgDocument } from "./EkgDocument";
import { AudiometriDocument } from "./AudiometriDocument";
import { SpirometriDocument } from "./SpirometriDocument";
import { UsgAbdomenDocument } from "./UsgAbdomenDocument";
import { UsgMammaeDocument } from "./UsgMammaeDocument";
import { ConclusionDocument } from "./ConclusionDocument";
import { FraminghamDocument } from "./FraminghamDocument";


// Daftar kolom data untuk setiap bagian laporan
const HEMATOLOGI_FIELDS = ['hemoglobin', 'leukosit', 'trombosit', 'hematokrit', 'eritrosit', 'led', 'mcv', 'mch', 'mchc', 'rdw', 'mpv', 'pdw', 'hitungJenisEosinofil', 'hitungJenisBasofil', 'hitungJenisNeutrofilStab', 'hitungJenisNeutrofilSegmen', 'hitungJenisLimfosit', 'hitungJenisMonosit'];
const KIMIA_DARAH_FIELDS = ['gulaDarahPuasa', 'gulaDarah2JamPP', 'hbsag', 'sgot', 'sgpt', 'ureum', 'kreatinin', 'asamUrat', 'kolesterolTotal', 'trigliserida', 'hdl', 'ldl', 'bilirubinTotal', 'bilirubinDirect', 'alkaliPhosphatase'];
const URINALISA_FIELDS = ['urinWarna', 'urinKejernihan', 'urinBau', 'urinBeratJenis', 'urinPh', 'urinProtein', 'urinBilirubin', 'urinGlukosa', 'urinUrobilinogen', 'urinKeton', 'urinNitrit', 'urinLeukositEsterase', 'urinBlood', 'urinSedimenEritrosit', 'urinSedimenLeukosit', 'urinSedimenEpitel', 'urinCaOxalat', 'urinUridAcid', 'urinGranulaCast'];
const RONTGEN_FIELDS = ['kesanRontgen', 'rontgenImage'];
const EKG_FIELDS = ['ekgImage', 'ekgRhythm', 'ekgQrsRate', 'ekgAxis', 'ekgPWave', 'ekgPrInterval', 'ekgQrsDuration', 'ekgQWave', 'ekgTWave', 'ekgStChanges', 'ekgOthers', 'ekgConclusion', 'ekgAdvice'];
const AUDIOMETRI_FIELDS = ['audiometriKesimpulanTelingaKanan', 'audiometriKesimpulanTelingaKiri', 'audiometriKesimpulanUmum', 'audiometriSaran', 'audioAcKanan250'];
const SPIROMETRI_FIELDS = ['spirometriFvc', 'spirometriFev1', 'spirometriFev1Fvc', 'kesimpulanSpirometri'];
const USG_ABDOMEN_FIELDS = ['usgAbdomenHepar', 'usgAbdomenGallBladder', 'usgAbdomenLien', 'usgAbdomenPancreas', 'usgAbdomenGinjalDekstra', 'usgAbdomenGinjalSinistra', 'usgAbdomenKesimpulan'];
const USG_MAMMAE_FIELDS = ['usgMammaeLaporan', 'usgMammaeKesimpulan'];
const FRAMINGHAM_FIELDS = [
  'framinghamGender', 'framinghamAge', 'framinghamTotalCholesterol', 
  'framinghamHdlCholesterol', 'framinghamSystolicBp', 'framinghamIsOnHypertensionTreatment', 
  'framinghamIsSmoker', 'framinghamRiskPercentage', 'framinghamRiskCategory', 
  'framinghamVascularAge'
];

const sectionHasData = (data: Record<string, any>, fields: string[]): boolean => {
  return fields.some(field => data[field] != null && data[field] !== '');
};

type FullReportDocumentProps = {
  data: unknown;
};

type LocalSelectionFields = {
  patient?: {
    mcuPackage?: Array<string | number>;
  };
  pemeriksaanFisikForm?: unknown;
  dassTestAnswers?: unknown;
  fasTestAnswers?: unknown;
  formSubmittedAt?: string | Date | null;
  healthHistoryAnswers?: unknown;
  [key: string]: any;
};

export const FullReportDocument: React.FC<FullReportDocumentProps> = ({
  data,
}) => {
  const d = (data ?? {}) as LocalSelectionFields;

  const packageItemsLower: string[] = Array.isArray(d.patient?.mcuPackage)
    ? (d.patient!.mcuPackage as Array<string | number>).map((v) =>
        String(v).toLowerCase()
      )
    : [];

  const hasItem = (item: string): boolean =>
    packageItemsLower.includes(item.toLowerCase());

  const showPemeriksaanFisik = !!d.pemeriksaanFisikForm;
  
  const showHematologi =
    (hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir")) && 
    sectionHasData(d, HEMATOLOGI_FIELDS);
    
  const showKimiaDarah =
    (hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir")) &&
    sectionHasData(d, KIMIA_DARAH_FIELDS);
    
  const showUrinalisa =
    (hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir")) &&
    sectionHasData(d, URINALISA_FIELDS);

  const showRontgen =
    (hasItem("mcu regular") || hasItem("mcu eksekutif") || hasItem("mcu akhir") || hasItem("radiologi thoraks")) &&
    sectionHasData(d, RONTGEN_FIELDS);
    
  const showEkg =
    (hasItem("mcu eksekutif") || hasItem("ekg") || hasItem("treadmill")) &&
    sectionHasData(d, EKG_FIELDS);
    
  const showAudiometri = 
    (hasItem("mcu eksekutif") || hasItem("audiometri")) &&
    sectionHasData(d, AUDIOMETRI_FIELDS);
    
  const showSpirometri = 
    (hasItem("mcu eksekutif") || hasItem("spirometri")) &&
    sectionHasData(d, SPIROMETRI_FIELDS);

  const showUsgAbdomen =
    (hasItem("mcu eksekutif") || hasItem("usg whole abdomen")) &&
    sectionHasData(d, USG_ABDOMEN_FIELDS);
    
  const showUsgMammae = 
    (hasItem("mcu eksekutif") || hasItem("usg mammae")) &&
    sectionHasData(d, USG_MAMMAE_FIELDS);
    
  // =================================================================
  // === PERUBAHAN DI SINI: Cukup cek apakah datanya ada atau tidak ===
  const showFramingham = sectionHasData(d, FRAMINGHAM_FIELDS);
  // =================================================================

  const showDass = !!d.dassTestAnswers;
  const showFas = !!d.fasTestAnswers;
  const showConsent = !!d.formSubmittedAt;
  const showHealthHistory = !!d.healthHistoryAnswers;

  type MainCoverData = React.ComponentProps<typeof MainCoverDocument>["data"];
  type CoverPageData = React.ComponentProps<typeof CoverPageDocument>["data"];
  type ConsentData = React.ComponentProps<typeof ConsentDocument>["data"];
  type HealthHistoryData = React.ComponentProps<typeof HealthHistoryDocument>["data"];
  type PemeriksaanFisikData = React.ComponentProps<typeof PemeriksaanFisikDocument>["data"];
  type DassData = React.ComponentProps<typeof DassDocument>["data"];
  type FasData = React.ComponentProps<typeof FasDocument>["data"];
  type HematologiData = React.ComponentProps<typeof HematologiDocument>["data"];
  type UrinalisaData = React.ComponentProps<typeof UrinalisaDocument>["data"];
  type KimiaDarahData = React.ComponentProps<typeof KimiaDarahDocument>["data"];
  type RontgenData = React.ComponentProps<typeof RontgenDocument>["data"];
  type EkgData = React.ComponentProps<typeof EkgDocument>["data"];
  type AudiometriData = React.ComponentProps<typeof AudiometriDocument>["data"];
  type SpirometriData = React.ComponentProps<typeof SpirometriDocument>["data"];
  type UsgAbdomenData = React.ComponentProps<typeof UsgAbdomenDocument>["data"];
  type UsgMammaeData = React.ComponentProps<typeof UsgMammaeDocument>["data"];
  type ConclusionData = React.ComponentProps<typeof ConclusionDocument>["data"];
  type FraminghamData = React.ComponentProps<typeof FraminghamDocument>["data"];

  return (
    <Document>
      <MainCoverDocument data={data as MainCoverData} />
      <CoverPageDocument data={data as CoverPageData} />

      {showConsent && <ConsentDocument data={data as ConsentData} />}
      {showHealthHistory && (
        <HealthHistoryDocument data={data as HealthHistoryData} />
      )}

      {showPemeriksaanFisik && (
        <PemeriksaanFisikDocument data={data as PemeriksaanFisikData} />
      )}

      {showDass && <DassDocument data={data as DassData} />}
      {showFas && <FasDocument data={data as FasData} />}
      
      {showHematologi && <HematologiDocument data={data as HematologiData} />}
      {showUrinalisa && <UrinalisaDocument data={data as UrinalisaData} />}
      {showKimiaDarah && <KimiaDarahDocument data={data as KimiaDarahData} />}
      {showRontgen && <RontgenDocument data={data as RontgenData} />}
      {showEkg && <EkgDocument data={data as EkgData} />}
      {showAudiometri && <AudiometriDocument data={data as AudiometriData} />}
      {showSpirometri && <SpirometriDocument data={data as SpirometriData} />}
      {showUsgAbdomen && <UsgAbdomenDocument data={data as UsgAbdomenData} />}
      {showUsgMammae && <UsgMammaeDocument data={data as UsgMammaeData} />}
      {showFramingham && <FraminghamDocument data={data as FraminghamData} />}
      
      <ConclusionDocument data={data as ConclusionData} />
    </Document>
  );
};