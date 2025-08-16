"use client";

import React from "react";
import { Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

export interface FraminghamData extends Record<string, unknown> {
  patient?: { [k: string]: unknown } | null;
  framinghamValidatorName?: string | null;
  framinghamValidatorQr?: string | null;
}

const framinghamInputMap = [
  { label: "Usia", field: "framinghamAge", unit: "tahun" },
  { label: "Jenis Kelamin", field: "framinghamGender", unit: "" },
  { label: "HDL Kolesterol", field: "framinghamHdlCholesterol", unit: "mg/dL" },
  {
    label: "Total Kolesterol",
    field: "framinghamTotalCholesterol",
    unit: "mg/dL",
  },
  {
    label: "Tekanan Darah Sistolik",
    field: "framinghamSystolicBp",
    unit: "mmHg",
  },
  { label: "Merokok", field: "framinghamIsSmoker", unit: "" },
  {
    label: "Mengkonsumsi Obat Hipertensi",
    field: "framinghamIsOnHypertensionTreatment",
    unit: "",
  },
] as const;

const framinghamResultMap = [
  {
    label: "Estimasi Risiko CVD",
    field: "framinghamRiskPercentage",
    unit: "%",
  },
  { label: "Kategori Risiko", field: "framinghamRiskCategory", unit: "" },
  {
    label: "Estimasi Usia Vaskular",
    field: "framinghamVascularAge",
    unit: "tahun",
  },
] as const;

const localStyles = StyleSheet.create({
  subTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
});

const displayValue = (v: unknown): string =>
  v === null || v === undefined || String(v) === "" ? "-" : String(v);

export const FraminghamDocument: React.FC<{ data: FraminghamData }> = ({
  data,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <ReportHeader />
      <View style={styles.body}>
        <PatientInfo patient={data?.patient} />
        <Text style={styles.mainTitle}>FRAMINGHAM RISK SCORE</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { flex: 3 }]}>VARIABEL</Text>
            <Text style={[styles.tableColHeader, { flex: 2 }]}>NILAI</Text>
            <Text
              style={[styles.tableColHeader, { flex: 2 }, styles.tableColLast]}
            >
              SATUAN
            </Text>
          </View>
          {framinghamInputMap.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                ...(index === framinghamInputMap.length - 1
                  ? [styles.tableRowLast]
                  : []),
              ]}
            >
              <Text style={[styles.tableCol, { flex: 3 }]}>{item.label}</Text>
              <Text style={[styles.tableCol, { flex: 2 }]}>
                {displayValue(data[item.field])}
              </Text>
              <Text style={[styles.tableCol, { flex: 2 }, styles.tableColLast]}>
                {item.unit}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />

        <Text
          style={[localStyles.subTitle, { textAlign: "left", marginBottom: 8 }]}
        >
          HASIL
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { flex: 3 }]}>ESTIMASI</Text>
            <Text style={[styles.tableColHeader, { flex: 2 }]}>HASIL</Text>
            <Text
              style={[styles.tableColHeader, { flex: 2 }, styles.tableColLast]}
            >
              SATUAN
            </Text>
          </View>
          {framinghamResultMap.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                ...(index === framinghamResultMap.length - 1
                  ? [styles.tableRowLast]
                  : []),
              ]}
            >
              <Text style={[styles.tableCol, { flex: 3 }]}>{item.label}</Text>
              <Text style={[styles.tableCol, { flex: 2 }]}>
                {displayValue(data[item.field])}
              </Text>
              <Text style={[styles.tableCol, { flex: 2 }, styles.tableColLast]}>
                {item.unit}
              </Text>
            </View>
          ))}
        </View>

        {(data?.framinghamValidatorName || data?.framinghamValidatorQr) && (
          <View
            style={{ marginTop: 20, alignItems: "flex-end", paddingRight: 40 }}
          >
            {data?.framinghamValidatorQr && (
              <Image
                src={String(data.framinghamValidatorQr)}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.framinghamValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {String(data.framinghamValidatorName)}
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