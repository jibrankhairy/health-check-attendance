"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

type QualitativeRef = {
  type: "qualitative";
  normal: string[];
};

type RangeRef = {
  all: {
    min?: number;
    max?: number;
  };
};

type RefDef = QualitativeRef | RangeRef;

type UrinalisaFieldKey =
  | "urinWarna"
  | "urinKejernihan"
  | "urinBau"
  | "urinBeratJenis"
  | "urinPh"
  | "urinProtein"
  | "urinBilirubin"
  | "urinGlukosa"
  | "urinUrobilinogen"
  | "urinKeton"
  | "urinNitrit"
  | "urinLeukositEsterase"
  | "urinBlood"
  | "urinSedimenEritrosit"
  | "urinSedimenLeukosit"
  | "urinSedimenEpitel"
  | "urinCaOxalat"
  | "urinUridAcid"
  | "urinGranulaCast";

type NonHeaderRow = {
  no: string;
  label: string;
  isHeader?: false;
  field: UrinalisaFieldKey;
  refText: string;
  unit: string;
  ref: RefDef;
};

type HeaderRow = {
  no: string;
  label: string;
  isHeader: true;
};

type Row = NonHeaderRow | HeaderRow;

export interface UrinalisaData {
  patient?: any;
  urinalisaValidatorName?: string;
  urinalisaValidatorQr?: string;

  urinWarna?: string | number;
  urinKejernihan?: string | number;
  urinBau?: string | number;
  urinBeratJenis?: string | number;
  urinPh?: string | number;
  urinProtein?: string | number;
  urinBilirubin?: string | number;
  urinGlukosa?: string | number;
  urinUrobilinogen?: string | number;
  urinKeton?: string | number;
  urinNitrit?: string | number;
  urinLeukositEsterase?: string | number;
  urinBlood?: string | number;
  urinSedimenEritrosit?: string | number;
  urinSedimenLeukosit?: string | number;
  urinSedimenEpitel?: string | number;
  urinCaOxalat?: string | number;
  urinUridAcid?: string | number;
  urinGranulaCast?: string | number;
}

interface UrinalisaDocumentProps {
  data?: UrinalisaData;
}

