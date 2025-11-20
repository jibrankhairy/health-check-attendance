"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

type GenderString = "LAKI-LAKI" | "PEREMPUAN" | string;

type Range = { min?: number; max?: number };

type QualitativeRef = { type: "qualitative"; normal: string[] };
type QuantitativeRef = { all?: Range; male?: Range; female?: Range };
type RefUnion = QualitativeRef | QuantitativeRef;

export interface KimiaDarahData {
  patient?: {
    gender?: GenderString;
    [k: string]: any;
  };
  gulaDarahPuasa?: number | string | null;
  gulaDarah2JamPP?: number | string | null;
  gulaDarahSewaktu?: number | string | null;
  kolesterolTotal?: number | string | null;
  hdl?: number | string | null;
  ldl?: number | string | null;
  bilirubinTotal?: number | string | null;
  bilirubinDirect?: number | string | null;
  alkaliPhosphatase?: number | string | null;
  trigliserida?: number | string | null;
  sgot?: number | string | null;
  sgpt?: number | string | null;
  asamUrat?: number | string | null;
  ureum?: number | string | null;
  kreatinin?: number | string | null;
  hbsag?: string | null;

  kimiaDarahValidatorName?: string | null;
  kimiaDarahValidatorQr?: string | null;
}

type KimiaDarahItemHeader = {
  no: string;
  label: string;
  isHeader: true;
  field?: undefined;
  refText?: string;
  unit?: string;
  ref?: undefined;
};

type KimiaDarahItemField = {
  no: string;
  label: string;
  isHeader?: false;
  field: keyof KimiaDarahData;
  refText: string;
  unit: string;
  ref: RefUnion;
};

type KimiaDarahItem = KimiaDarahItemHeader | KimiaDarahItemField;

const isHeaderItem = (i: KimiaDarahItem): i is KimiaDarahItemHeader =>
  !!i.isHeader;

const kimiaDarahDataMap: ReadonlyArray<KimiaDarahItem> = [
  { no: "1", label: "METABOLISME KARBOHIDRAT", isHeader: true },
  {
    no: "",
    label: "GULA DARAH - PUASA",
    field: "gulaDarahPuasa",
    refText: "75 - 115",
    unit: "mg/dL",
    ref: { all: { min: 75, max: 115 } },
  },
  {
    no: "",
    label: "GULA DARAH - 2 JAM PP",
    field: "gulaDarah2JamPP",
    refText: "< 140",
    unit: "mg/dL",
    ref: { all: { max: 140 } },
  },
  {
    no: "",
    label: "GULA DARAH SEWAKTU",
    field: "gulaDarahSewaktu",
    refText: "< 180",
    unit: "mg/dL",
    ref: { all: { max: 180 } },
  },

  { no: "2", label: "PROFIL LEMAK", isHeader: true },
  {
    no: "",
    label: "CHOLESTEROL TOTAL",
    field: "kolesterolTotal",
    refText: "< 200",
    unit: "mg/dL",
    ref: { all: { max: 200 } },
  },
  {
    no: "",
    label: "HDL - CHOLESTEROL",
    field: "hdl",
    refText: "> 45",
    unit: "mg/dL",
    ref: { all: { min: 45 } },
  },
  {
    no: "",
    label: "LDL - CHOLESTEROL",
    field: "ldl",
    refText: "< 130",
    unit: "mg/dL",
    ref: { all: { max: 130 } },
  },
  {
    no: "",
    label: "BILIRUBIN TOTAL",
    field: "bilirubinTotal",
    refText: "0.8 - 1.2",
    unit: "mg/dL",
    ref: { all: { min: 0.2, max: 1.2 } },
  },
  {
    no: "",
    label: "BILIRUBIN DIRECT",
    field: "bilirubinDirect",
    refText: "0.1 - 0.3",
    unit: "mg/dL",
    ref: { all: { min: 0.1, max: 0.3 } },
  },
  {
    no: "",
    label: "ALKALI PHOSPATASE",
    field: "alkaliPhosphatase",
    refText: "30 - 120",
    unit: "IU/L",
    ref: { all: { min: 30, max: 120 } },
  },
  {
    no: "",
    label: "TRIGLISERIDA",
    field: "trigliserida",
    refText: "< 150",
    unit: "mg/dL",
    ref: { all: { max: 150 } },
  },

  { no: "3", label: "FUNGSI HATI", isHeader: true },
  {
    no: "",
    label: "SGOT",
    field: "sgot",
    refText: "< 40",
    unit: "U/L",
    ref: { all: { max: 40 } },
  },
  {
    no: "",
    label: "SGPT",
    field: "sgpt",
    refText: "< 41",
    unit: "U/L",
    ref: { all: { max: 41 } },
  },

  { no: "4", label: "FUNGSI GINJAL", isHeader: true },
  {
    no: "",
    label: "ASAM URAT",
    field: "asamUrat",
    refText: "P: 3.4-7.0, W: 2.4-5.7",
    unit: "mg/dL",
    ref: { male: { min: 3.4, max: 7.0 }, female: { min: 2.4, max: 5.7 } },
  },
  {
    no: "",
    label: "UREUM",
    field: "ureum",
    refText: "10 - 50",
    unit: "mg/dL",
    ref: { all: { min: 10, max: 50 } },
  },
  {
    no: "",
    label: "CREATININ",
    field: "kreatinin",
    refText: "0.5 - 1.5",
    unit: "mg/dL",
    ref: { all: { min: 0.5, max: 1.5 } },
  },

  // { no: "5", label: "PENANDA HEPATITIS", isHeader: true },
  // {
  //   no: "",
  //   label: "HbsAg",
  //   field: "hbsag",
  //   refText: "Negatif",
  //   unit: "-",
  //   ref: { type: "qualitative", normal: ["negatif"] },
  // },
];

