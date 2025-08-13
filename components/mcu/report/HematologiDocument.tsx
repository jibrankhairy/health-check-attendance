// components/mcu/report/HematologiDocument.tsx
"use client";

import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from './reportStyles';

const hematologyDataMap = [
  { no: 1, label: 'HEMOGLOBIN', field: 'hemoglobin', ref: { male: { min: 14.0, max: 17.4 }, female: { min: 12.0, max: 14.0 } }, unit: 'g/dL', refText: 'P: 14.0-17.4, W: 12.0-14.0' },
  { no: 2, label: 'LEUKOSIT', field: 'leukosit', ref: { all: { min: 4000, max: 10000 } }, unit: 'Sel/µL', refText: '4.000-10.000' },
  { no: 3, label: 'TROMBOSIT', field: 'trombosit', ref: { all: { min: 150000, max: 450000 } }, unit: 'Sel/µL', refText: '150.000-450.000' },
  { no: 4, label: 'HEMATOKRIT', field: 'hematokrit', ref: { all: { min: 40.0, max: 54.0 } }, unit: '%', refText: '40.0-54.0' },
  { no: 5, label: 'ERITROSIT', field: 'eritrosit', ref: { all: { min: 4.00, max: 6.10 } }, unit: '10⁶/µL', refText: '4.00-6.10' },
  { no: 6, label: 'MCV', field: 'mcv', ref: { all: { min: 80.0, max: 96.0 } }, unit: 'fl', refText: '80.0-96.0' },
  { no: 7, label: 'MCH', field: 'mch', ref: { all: { min: 27.0, max: 31.0 } }, unit: 'pg', refText: '27.0-31.0' },
  { no: 8, label: 'MCHC', field: 'mchc', ref: { all: { min: 30.0, max: 34.0 } }, unit: 'g/dL', refText: '30.0-34.0' },
  { no: 9, label: 'RDW', field: 'rdw', ref: { all: { min: 10.0, max: 15.0 } }, unit: '%', refText: '10.0-15.0' },
  { no: 10, label: 'MPV', field: 'mpv', ref: { all: { min: 6.50, max: 11.0 } }, unit: 'fl', refText: '6.50-11.0' },
  { no: 11, label: 'PDW', field: 'pdw', ref: { all: { min: 10.0, max: 18.0 } }, unit: 'fl', refText: '10.0-18.0' },
  { no: 12, label: 'EOSINOFIL', field: 'hitungJenisEosinofil', ref: { all: { min: 1, max: 3 } }, unit: '%', refText: '1-3' },
  { no: 13, label: 'BASOFIL', field: 'hitungJenisBasofil', ref: { all: { min: 0, max: 1 } }, unit: '%', refText: '0-1' },
  { no: 14, label: 'NEUTROFIL STAB', field: 'hitungJenisNeutrofilStab', ref: { all: { min: 3, max: 5 } }, unit: '%', refText: '3-5' },
  { no: 15, label: 'NEUTROFIL SEGMEN', field: 'hitungJenisNeutrofilSegmen', ref: { all: { min: 25, max: 60 } }, unit: '%', refText: '25-60' },
  { no: 16, label: 'LIMFOSIT', field: 'hitungJenisLimfosit', ref: { all: { min: 20, max: 40 } }, unit: '%', refText: '20-40' },
  { no: 17, label: 'MONOSIT', field: 'hitungJenisMonosit', ref: { all: { min: 4, max: 8 } }, unit: '%', refText: '4-8' },
  { no: 18, label: 'LAJU ENDAP DARAH', field: 'led', ref: { all: { min: 0, max: 15 } }, unit: 'mm/jam', refText: '0-15' },
];

const getResultStyle = (item, resultValue, gender) => {
  if (resultValue === null || resultValue === undefined || resultValue === '' || !item.ref) {
    return {};
  }

  const numericResult = parseFloat(String(resultValue));
  if (isNaN(numericResult)) return {};

  let normalRange = item.ref.all;
  if (item.ref.male && String(gender).toUpperCase() === 'LAKI-LAKI') {
    normalRange = item.ref.male;
  } else if (item.ref.female && String(gender).toUpperCase() === 'PEREMPUAN') {
    normalRange = item.ref.female;
  }

  if (!normalRange) return {};

  const { min, max } = normalRange;
  if ((min !== undefined && numericResult < min) || (max !== undefined && numericResult > max)) {
    return styles.resultAbnormal;
  }

  return {};
};

export const HematologiDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <ReportHeader />
      
      <View style={styles.body}>
        <PatientInfo patient={data?.patient} />
        
        <Text style={styles.mainTitle}>HASIL PEMERIKSAAN HEMATOLOGI</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.colNo]}>NO</Text>
            <Text style={[styles.tableColHeader, styles.colJenis]}>JENIS PEMERIKSAAN</Text>
            <Text style={[styles.tableColHeader, styles.colHasil]}>HASIL</Text>
            <Text style={[styles.tableColHeader, styles.colRujukan]}>NILAI RUJUKAN</Text>
            <Text style={[styles.tableColHeader, styles.colSatuan, styles.tableColLast]}>SATUAN</Text>
          </View>
          
          {hematologyDataMap.map((item, index) => {
            const resultValue = data?.[item.field];
            const resultStyle = getResultStyle(item, resultValue, data?.patient?.gender);

            return (
              <View style={[styles.tableRow, index === hematologyDataMap.length - 1 && styles.tableRowLast]} key={item.no}>
                <Text style={[styles.tableCol, styles.colNo]}>{item.no}</Text>
                <Text style={[styles.tableCol, styles.colJenis]}>{item.label}</Text>
                <Text style={[styles.tableCol, styles.colHasil, resultStyle]}>
                  {resultValue || '-'}
                </Text>
                <Text style={[styles.tableCol, styles.colRujukan]}>{item.refText}</Text>
                <Text style={[styles.tableCol, styles.colSatuan, styles.tableColLast]}>{item.unit}</Text>
              </View>
            );
          })}
        </View>

        {/* Tanda tangan validator */}
        {(data?.hematologiValidatorName || data?.hematologiValidatorQr) && (
          <View style={{ marginTop: 10, alignItems: 'flex-end', paddingRight: 40 }}>
            {data?.hematologiValidatorQr && (
              <Image
                src={data.hematologiValidatorQr}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.hematologiValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>
                {data.hematologiValidatorName}
              </Text>
            )}
            <Text style={{ fontSize: 5 }}>Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  </Document>
);