const urinalisaDataMap: Row[] = [
  { no: "1", label: "MAKROSKOPIS", isHeader: true },

  {
    no: "",
    label: "WARNA",
    field: "urinWarna",
    refText: "Kuning Muda - Kuning",
    unit: "-",
    ref: {
      type: "qualitative",
      normal: ["kuning muda - kuning", "kuning", "kuning muda"],
    },
  },
  {
    no: "",
    label: "KEJERNIHAN",
    field: "urinKejernihan",
    refText: "Jernih",
    unit: "-",
    ref: { type: "qualitative", normal: ["jernih"] },
  },
  {
    no: "",
    label: "BAU",
    field: "urinBau",
    refText: "Tidak Menyengat",
    unit: "-",
    ref: { type: "qualitative", normal: ["tidak menyengat", "khas"] },
  },
  {
    no: "",
    label: "BERAT JENIS",
    field: "urinBeratJenis",
    refText: "1.001 - 1.035",
    unit: "-",
    ref: { all: { min: 1.001, max: 1.035 } },
  },
  {
    no: "",
    label: "PH",
    field: "urinPh",
    refText: "4.5 - 8.0",
    unit: "-",
    ref: { all: { min: 4.5, max: 8.0 } },
  },
  {
    no: "",
    label: "PROTEIN",
    field: "urinProtein",
    refText: "Negatif",
    unit: "mg/dL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "BILIRUBIN",
    field: "urinBilirubin",
    refText: "Negatif",
    unit: "mg/dL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "GLUKOSA",
    field: "urinGlukosa",
    refText: "Negatif",
    unit: "mg/dL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "UROBILINOGEN",
    field: "urinUrobilinogen",
    refText: "Negatif (0.2)",
    unit: "mg/dL",
    ref: {
      type: "qualitative",
      normal: ["negatif (0.2)", "negatif", "normal"],
    },
  },
  {
    no: "",
    label: "KETON",
    field: "urinKeton",
    refText: "Negatif",
    unit: "mg/dL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "NITRIT",
    field: "urinNitrit",
    refText: "Negatif",
    unit: "mg/dL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "LEUKOSIT ESTERASE",
    field: "urinLeukositEsterase",
    refText: "Negatif",
    unit: "/µL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "BLOOD",
    field: "urinBlood",
    refText: "Negatif",
    unit: "mg/dL",
    ref: { type: "qualitative", normal: ["negatif"] },
  },

  { no: "2", label: "MIKROSKOPIS (SEDIMEN)", isHeader: true },

  {
    no: "",
    label: "ERITROSIT",
    field: "urinSedimenEritrosit",
    refText: "0 - 2",
    unit: "/LPB",
    ref: { all: { min: 0, max: 2 } },
  },
  {
    no: "",
    label: "LEUKOSIT",
    field: "urinSedimenLeukosit",
    refText: "0 - 5",
    unit: "/LPB",
    ref: { all: { min: 0, max: 5 } },
  },
  {
    no: "",
    label: "EPITEL SEL",
    field: "urinSedimenEpitel",
    refText: "< 10",
    unit: "/LPK",
    ref: { all: { max: 10 } },
  },
  {
    no: "",
    label: "CA OXALAT",
    field: "urinCaOxalat",
    refText: "Negatif",
    unit: "/LPK",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "URID ACID",
    field: "urinUridAcid",
    refText: "Negatif",
    unit: "/LPK",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
  {
    no: "",
    label: "GRANULA CAST",
    field: "urinGranulaCast",
    refText: "Negatif",
    unit: "/LPK",
    ref: { type: "qualitative", normal: ["negatif"] },
  },
];

const isHeaderRow = (row: Row): row is HeaderRow => row.isHeader === true;
const isQualitativeRef = (ref: RefDef): ref is QualitativeRef =>
  (ref as QualitativeRef).type === "qualitative";

/** ===== Helpers ===== */

const isResultAbnormal = (
  item: NonHeaderRow,
  resultValue: unknown
): boolean => {
  if (resultValue == null || resultValue === "" || !item.ref) return false;

  if (isQualitativeRef(item.ref)) {
    const lower = String(resultValue).toLowerCase().trim();
    const normals = item.ref.normal.map((s) => s.toLowerCase().trim());
    return !normals.includes(lower);
  }

  const num = Number(resultValue);
  if (Number.isNaN(num)) return false;

  const { min, max } = item.ref.all;
  if (min !== undefined && num < min) return true;
  if (max !== undefined && num > max) return true;

  return false;
};

export const UrinalisaDocument: React.FC<UrinalisaDocumentProps> = ({
  data,
}) => (
  <Page size="A4" style={styles.page}>
    <ReportHeader />
    <View style={styles.body}>
      <PatientInfo patient={data?.patient} />
      <Text style={styles.mainTitle}>HASIL PEMERIKSAAN URINALISA</Text>

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

        {urinalisaDataMap.map((item, idx) => {
          if (isHeaderRow(item)) {
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

          const val = data?.[item.field];
          const abnormal = isResultAbnormal(item, val);
          const isLast = idx === urinalisaDataMap.length - 1;
          const rowStyle = isLast
            ? [styles.tableRow, styles.tableRowLast]
            : [styles.tableRow];

          const hasilStyles = [styles.tableCol, styles.colHasil] as any[];
          if (abnormal) hasilStyles.push(styles.resultAbnormal);

          return (
            <View style={rowStyle} key={item.field}>
              <Text style={[styles.tableCol, styles.colNo]} />
              <Text style={[styles.tableCol, styles.colJenis]}>
                {item.label}
              </Text>
              <Text style={hasilStyles}>{val ?? "-"}</Text>
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

      {/* Signature ala Hematologi: kanan, tanpa "Pemeriksa," & tanpa garis */}
      {(data?.urinalisaValidatorName || data?.urinalisaValidatorQr) && (
        <View
          style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}
        >
          {data?.urinalisaValidatorQr && (
            <Image
              src={data.urinalisaValidatorQr}
              style={{ width: 80, height: 80, marginBottom: 3 }}
            />
          )}
          {data?.urinalisaValidatorName && (
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
              {data.urinalisaValidatorName}
            </Text>
          )}
          <Text style={{ fontSize: 5 }}>Validator</Text>
        </View>
      )}
    </View>
    <ReportFooter />
  </Page>
);

export default UrinalisaDocument;
