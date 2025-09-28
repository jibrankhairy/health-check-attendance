export type Range = { min?: number; max?: number };

export type RefNumeric = {
  all?: Range;
  male?: Range;
  female?: Range;
  type?: undefined;
};

export type RefQualitative = {
  type: "qualitative";
  normal: string[];
};

export type MetricItem = {
  label: string;
  field: string;
  ref: RefNumeric | RefQualitative;
  unit: string;
};

export type Summaries = {
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

export type SummaryConclusionData = {
  patient?: { gender?: string; mcuPackage?: string[] } | null;
  hemoglobin?: string | null;
  leukosit?: string | null;
  trombosit?: string | null;
  hematokrit?: string | null;
  eritrosit?: string | null;
  mcv?: string | null;
  mch?: string | null;
  mchc?: string | null;
  rdw?: string | null;
  mpv?: string | null;
  pdw?: string | null;
  hitungJenisEosinofil?: string | null;
  hitungJenisBasofil?: string | null;
  hitungJenisNeutrofilStab?: string | null;
  hitungJenisNeutrofilSegmen?: string | null;
  hitungJenisLimfosit?: string | null;
  hitungJenisMonosit?: string | null;
  led?: string | null;

  gulaDarahPuasa?: string | null;
  gulaDarah2JamPP?: string | null;
  kolesterolTotal?: string | null;
  hdl?: string | null;
  ldl?: string | null;
  trigliserida?: string | null;
  sgot?: string | null;
  sgpt?: string | null;
  asamUrat?: string | null;
  ureum?: string | null;
  kreatinin?: string | null;
  hbsag?: string | null;
  timbalDarah?: string | null;

  urinBeratJenis?: string | null;
  urinPh?: string | null;
  urinProtein?: string | null;
  urinGlukosa?: string | null;
  urinLeukositEsterase?: string | null;
  urinBlood?: string | null;
  urinSedimenEritrosit?: string | null;
  urinSedimenLeukosit?: string | null;
  urinSedimenEpitel?: string | null;

  kesanRontgen?: string | null;
  ekgConclusion?: string | null;
  usgMammaeKesimpulan?: string | null;
  usgAbdomenKesimpulan?: string | null;
  audiometryKesimpulanUmum?: string | null;
  kesimpulanSpirometry?: string | null;
  treadmillHasilTest?: string | null;
  refraKananSpheris?: string | null;
  refraKiriSpheris?: string | null;
} & Record<string, unknown>;

export const hematologyDataMap: MetricItem[] = [
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

export const kimiaDarahDataMap: MetricItem[] = [
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

export const urinalisaDataMap: MetricItem[] = [
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

export const isQualitative = (
  ref: RefNumeric | RefQualitative
): ref is RefQualitative => (ref as RefQualitative).type === "qualitative";

export const isAbnormal = (
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

export const summarizeResults = (data: SummaryConclusionData): Summaries => {
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
    if (resultValue && String(resultValue).toLowerCase() !== "negatif") {
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
