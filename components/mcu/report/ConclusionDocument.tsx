"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type Range = { min?: number; max?: number };

type RefNumeric = {
  all?: Range;
  male?: Range;
  female?: Range;
  type?: undefined;
};

type RefQualitative = {
  type: "qualitative";
  normal: string[];
};

type MetricItem = {
  label: string;
  field: string;
  ref: RefNumeric | RefQualitative;
  unit: string;
};

type Summaries = {
  hematologi?: string;
  kimiaDarah?: string;
  urinRutin?: string;
  rontgen?: string;
  ekg?: string;
  mammae?: string;
  abdomen?: string;
  fisik?: string;
  audiometry?: string;
  spirometry?: string;
  treadmill?: string;
  biomonitoring?: string;
  hepatitis?: string;
  refraktometri?: string;
};

type ConclusionData = {
  patient?: { gender?: string; mcuPackage?: string[] } | null;
  saran?: string | string[] | null;
  kesimpulan?: string | null;

  conclusionValidatorName?: string | null;
  conclusionValidatorQr?: string | null;

  kesanRontgen?: string | null;
  ekgConclusion?: string | null;
  usgMammaeKesimpulan?: string | null;
  usgAbdomenKesimpulan?: string | null;
  audiometryKesimpulanUmum?: string | null;
  kesimpulanSpirometry?: string | null;
  treadmillHasilTest?: string | null;
  refraKananSpheris?: string | null;
  refraKiriSpheris?: string | null;
  timbalDarah?: string | null;
  hbsag?: string | null;
} & Record<string, unknown>;

const hematologyDataMap: MetricItem[] = [
  {
    label: "HEMOGLOBIN",
    field: "hemoglobin",
    ref: { male: { min: 14.0, max: 17.4 }, female: { min: 12.0, max: 14.0 } },
    unit: "g/dL",
  },
  {
    label: "LEUKOSIT",
    field: "leukosit",
    ref: { all: { min: 4000, max: 10000 } },
    unit: "Sel/µL",
  },
  {
    label: "TROMBOSIT",
    field: "trombosit",
    ref: { all: { min: 150000, max: 450000 } },
    unit: "Sel/µL",
  },
  {
    label: "HEMATOKRIT",
    field: "hematokrit",
    ref: { all: { min: 40.0, max: 54.0 } },
    unit: "%",
  },
  {
    label: "ERITROSIT",
    field: "eritrosit",
    ref: { all: { min: 4.0, max: 6.1 } },
    unit: "10⁶/µL",
  },
  {
    label: "MCV",
    field: "mcv",
    ref: { all: { min: 80.0, max: 96.0 } },
    unit: "fl",
  },
  {
    label: "MCH",
    field: "mch",
    ref: { all: { min: 27.0, max: 31.0 } },
    unit: "pg",
  },
  {
    label: "MCHC",
    field: "mchc",
    ref: { all: { min: 30.0, max: 34.0 } },
    unit: "g/dL",
  },
  {
    label: "RDW",
    field: "rdw",
    ref: { all: { min: 10.0, max: 15.0 } },
    unit: "%",
  },
  {
    label: "MPV",
    field: "mpv",
    ref: { all: { min: 6.5, max: 11.0 } },
    unit: "fl",
  },
  {
    label: "PDW",
    field: "pdw",
    ref: { all: { min: 10.0, max: 18.0 } },
    unit: "fl",
  },
  {
    label: "EOSINOFIL",
    field: "hitungJenisEosinofil",
    ref: { all: { min: 1, max: 3 } },
    unit: "%",
  },
  {
    label: "BASOFIL",
    field: "hitungJenisBasofil",
    ref: { all: { min: 0, max: 1 } },
    unit: "%",
  },
  {
    label: "NEUTROFIL STAB",
    field: "hitungJenisNeutrofilStab",
    ref: { all: { min: 3, max: 5 } },
    unit: "%",
  },
  {
    label: "NEUTROFIL SEGMEN",
    field: "hitungJenisNeutrofilSegmen",
    ref: { all: { min: 25, max: 60 } },
    unit: "%",
  },
  {
    label: "LIMFOSIT",
    field: "hitungJenisLimfosit",
    ref: { all: { min: 20, max: 40 } },
    unit: "%",
  },
  {
    label: "MONOSIT",
    field: "hitungJenisMonosit",
    ref: { all: { min: 4, max: 8 } },
    unit: "%",
  },
  {
    label: "LAJU ENDAP DARAH",
    field: "led",
    ref: { all: { min: 0, max: 15 } },
    unit: "mm/jam",
  },
];

