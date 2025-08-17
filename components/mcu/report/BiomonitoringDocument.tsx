"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

type RefRange = { min?: number; max?: number };

interface BiomonitoringItem {
  no: number;
  label: string;
  field: string;
  ref: { all?: RefRange };
  unit: string;
  refText: string;
}

interface PatientMin {
  gender?: string | null;
  [k: string]: unknown;
}

export interface BiomonitoringData extends Record<string, unknown> {
  patient?: PatientMin | null;
  biomonitoringValidatorName?: string | null;
  biomonitoringValidatorQr?: string | null;
}

const biomonitoringDataMap: BiomonitoringItem[] = [
  {
    no: 1,
    label: "TIMBAL DALAM DARAH (Pb)",
    field: "timbalDarah",
    ref: { all: { max: 10 } },
    unit: "µg/dL",
    refText: "< 10",
  },
  {
    no: 2,
    label: "ARSENIK DALAM URIN (As)",
    field: "arsenikUrin",
    ref: { all: { max: 35 } },
    unit: "µg/g kreatinin",
    refText: "< 35",
  },
];

const isAbnormal = (item: BiomonitoringItem, resultValue: unknown): boolean => {
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
  const normalRange: RefRange | undefined = item.ref.all;
  if (!normalRange) return false;
  const { min, max } = normalRange;
  return (
    (typeof min === "number" && numericResult < min) ||
    (typeof max === "number" && numericResult > max)
  );
};

const displayValue = (v: unknown): string =>
  v === null || v === undefined || String(v) === "" ? "-" : String(v);

export const BiomonitoringDocument: React.FC<{ data: BiomonitoringData }> = ({
  data,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <ReportHeader />

      <View style={styles.body}>
        <PatientInfo patient={data?.patient} />

        <Text style={styles.mainTitle}>HASIL PEMERIKSAAN BIOMONITORING</Text>

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

          {biomonitoringDataMap.map((item, index) => {
            const resultValue = data[item.field] as unknown;
            const abnormal = isAbnormal(item, resultValue);
            const isLastRow = index === biomonitoringDataMap.length - 1;

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

        <View style={{ marginTop: 15 }}>
          <Text style={[styles.sectionTitle, { fontSize: 9, marginBottom: 5 }]}>
            Catatan:
          </Text>
          <Text style={{ fontSize: 8, lineHeight: 1.4, textAlign: "justify" }}>
            Pemeriksaan Biomonitoring bertujuan untuk mengukur kadar zat kimia
            tertentu dalam tubuh.{" "}
            <Text style={styles.resultAbnormal}>Timbal (Pb)</Text> dalam darah
            mengindikasikan tingkat paparan terkini terhadap logam berat yang
            dapat memengaruhi sistem saraf dan organ lainnya.{" "}
            <Text style={styles.resultAbnormal}>Arsenik (As)</Text> dalam urin
            menunjukkan paparan terkini terhadap metaloid yang juga berpotensi
            toksik bagi tubuh.
          </Text>
        </View>

        {(data?.biomonitoringValidatorName ||
          data?.biomonitoringValidatorQr) && (
          <View
            style={{
              marginTop: 20,
              alignItems: "flex-end",
              paddingRight: 40,
            }}
          >
            {data?.biomonitoringValidatorQr && (
              <Image
                src={String(data.biomonitoringValidatorQr)}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.biomonitoringValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {String(data.biomonitoringValidatorName)}
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