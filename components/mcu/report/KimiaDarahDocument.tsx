// components/mcu/report/KimiaDarahDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

const kimiaDarahDataMap = [
  { no: "1", label: "METABOLISME KARBOHIDRAT", isHeader: true },
  { no: "", label: "GULA DARAH - PUASA", field: "gulaDarahPuasa", refText: "75 - 115", unit: "mg/dL", ref: { all: { min: 75, max: 115 } } },
  { no: "", label: "GULA DARAH - 2 JAM PP", field: "gulaDarah2JamPP", refText: "< 140", unit: "mg/dL", ref: { all: { max: 140 } } },
  { no: "2", label: "PROFIL LEMAK", isHeader: true },
  { no: "", label: "CHOLESTEROL TOTAL", field: "kolesterolTotal", refText: "< 200", unit: "mg/dL", ref: { all: { max: 200 } } },
  { no: "", label: "HDL - CHOLESTEROL", field: "hdl", refText: "> 45", unit: "mg/dL", ref: { all: { min: 45 } } },
  { no: "", label: "LDL - CHOLESTEROL", field: "ldl", refText: "< 130", unit: "mg/dL", ref: { all: { max: 130 } } },
  { no: "", label: "TRIGLISERIDA", field: "trigliserida", refText: "< 150", unit: "mg/dL", ref: { all: { max: 150 } } },
  { no: "3", label: "FUNGSI HATI", isHeader: true },
  { no: "", label: "SGOT", field: "sgot", refText: "< 40", unit: "U/L", ref: { all: { max: 40 } } },
  { no: "", label: "SGPT", field: "sgpt", refText: "< 41", unit: "U/L", ref: { all: { max: 41 } } },
  { no: "4", label: "FUNGSI GINJAL", isHeader: true },
  { no: "", label: "ASAM URAT", field: "asamUrat", refText: "P: 3.4-7.0, W: 2.4-5.7", unit: "mg/dL", ref: { male: { min: 3.4, max: 7.0 }, female: { min: 2.4, max: 5.7 } } },
  { no: "", label: "UREUM", field: "ureum", refText: "10 - 50", unit: "mg/dL", ref: { all: { min: 10, max: 50 } } },
  { no: "", label: "CREATININ", field: "kreatinin", refText: "0.5 - 1.5", unit: "mg/dL", ref: { all: { min: 0.5, max: 1.5 } } },
  { no: "5", label: "PENANDA HEPATITIS", isHeader: true },
  { no: "", label: "HbsAg", field: "hbsag", refText: "Negatif", unit: "-", ref: { type: "qualitative", normal: ["negatif"] } },
];

const getResultStyle = (item, resultValue, gender) => {
  if (resultValue === null || resultValue === undefined || resultValue === "" || !item.ref) return {};

  if (item.ref.type === "qualitative") {
    const lower = String(resultValue).toLowerCase();
    return !item.ref.normal.includes(lower) ? styles.resultAbnormal : {};
  }

  const num = parseFloat(String(resultValue));
  if (isNaN(num)) return {};

  let range = item.ref.all;
  if (item.ref.male && String(gender).toUpperCase() === "LAKI-LAKI") range = item.ref.male;
  else if (item.ref.female && String(gender).toUpperCase() === "PEREMPUAN") range = item.ref.female;

  if (!range) return {};
  const { min, max } = range;
  if ((min !== undefined && num < min) || (max !== undefined && num > max)) return styles.resultAbnormal;
  return {};
};

export const KimiaDarahDocument = ({ data }) => (
  <Page size="A4" style={styles.page}>
    <ReportHeader />
    <View style={styles.body}>
      <PatientInfo patient={data?.patient} />
      <Text style={styles.mainTitle}>HASIL PEMERIKSAAN KIMIA DARAH</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, styles.colNo]}>NO</Text>
          <Text style={[styles.tableColHeader, styles.colJenis]}>JENIS PEMERIKSAAN</Text>
          <Text style={[styles.tableColHeader, styles.colHasil]}>HASIL</Text>
          <Text style={[styles.tableColHeader, styles.colRujukan]}>NILAI RUJUKAN</Text>
          <Text style={[styles.tableColHeader, styles.colSatuan, styles.tableColLast]}>SATUAN</Text>
        </View>

        {kimiaDarahDataMap.map((item, index) => {
          if (item.isHeader) {
            return (
              <View style={styles.tableRow} key={`header-${item.no}`}>
                <Text style={[styles.tableCol, styles.colNo, { fontFamily: "Helvetica-Bold" }]}>{item.no}</Text>
                <Text style={[styles.tableCol, { width: "95%", fontFamily: "Helvetica-Bold" }, styles.tableColLast]}>{item.label}</Text>
              </View>
            );
          }

          const val = data?.[item.field];
          const abnormal = getResultStyle(item, val, data?.patient?.gender);

          return (
            <View style={[styles.tableRow, index === kimiaDarahDataMap.length - 1 && styles.tableRowLast]} key={item.field}>
              <Text style={[styles.tableCol, styles.colNo]} />
              <Text style={[styles.tableCol, styles.colJenis]}>{item.label}</Text>
              <Text style={[styles.tableCol, styles.colHasil, abnormal]}>{val || "-"}</Text>
              <Text style={[styles.tableCol, styles.colRujukan]}>{item.refText}</Text>
              <Text style={[styles.tableCol, styles.colSatuan, styles.tableColLast]}>{item.unit}</Text>
            </View>
          );
        })}
      </View>

      {/* Signature ala Hematologi: kanan bawah, QR → Nama (bold) → "Validator" */}
      {(data?.kimiaDarahValidatorName || data?.kimiaDarahValidatorQr) && (
        <View style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}>
          {data?.kimiaDarahValidatorQr && (
            <Image src={data.kimiaDarahValidatorQr} style={{ width: 80, height: 80, marginBottom: 8 }} />
          )}
          {data?.kimiaDarahValidatorName && (
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
              {data.kimiaDarahValidatorName}
            </Text>
          )}
          <Text style={{ fontSize: 5 }}>Validator</Text>
        </View>
      )}
    </View>
    <ReportFooter />
  </Page>
);
