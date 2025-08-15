"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

/** ===================== Types ===================== */
type RefRange = { min?: number; max?: number };
type RangeBySex = { all?: RefRange; male?: RefRange; female?: RefRange };

interface HematologyItem {
  no: number;
  label: string;
  field: string;
  ref: RangeBySex;
  unit: string;
  refText: string;
}

interface PatientMin {
  gender?: string | null;
  [k: string]: unknown;
}

export interface HematologiData extends Record<string, unknown> {
  patient?: PatientMin | null;
  hematologiValidatorName?: string | null;
  hematologiValidatorQr?: string | null;
}

const hematologyDataMap: HematologyItem[] = [
  {
    no: 1,
    label: "HEMOGLOBIN",
    field: "hemoglobin",
    ref: { male: { min: 14.0, max: 17.4 }, female: { min: 12.0, max: 14.0 } },
    unit: "g/dL",
    refText: "P: 14.0-17.4, W: 12.0-14.0",
  },
  {
    no: 2,
    label: "LEUKOSIT",
    field: "leukosit",
    ref: { all: { min: 4000, max: 10000 } },
    unit: "Sel/µL",
    refText: "4.000-10.000",
  },
  {
    no: 3,
    label: "TROMBOSIT",
    field: "trombosit",
    ref: { all: { min: 150000, max: 450000 } },
    unit: "Sel/µL",
    refText: "150.000-450.000",
  },
  {
    no: 4,
    label: "HEMATOKRIT",
    field: "hematokrit",
    ref: { all: { min: 40.0, max: 54.0 } },
    unit: "%",
    refText: "40.0-54.0",
  },
  {
    no: 5,
    label: "ERITROSIT",
    field: "eritrosit",
    ref: { all: { min: 4.0, max: 6.1 } },
    unit: "10⁶/µL",
    refText: "4.00-6.10",
  },
  {
    no: 6,
    label: "MCV",
    field: "mcv",
    ref: { all: { min: 80.0, max: 96.0 } },
    unit: "fl",
    refText: "80.0-96.0",
  },
  {
    no: 7,
    label: "MCH",
    field: "mch",
    ref: { all: { min: 27.0, max: 31.0 } },
    unit: "pg",
    refText: "27.0-31.0",
  },
  {
    no: 8,
    label: "MCHC",
    field: "mchc",
    ref: { all: { min: 30.0, max: 34.0 } },
    unit: "g/dL",
    refText: "30.0-34.0",
  },
  {
    no: 9,
    label: "RDW",
    field: "rdw",
    ref: { all: { min: 10.0, max: 15.0 } },
    unit: "%",
    refText: "10.0-15.0",
  },
  {
    no: 10,
    label: "MPV",
    field: "mpv",
    ref: { all: { min: 6.5, max: 11.0 } },
    unit: "fl",
    refText: "6.50-11.0",
  },
  {
    no: 11,
    label: "PDW",
    field: "pdw",
    ref: { all: { min: 10.0, max: 18.0 } },
    unit: "fl",
    refText: "10.0-18.0",
  },
  {
    no: 12,
    label: "EOSINOFIL",
    field: "hitungJenisEosinofil",
    ref: { all: { min: 1, max: 3 } },
    unit: "%",
    refText: "1-3",
  },
  {
    no: 13,
    label: "BASOFIL",
    field: "hitungJenisBasofil",
    ref: { all: { min: 0, max: 1 } },
    unit: "%",
    refText: "0-1",
  },
  {
    no: 14,
    label: "NEUTROFIL STAB",
    field: "hitungJenisNeutrofilStab",
    ref: { all: { min: 3, max: 5 } },
    unit: "%",
    refText: "3-5",
  },
  {
    no: 15,
    label: "NEUTROFIL SEGMEN",
    field: "hitungJenisNeutrofilSegmen",
    ref: { all: { min: 25, max: 60 } },
    unit: "%",
    refText: "25-60",
  },
  {
    no: 16,
    label: "LIMFOSIT",
    field: "hitungJenisLimfosit",
    ref: { all: { min: 20, max: 40 } },
    unit: "%",
    refText: "20-40",
  },
  {
    no: 17,
    label: "MONOSIT",
    field: "hitungJenisMonosit",
    ref: { all: { min: 4, max: 8 } },
    unit: "%",
    refText: "4-8",
  },
  {
    no: 18,
    label: "LAJU ENDAP DARAH",
    field: "led",
    ref: { all: { min: 0, max: 15 } },
    unit: "mm/jam",
    refText: "0-15",
  },
];

const isAbnormal = (
  item: HematologyItem,
  resultValue: unknown,
  gender?: string | null
): boolean => {
  if (
    resultValue === null ||
    resultValue === undefined ||
    String(resultValue) === "" ||
    !item.ref
  ) {
    return false;
  }

  const numericResult = parseFloat(String(resultValue));
  if (Number.isNaN(numericResult)) return false;

  const genderUpper = (gender ?? "").toString().toUpperCase();
  let normalRange: RefRange | undefined = item.ref.all;

  if (item.ref.male && genderUpper === "LAKI-LAKI") {
    normalRange = item.ref.male;
  } else if (item.ref.female && genderUpper === "PEREMPUAN") {
    normalRange = item.ref.female;
  }

  if (!normalRange) return false;

  const { min, max } = normalRange;
  return (
    (typeof min === "number" && numericResult < min) ||
    (typeof max === "number" && numericResult > max)
  );
};

const displayValue = (v: unknown): string =>
  v === null || v === undefined || String(v) === "" ? "-" : String(v);

export const HematologiDocument: React.FC<{ data: HematologiData }> = ({
  data,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <ReportHeader />

      <View style={styles.body}>
        <PatientInfo patient={data?.patient} />

        <Text style={styles.mainTitle}>HASIL PEMERIKSAAN HEMATOLOGI</Text>

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

          {hematologyDataMap.map((item, index) => {
            const resultValue = data[item.field] as unknown;
            const abnormal = isAbnormal(
              item,
              resultValue,
              data?.patient?.gender as string | undefined
            );
            const isLastRow = index === hematologyDataMap.length - 1;

            const rowStyle: any[] = [styles.tableRow];
            if (isLastRow) rowStyle.push(styles.tableRowLast);

            const hasilStyle: any[] = [styles.tableCol, styles.colHasil];
            if (abnormal) hasilStyle.push(styles.resultAbnormal);

            return (
              <View key={item.no} style={rowStyle}>
                <Text style={[styles.tableCol, styles.colNo]}>{item.no}</Text>
                <Text style={[styles.tableCol, styles.colJenis]}>
                  {item.label}
                </Text>
                <Text style={hasilStyle}>{displayValue(resultValue)}</Text>
                <Text style={[styles.tableCol, styles.colRujukan]}>
                  {item.refText}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    styles.colSatuan,
                    styles.tableColLast,
                  ]}
                >
                  {item.unit}
                </Text>
              </View>
            );
          })}
        </View>

        {(data?.hematologiValidatorName || data?.hematologiValidatorQr) && (
          <View
            style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}
          >
            {data?.hematologiValidatorQr && (
              <Image
                src={String(data.hematologiValidatorQr)}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.hematologiValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {String(data.hematologiValidatorName)}
              </Text>
            )}
            <Text style={{ fontSize: 5 }}>Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  );
};