const getResultStyle = (
  item: KimiaDarahItemField,
  resultValue: unknown,
  gender?: GenderString
): Record<string, any> => {
  if (
    resultValue === null ||
    resultValue === undefined ||
    resultValue === "" ||
    !item.ref
  )
    return {};

  if ((item.ref as QualitativeRef).type === "qualitative") {
    const qRef = item.ref as QualitativeRef;
    const lower = String(resultValue).toLowerCase().trim();
    return qRef.normal.map((s) => s.toLowerCase().trim()).includes(lower)
      ? {}
      : (styles as any).resultAbnormal;
  }

  const num = parseFloat(String(resultValue));
  if (Number.isNaN(num)) return {};

  const qRef = item.ref as QuantitativeRef;
  let range: Range | undefined = qRef.all;
  const g = (gender ?? "").toString().toUpperCase();

  if (qRef.male && g === "LAKI-LAKI") range = qRef.male;
  else if (qRef.female && g === "PEREMPUAN") range = qRef.female;

  if (!range) return {};
  const { min, max } = range;
  if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
    return (styles as any).resultAbnormal;
  }
  return {};
};

type KimiaDarahDocumentProps = {
  data?: KimiaDarahData;
};

const validatorStyles = {
  validatorBox: {
    position: "absolute" as const,
    right: 40,
    bottom: 72,
    alignItems: "center" as const,
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
};

const formatTruncate2Decimals = (value: unknown): string => {
  if (value === null || value === undefined || String(value) === "") {
    return "-";
  }

  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }
  const truncatedNum = Math.trunc((num * 100) + Number.EPSILON) / 100;
  return String(truncatedNum);
};

export const KimiaDarahDocument: React.FC<KimiaDarahDocumentProps> = ({
  data,
}) => (
  <Page size="A4" style={styles.page}>
    <ReportHeader />
    <View style={styles.body}>
      <PatientInfo patient={data?.patient} />
      <Text style={styles.mainTitle}>HASIL PEMERIKSAAN KIMIA DARAH</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, styles.colNo]}>NO</Text>
          <Text style={[styles.tableColHeader, styles.colJenis]}>
            JENIS PEMERIKSAAN
          </Text>
          <Text style={[styles.tableColHeader, styles.colHasil]}>HASIL</Text>
          <Text style={[styles.tableColHeader, styles.colRujukan]}>
            NILAI RUJUKAN
          </Text>
          <Text
            style={[
              styles.tableColHeader,
              styles.colSatuan,
              styles.tableColLast,
            ]}
          >
            SATUAN
          </Text>
        </View>

        {kimiaDarahDataMap.map((item, index) => {
          if (isHeaderItem(item)) {
            return (
              <View style={styles.tableRow} key={`header-${item.no}`}>
                <Text
                  style={[
                    styles.tableCol,
                    styles.colNo,
                    { fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  {item.no}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    { width: "95%", fontFamily: "Helvetica-Bold" },
                    styles.tableColLast,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            );
          }

          // yahayu
          let val = data?.[item.field as keyof KimiaDarahData] as unknown;

          const fieldsToTruncate = [
            "bilirubinTotal", 
            "bilirubinDirect", 
            "alkaliPhosphatase"
          ];

          if (fieldsToTruncate.includes(item.field as string)) {
            val = formatTruncate2Decimals(val);
          }

          const abnormal = getResultStyle(item, val, data?.patient?.gender);

          const displayValue = (val as any) ?? "-";

          return (
            <View
              style={[
                styles.tableRow,
                index === kimiaDarahDataMap.length - 1
                  ? (styles as any).tableRowLast
                  : undefined,
              ]}
              key={item.field as string}
            >
              <Text style={[styles.tableCol, styles.colNo]} />
              <Text style={[styles.tableCol, styles.colJenis]}>
                {item.label}
              </Text>
              
              <Text style={[styles.tableCol, styles.colHasil, abnormal]}>
                {displayValue}
              </Text>

              <Text style={[styles.tableCol, styles.colRujukan]}>
                {item.refText}
              </Text>
              <Text
                style={[styles.tableCol, styles.colSatuan, styles.tableColLast]}
              >
                {item.unit}
              </Text>
            </View>
          );
        })}
      </View>
    </View>

    {(data?.kimiaDarahValidatorName || data?.kimiaDarahValidatorQr) && (
      <View style={validatorStyles.validatorBox}>
        {data?.kimiaDarahValidatorQr && (
          <Image
            src={data.kimiaDarahValidatorQr as string}
            style={validatorStyles.validatorQr}
          />
        )}
        {data?.kimiaDarahValidatorName && (
          <Text style={validatorStyles.validatorName}>
            {data.kimiaDarahValidatorName}
          </Text>
        )}
        <Text style={validatorStyles.validatorLabel}>Validator</Text>
      </View>
    )}

    <ReportFooter />
  </Page>
);