const kimiaDarahDataMap: MetricItem[] = [
  {
    label: "GULA DARAH - PUASA",
    field: "gulaDarahPuasa",
    ref: { all: { min: 75, max: 115 } },
    unit: "mg/dL",
  },
  {
    label: "GULA DARAH - 2 JAM PP",
    field: "gulaDarah2JamPP",
    ref: { all: { max: 140 } },
    unit: "mg/dL",
  },
  {
    label: "CHOLESTEROL TOTAL",
    field: "kolesterolTotal",
    ref: { all: { max: 200 } },
    unit: "mg/dL",
  },
  {
    label: "HDL - CHOLESTEROL",
    field: "hdl",
    ref: { all: { min: 45 } },
    unit: "mg/dL",
  },
  {
    label: "LDL - CHOLESTEROL",
    field: "ldl",
    ref: { all: { max: 130 } },
    unit: "mg/dL",
  },
  {
    label: "TRIGLISERIDA",
    field: "trigliserida",
    ref: { all: { max: 150 } },
    unit: "mg/dL",
  },
  { label: "SGOT", field: "sgot", ref: { all: { max: 40 } }, unit: "U/L" },
  { label: "SGPT", field: "sgpt", ref: { all: { max: 41 } }, unit: "U/L" },
  {
    label: "ASAM URAT",
    field: "asamUrat",
    ref: { male: { min: 3.4, max: 7.0 }, female: { min: 2.4, max: 5.7 } },
    unit: "mg/dL",
  },
  {
    label: "UREUM",
    field: "ureum",
    ref: { all: { min: 10, max: 50 } },
    unit: "mg/dL",
  },
  {
    label: "CREATININ",
    field: "kreatinin",
    ref: { all: { min: 0.5, max: 1.5 } },
    unit: "mg/dL",
  },
  {
    label: "HbsAg",
    field: "hbsag",
    ref: { type: "qualitative", normal: ["negatif"] },
    unit: "",
  },
];

const urinalisaDataMap: MetricItem[] = [
  {
    label: "BERAT JENIS",
    field: "urinBeratJenis",
    ref: { all: { min: 1.001, max: 1.035 } },
    unit: "",
  },
  {
    label: "PH",
    field: "urinPh",
    ref: { all: { min: 4.5, max: 8.0 } },
    unit: "",
  },
  {
    label: "PROTEIN",
    field: "urinProtein",
    ref: { type: "qualitative", normal: ["negatif"] },
    unit: "mg/dL",
  },
  {
    label: "GLUKOSA",
    field: "urinGlukosa",
    ref: { type: "qualitative", normal: ["negatif"] },
    unit: "mg/dL",
  },
  {
    label: "LEUKOSIT ESTERASE",
    field: "urinLeukositEsterase",
    ref: { type: "qualitative", normal: ["negatif"] },
    unit: "/µL",
  },
  {
    label: "BLOOD",
    field: "urinBlood",
    ref: { type: "qualitative", normal: ["negatif"] },
    unit: "mg/dL",
  },
  {
    label: "ERITROSIT",
    field: "urinSedimenEritrosit",
    ref: { all: { min: 0, max: 2 } },
    unit: "/LPB",
  },
  {
    label: "LEUKOSIT",
    field: "urinSedimenLeukosit",
    ref: { all: { min: 0, max: 5 } },
    unit: "/LPB",
  },
  {
    label: "EPITEL SEL",
    field: "urinSedimenEpitel",
    ref: { all: { max: 10 } },
    unit: "/LPK",
  },
];

const isQualitative = (
  ref: RefNumeric | RefQualitative
): ref is RefQualitative => (ref as RefQualitative).type === "qualitative";

const isAbnormal = (
  item: MetricItem,
  resultValue: unknown,
  gender?: unknown
): boolean => {
  if (resultValue == null || resultValue === "" || !item.ref) return false;

  if (isQualitative(item.ref)) {
    const lower = String(resultValue).toLowerCase();
    return !item.ref.normal.map((n) => n.toLowerCase()).includes(lower);
  }

  const num = Number(resultValue as any);
  if (!Number.isFinite(num)) return false;

  let range: Range | undefined = item.ref.all;
  const g = String(gender ?? "").toUpperCase();
  if ((item.ref as RefNumeric).male && g === "LAKI-LAKI")
    range = (item.ref as RefNumeric).male;
  else if ((item.ref as RefNumeric).female && g === "PEREMPUAN")
    range = (item.ref as RefNumeric).female;

  if (!range) return false;
  const { min, max } = range;
  return (min !== undefined && num < min) || (max !== undefined && num > max);
};

