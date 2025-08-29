"use client";

import React from "react";
import { Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

interface HepatitisItem {
  no: number;
  label: string;
  field: string;
  unit: string;
  refText: string;
  isAbnormal: (value: any) => boolean;
}

export interface HepatitisPanelData extends Record<string, unknown> {
  patient?: { [k: string]: unknown } | null;
  hepatitisValidatorName?: string | null;
  hepatitisValidatorQr?: string | null;
  hbsag?: string | null;
  antiHbs?: number | string | null;
}

const hepatitisDataMap: HepatitisItem[] = [
  {
    no: 1,
    label: "HBsAg (Hepatitis B Surface Antigen)",
    field: "hbsag",
    unit: "-",
    refText: "Non-Reactive",
    isAbnormal: (value) => value === "Reactive",
  },
  {
    no: 2,
    label: "Anti-HBs (Antibody to HBsAg)",
    field: "antiHbs",
    unit: "mIU/mL",
    refText: "> 10",
    isAbnormal: (value) => {
      const numValue = parseFloat(String(value));
      return !isNaN(numValue) && numValue < 10;
    },
  },
];

const displayValue = (v: unknown): string =>
  v === null || v === undefined || String(v).trim() === "" ? "-" : String(v);

const localStyles = StyleSheet.create({
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

export const HepatitisPanelDocument: React.FC<{ data: HepatitisPanelData }> = ({
  data,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <ReportHeader />

      <View style={styles.body}>
        <PatientInfo patient={data?.patient} />

        <Text style={styles.mainTitle}>HASIL PEMERIKSAAN PANEL HEPATITIS</Text>

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

          {hepatitisDataMap.map((item, index) => {
            const resultValue = data[item.field] as unknown;
            const abnormal = item.isAbnormal(resultValue);
            const isLastRow = index === hepatitisDataMap.length - 1;

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
            Keterangan:
          </Text>
          <Text style={{ fontSize: 8, lineHeight: 1.4, textAlign: "justify" }}>
            Pemeriksaan panel hepatitis B bertujuan untuk mendeteksi infeksi
            atau status imunitas terhadap virus Hepatitis B (VHB).{" "}
            <Text style={styles.resultAbnormal}>HBsAg (Reactive)</Text>{" "}
            mengindikasikan adanya infeksi VHB aktif.{" "}
            <Text style={styles.resultAbnormal}>Anti-HBs</Text> adalah antibodi
            yang terbentuk sebagai respons terhadap infeksi atau vaksinasi.
            Kadar di atas 10 mIU/mL menunjukkan adanya kekebalan (imunitas)
            terhadap virus Hepatitis B.
          </Text>
        </View>
      </View>

      {(data?.hepatitisValidatorName || data?.hepatitisValidatorQr) && (
        <View style={localStyles.validatorBox}>
          {data?.hepatitisValidatorQr && (
            <Image
              src={String(data.hepatitisValidatorQr)}
              style={localStyles.validatorQr}
            />
          )}
          {data?.hepatitisValidatorName && (
            <Text style={localStyles.validatorName}>
              {String(data.hepatitisValidatorName)}
            </Text>
          )}
          <Text style={localStyles.validatorLabel}>Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};
