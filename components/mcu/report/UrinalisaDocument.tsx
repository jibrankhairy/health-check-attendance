// components/mcu/report/UrinalisaDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

const urinalisaDataMap = [
  { no: '1', label: 'MAKROSKOPIS', isHeader: true },
  { no: '', label: 'WARNA', field: 'urinWarna', refText: 'Kuning Muda - Kuning', unit: '-', ref: { type: 'qualitative', normal: ['kuning muda - kuning', 'kuning', 'kuning muda'] } },
  { no: '', label: 'KEJERNIHAN', field: 'urinKejernihan', refText: 'Jernih', unit: '-', ref: { type: 'qualitative', normal: ['jernih'] } },
  { no: '', label: 'BAU', field: 'urinBau', refText: 'Tidak Menyengat', unit: '-', ref: { type: 'qualitative', normal: ['tidak menyengat', 'khas'] } },
  { no: '', label: 'BERAT JENIS', field: 'urinBeratJenis', refText: '1.001 - 1.035', unit: '-', ref: { all: { min: 1.001, max: 1.035 } } },
  { no: '', label: 'PH', field: 'urinPh', refText: '4.5 - 8.0', unit: '-', ref: { all: { min: 4.5, max: 8.0 } } },
  { no: '', label: 'PROTEIN', field: 'urinProtein', refText: 'Negatif', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'BILIRUBIN', field: 'urinBilirubin', refText: 'Negatif', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'GLUKOSA', field: 'urinGlukosa', refText: 'Negatif', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'UROBILINOGEN', field: 'urinUrobilinogen', refText: 'Negatif (0.2)', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif (0.2)', 'negatif', 'normal'] } },
  { no: '', label: 'KETON', field: 'urinKeton', refText: 'Negatif', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'NITRIT', field: 'urinNitrit', refText: 'Negatif', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'LEUKOSIT ESTERASE', field: 'urinLeukositEsterase', refText: 'Negatif', unit: '/µL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'BLOOD', field: 'urinBlood', refText: 'Negatif', unit: 'mg/dL', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '2', label: 'MIKROSKOPIS (SEDIMEN)', isHeader: true },
  { no: '', label: 'ERITROSIT', field: 'urinSedimenEritrosit', refText: '0 - 2', unit: '/LPB', ref: { all: { min: 0, max: 2 } } },
  { no: '', label: 'LEUKOSIT', field: 'urinSedimenLeukosit', refText: '0 - 5', unit: '/LPB', ref: { all: { min: 0, max: 5 } } },
  { no: '', label: 'EPITEL SEL', field: 'urinSedimenEpitel', refText: '< 10', unit: '/LPK', ref: { all: { max: 10 } } },
  { no: '', label: 'CA OXALAT', field: 'urinCaOxalat', refText: 'Negatif', unit: '/LPK', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'URID ACID', field: 'urinUridAcid', refText: 'Negatif', unit: '/LPK', ref: { type: 'qualitative', normal: ['negatif'] } },
  { no: '', label: 'GRANULA CAST', field: 'urinGranulaCast', refText: 'Negatif', unit: '/LPK', ref: { type: 'qualitative', normal: ['negatif'] } },
];

const getResultStyle = (item, resultValue) => {
  if (resultValue == null || resultValue === '' || !item.ref) return {};
  if (item.ref.type === 'qualitative') {
    const lower = String(resultValue).toLowerCase();
    return !item.ref.normal.includes(lower) ? styles.resultAbnormal : {};
  }
  const num = parseFloat(String(resultValue));
  if (isNaN(num)) return {};
  const range = item.ref.all;
  if (!range) return {};
  const { min, max } = range;
  if ((min !== undefined && num < min) || (max !== undefined && num > max)) return styles.resultAbnormal;
  return {};
};

export const UrinalisaDocument = ({ data }) => (
  <Page size="A4" style={styles.page}>
    <ReportHeader />
    <View style={styles.body}>
      <PatientInfo patient={data?.patient} />
      <Text style={styles.mainTitle}>HASIL PEMERIKSAAN URINALISA</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableColHeader, styles.colNo]}>NO</Text>
          <Text style={[styles.tableColHeader, styles.colJenis]}>JENIS PEMERIKSAAN</Text>
          <Text style={[styles.tableColHeader, styles.colHasil]}>HASIL</Text>
          <Text style={[styles.tableColHeader, styles.colRujukan]}>NILAI RUJUKAN</Text>
          <Text style={[styles.tableColHeader, styles.colSatuan, styles.tableColLast]}>SATUAN</Text>
        </View>

        {urinalisaDataMap.map((item, idx) => {
          if (item.isHeader) {
            return (
              <View style={styles.tableRow} key={`header-${item.no}`}>
                <Text style={[styles.tableCol, styles.colNo, { fontFamily: 'Helvetica-Bold' }]}>{item.no}</Text>
                <Text style={[styles.tableCol, { width: '95%', fontFamily: 'Helvetica-Bold' }, styles.tableColLast]}>{item.label}</Text>
              </View>
            );
          }
          const val = data?.[item.field];
          const abnormal = getResultStyle(item, val);
          return (
            <View style={[styles.tableRow, idx === urinalisaDataMap.length - 1 && styles.tableRowLast]} key={item.field}>
              <Text style={[styles.tableCol, styles.colNo]} />
              <Text style={[styles.tableCol, styles.colJenis]}>{item.label}</Text>
              <Text style={[styles.tableCol, styles.colHasil, abnormal]}>{val || '-'}</Text>
              <Text style={[styles.tableCol, styles.colRujukan]}>{item.refText}</Text>
              <Text style={[styles.tableCol, styles.colSatuan, styles.tableColLast]}>{item.unit}</Text>
            </View>
          );
        })}
      </View>

      {/* Signature ala Hematologi: kanan, tanpa "Pemeriksa," & tanpa garis */}
      {(data?.urinalisaValidatorName || data?.urinalisaValidatorQr) && (
        <View style={{ marginTop: 10, alignItems: 'flex-end', paddingRight: 40 }}>
          {data?.urinalisaValidatorQr && (
            <Image src={data.urinalisaValidatorQr} style={{ width: 80, height: 80, marginBottom: 3 }} />
          )}
          {data?.urinalisaValidatorName && (
            <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>
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