const summarizeResults = (data: ConclusionData): Summaries => {
  const gender = data?.patient?.gender;
  const mcuPackage = (data?.patient?.mcuPackage || []).map((p) =>
    p.toLowerCase()
  );
  const has = (s: string) => mcuPackage.includes(s.toLowerCase());

  const hasBasicMcu =
    has("mcu regular") ||
    has("mcu eksekutif") ||
    has("mcu akhir") ||
    has("mcu dmc");

  const summaries: Summaries = {};

  const getAbnormalFindings = (dataMap: MetricItem[]): string | undefined => {
    const abnormalResults = dataMap
      .map((item) => {
        const resultValue = (data as Record<string, unknown>)?.[item.field];
        if (isAbnormal(item, resultValue, gender)) {
          const unitText = item.unit ? ` ${item.unit}` : "";
          return `- ${item.label}: ${String(resultValue)}${unitText}`;
        }
        return null;
      })
      .filter((v): v is string => Boolean(v));
    return abnormalResults.length > 0 ? abnormalResults.join("\n") : "NORMAL";
  };

  summaries.fisik = "NORMAL";

  if (hasBasicMcu) {
    summaries.hematologi = getAbnormalFindings(hematologyDataMap);
    summaries.kimiaDarah = getAbnormalFindings(kimiaDarahDataMap);
    summaries.urinRutin = getAbnormalFindings(urinalisaDataMap);
  }
  if (has("biomonitoring")) {
    const resultValue = data.timbalDarah;
    if (resultValue && resultValue !== "NORMAL") {
      summaries.biomonitoring = String(resultValue);
    } else {
      summaries.biomonitoring = "NORMAL";
    }
  }
  if (has("panel hepatitis")) {
    const resultValue = data.hbsag;
    if (resultValue && resultValue.toLowerCase() !== "negatif") {
      summaries.hepatitis = String(resultValue);
    } else {
      summaries.hepatitis = "NORMAL";
    }
  }

  const desc = (v: unknown): string | undefined =>
    !v || String(v).toLowerCase().includes("normal") ? "NORMAL" : String(v);

  if (has("radiologi thoraks") || hasBasicMcu)
    summaries.rontgen = desc(data?.kesanRontgen);
  if (has("ekg") || has("mcu eksekutif"))
    summaries.ekg = desc(data?.ekgConclusion);
  if (has("usg mammae") || has("mcu eksekutif"))
    summaries.mammae = desc(data?.usgMammaeKesimpulan);
  if (has("usg whole abdomen") || has("mcu eksekutif"))
    summaries.abdomen = desc(data?.usgAbdomenKesimpulan);
  if (has("audiometry") || has("mcu eksekutif"))
    summaries.audiometry = desc(data?.audiometryKesimpulanUmum);
  if (has("spirometry") || has("mcu eksekutif"))
    summaries.spirometry = desc(data?.kesimpulanSpirometry);
  if (has("treadmill") || has("mcu eksekutif"))
    summaries.treadmill = desc(data?.treadmillHasilTest);
  if (has("refraktometri")) {
    if (data.refraKananSpheris || data.refraKiriSpheris) {
      summaries.refraktometri = "Lihat lampiran hasil refraktometri.";
    } else {
      summaries.refraktometri = "NORMAL";
    }
  }

  return summaries;
};

const ConclusionRow: React.FC<{
  number: number;
  label: string;
  value: string | number;
}> = ({ number, label, value }) => {
  const lines = String(value).split("\n");
  return (
    <View style={localStyles.row}>
      <Text style={localStyles.num}>{number}.</Text>
      <Text style={localStyles.labelDynamic}>{label}</Text>
      <Text style={localStyles.colon}>:</Text>
      <View style={localStyles.valueFlex}>
        {lines.map((line, idx) => (
          <Text
            key={idx}
            style={
              idx < lines.length - 1
                ? [localStyles.valueLine, localStyles.mb1]
                : localStyles.valueLine
            }
          >
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
};

export const ConclusionDocument: React.FC<{ data: ConclusionData }> = ({
  data,
}) => {
  const summaries = summarizeResults(data);
  const mcuPackage = (data?.patient?.mcuPackage || []).map((p) =>
    p.toLowerCase()
  );
  const has = (s: string) => mcuPackage.includes(s.toLowerCase());
  const hasBasicMcu =
    has("mcu regular") ||
    has("mcu eksekutif") ||
    has("mcu akhir") ||
    has("mcu dmc");

  let saranList: string[] = [];
  if (data?.saran && typeof data.saran === "string") {
    try {
      saranList = JSON.parse(data.saran);
    } catch {
      saranList = [];
    }
  } else if (Array.isArray(data?.saran)) {
    saranList = data.saran as string[];
  }

  const hasSignature = !!(
    data?.conclusionValidatorName || data?.conclusionValidatorQr
  );

  const reportItems = [
    { label: "Pemeriksaan Fisik", value: summaries.fisik, required: true },
    {
      label: "Lab - Hematologi Darah Rutin",
      value: summaries.hematologi,
      required: hasBasicMcu,
    },
    {
      label: "Lab - Hasil Kimia Darah",
      value: summaries.kimiaDarah,
      required: hasBasicMcu,
    },
    {
      label: "Lab - Urin Rutin",
      value: summaries.urinRutin,
      required: hasBasicMcu,
    },
    {
      label: "Lab - Biomonitoring",
      value: summaries.biomonitoring,
      required: has("biomonitoring"),
    },
    {
      label: "Lab - Panel Hepatitis",
      value: summaries.hepatitis,
      required: has("panel hepatitis"),
    },
    {
      label: "Pemeriksaan Rontgen Thorax",
      value: summaries.rontgen,
      required: has("radiologi thoraks") || hasBasicMcu,
    },
    {
      label: "Pemeriksaan EKG",
      value: summaries.ekg,
      required: has("ekg") || has("mcu eksekutif"),
    },
    {
      label: "Pemeriksaan Treadmill",
      value: summaries.treadmill,
      required: has("treadmill") || has("mcu eksekutif"),
    },
    {
      label: "Pemeriksaan Audiometri",
      value: summaries.audiometry,
      required: has("audiometry") || has("mcu eksekutif"),
    },
    {
      label: "Pemeriksaan Spirometri",
      value: summaries.spirometry,
      required: has("spirometry") || has("mcu eksekutif"),
    },
    {
      label: "Pemeriksaan USG Abdomen",
      value: summaries.abdomen,
      required: has("usg whole abdomen") || has("mcu eksekutif"),
    },
    {
      label: "Pemeriksaan Mammae",
      value: summaries.mammae,
      required: has("usg mammae") || has("mcu eksekutif"),
    },
    {
      label: "Pemeriksaan Refraktometri",
      value: summaries.refraktometri,
      required: has("refraktometri"),
    },
  ].filter((item) => item.required && item.value !== undefined);

  return (
    <Page size="A4" style={{ ...globalStyles.page, paddingTop: 120 }}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={globalStyles.mainTitle}>KESIMPULAN DAN REKOMENDASI</Text>

        <View style={globalStyles.conclusionContainer}>
          <Text style={globalStyles.sectionTitle}>
            RESUME HASIL PEMERIKSAAN SEBAGAI BERIKUT :
          </Text>
          <View style={{ gap: 6 }}>
            {reportItems.map((item, index) => (
              <ConclusionRow
                key={item.label}
                number={index + 1}
                label={item.label}
                value={item.value || "TIDAK ADA"}
              />
            ))}
          </View>
        </View>

        <View style={globalStyles.conclusionContainer}>
          <Text style={globalStyles.sectionTitle}>
            DARI HASIL PEMERIKSAAN DI ATAS, MAKA DAPAT DISIMPULKAN BAHWA KONDISI
            PASIEN:
          </Text>
          <View style={globalStyles.conclusionBox}>
            <Text style={globalStyles.conclusionText}>
              {data?.kesimpulan || "FIT TO WORK"}
            </Text>
          </View>
        </View>

        <View style={globalStyles.conclusionContainer}>
          <Text style={globalStyles.sectionTitle}>
            SARAN YANG DAPAT DIBERIKAN:
          </Text>

          <View style={localStyles.saranRow}>
            <View style={[localStyles.saranCol, { width: "100%" }]}>
              {saranList.length > 0 ? (
                saranList.map((saran, idx) => (
                  <Text key={idx} style={localStyles.saranItem}>
                    - {saran}
                  </Text>
                ))
              ) : (
                <Text style={localStyles.saranItem}>
                  Tidak ada saran tambahan.
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {hasSignature && (
        <View style={localStyles.validatorBox}>
          {data?.conclusionValidatorQr && (
            <Image
              src={data.conclusionValidatorQr as string}
              style={localStyles.validatorQr}
            />
          )}
          {data?.conclusionValidatorName && (
            <Text style={localStyles.validatorName}>
              {data.conclusionValidatorName as string}
            </Text>
          )}
          <Text style={localStyles.validatorLabel}>Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};

const localStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    fontSize: 9,
  },
  num: {
    width: "5%",
  },
  labelDynamic: {
    width: "40%",
  },
  colon: {
    width: 8,
    textAlign: "center",
  },
  valueFlex: {
    flex: 1,
    flexDirection: "column",
  },

  valueLine: {
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
    fontSize: 9,
  },
  mb1: { marginBottom: 1 },

  saranItem: { marginBottom: 3, fontSize: 9 },
  saranRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  saranCol: { paddingRight: 6 },

  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 72,
    alignItems: "center",
  },
  validatorQr: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  validatorName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  validatorLabel: {
    fontSize: 5,
  },
});
