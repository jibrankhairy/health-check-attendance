// components/mcu/report/ConclusionDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

// ————— data maps —————
const hematologyDataMap = [
  { label: 'HEMOGLOBIN', field: 'hemoglobin', ref: { male: { min: 14.0, max: 17.4 }, female: { min: 12.0, max: 14.0 } }, unit: 'g/dL' },
  { label: 'LEUKOSIT', field: 'leukosit', ref: { all: { min: 4000, max: 10000 } }, unit: 'Sel/µL' },
  { label: 'TROMBOSIT', field: 'trombosit', ref: { all: { min: 150000, max: 450000 } }, unit: 'Sel/µL' },
  { label: 'HEMATOKRIT', field: 'hematokrit', ref: { all: { min: 40.0, max: 54.0 } }, unit: '%' },
  { label: 'ERITROSIT', field: 'eritrosit', ref: { all: { min: 4.00, max: 6.10 } }, unit: '10⁶/µL' },
  { label: 'MCV', field: 'mcv', ref: { all: { min: 80.0, max: 96.0 } }, unit: 'fl' },
  { label: 'MCH', field: 'mch', ref: { all: { min: 27.0, max: 31.0 } }, unit: 'pg' },
  { label: 'MCHC', field: 'mchc', ref: { all: { min: 30.0, max: 34.0 } }, unit: 'g/dL' },
  { label: 'RDW', field: 'rdw', ref: { all: { min: 10.0, max: 15.0 } }, unit: '%' },
  { label: 'MPV', field: 'mpv', ref: { all: { min: 6.50, max: 11.0 } }, unit: 'fl' },
  { label: 'PDW', field: 'pdw', ref: { all: { min: 10.0, max: 18.0 } }, unit: 'fl' },
  { label: 'EOSINOFIL', field: 'hitungJenisEosinofil', ref: { all: { min: 1, max: 3 } }, unit: '%' },
  { label: 'BASOFIL', field: 'hitungJenisBasofil', ref: { all: { min: 0, max: 1 } }, unit: '%' },
  { label: 'NEUTROFIL STAB', field: 'hitungJenisNeutrofilStab', ref: { all: { min: 3, max: 5 } }, unit: '%' },
  { label: 'NEUTROFIL SEGMEN', field: 'hitungJenisNeutrofilSegmen', ref: { all: { min: 25, max: 60 } }, unit: '%' },
  { label: 'LIMFOSIT', field: 'hitungJenisLimfosit', ref: { all: { min: 20, max: 40 } }, unit: '%' },
  { label: 'MONOSIT', field: 'hitungJenisMonosit', ref: { all: { min: 4, max: 8 } }, unit: '%' },
  { label: 'LAJU ENDAP DARAH', field: 'led', ref: { all: { min: 0, max: 15 } }, unit: 'mm/jam' },
];

const kimiaDarahDataMap = [
  { label: 'GULA DARAH - PUASA', field: 'gulaDarahPuasa', ref: { all: { min: 75, max: 115 } }, unit: 'mg/dL' },
  { label: 'GULA DARAH - 2 JAM PP', field: 'gulaDarah2JamPP', ref: { all: { max: 140 } }, unit: 'mg/dL' },
  { label: 'CHOLESTEROL TOTAL', field: 'kolesterolTotal', ref: { all: { max: 200 } }, unit: 'mg/dL' },
  { label: 'HDL - CHOLESTEROL', field: 'hdl', ref: { all: { min: 45 } }, unit: 'mg/dL' },
  { label: 'LDL - CHOLESTEROL', field: 'ldl', ref: { all: { max: 130 } }, unit: 'mg/dL' },
  { label: 'TRIGLISERIDA', field: 'trigliserida', ref: { all: { max: 150 } }, unit: 'mg/dL' },
  { label: 'SGOT', field: 'sgot', ref: { all: { max: 40 } }, unit: 'U/L' },
  { label: 'SGPT', field: 'sgpt', ref: { all: { max: 41 } }, unit: 'U/L' },
  { label: 'ASAM URAT', field: 'asamUrat', ref: { male: { min: 3.4, max: 7.0 }, female: { min: 2.4, max: 5.7 } }, unit: 'mg/dL' },
  { label: 'UREUM', field: 'ureum', ref: { all: { min: 10, max: 50 } }, unit: 'mg/dL' },
  { label: 'CREATININ', field: 'kreatinin', ref: { all: { min: 0.5, max: 1.5 } }, unit: 'mg/dL' },
  { label: 'HbsAg', field: 'hbsag', ref: { type: 'qualitative', normal: ['negatif'] }, unit: '' },
];

const urinalisaDataMap = [
  { label: 'BERAT JENIS', field: 'urinBeratJenis', ref: { all: { min: 1.001, max: 1.035 } }, unit: '' },
  { label: 'PH', field: 'urinPh', ref: { all: { min: 4.5, max: 8.0 } }, unit: '' },
  { label: 'PROTEIN', field: 'urinProtein', ref: { type: 'qualitative', normal: ['negatif'] }, unit: 'mg/dL' },
  { label: 'GLUKOSA', field: 'urinGlukosa', ref: { type: 'qualitative', normal: ['negatif'] }, unit: 'mg/dL' },
  { label: 'LEUKOSIT ESTERASE', field: 'urinLeukositEsterase', ref: { type: 'qualitative', normal: ['negatif'] }, unit: '/µL' },
  { label: 'BLOOD', field: 'urinBlood', ref: { type: 'qualitative', normal: ['negatif'] }, unit: 'mg/dL' },
  { label: 'ERITROSIT', field: 'urinSedimenEritrosit', ref: { all: { min: 0, max: 2 } }, unit: '/LPB' },
  { label: 'LEUKOSIT', field: 'urinSedimenLeukosit', ref: { all: { min: 0, max: 5 } }, unit: '/LPB' },
  { label: 'EPITEL SEL', field: 'urinSedimenEpitel', ref: { all: { max: 10 } }, unit: '/LPK' },
];

// ————— helper functions —————
const isAbnormal = (item, resultValue, gender) => {
  if (resultValue == null || resultValue === '' || !item.ref) return false;
  if (item.ref.type === 'qualitative') {
    const lower = String(resultValue).toLowerCase();
    return !item.ref.normal.includes(lower);
  }
  const num = parseFloat(String(resultValue));
  if (isNaN(num)) return false;
  let range = item.ref.all;
  if (item.ref.male && String(gender).toUpperCase() === 'LAKI-LAKI') range = item.ref.male;
  else if (item.ref.female && String(gender).toUpperCase() === 'PEREMPUAN') range = item.ref.female;
  if (!range) return false;
  const { min, max } = range;
  return (min !== undefined && num < min) || (max !== undefined && num > max);
};

const summarizeResults = (data) => {
  const gender = data?.patient?.gender;
  const summaries = {};
  const getAbnormalFindings = (dataMap) => {
    const abnormalResults = dataMap
      .map((item) => {
        const resultValue = data?.[item.field];
        if (isAbnormal(item, resultValue, gender)) {
          const unitText = item.unit ? ` ${item.unit}` : '';
          return `- ${item.label}: ${resultValue}${unitText}`;
        }
        return null;
      })
      .filter(Boolean);
    return abnormalResults.length > 0 ? abnormalResults.join('\n') : 'NORMAL';
  };
  summaries.hematologi = getAbnormalFindings(hematologyDataMap);
  summaries.kimiaDarah = getAbnormalFindings(kimiaDarahDataMap);
  summaries.urinRutin = getAbnormalFindings(urinalisaDataMap);

  const desc = (v) => (!v || String(v).toLowerCase().includes('normal') ? 'NORMAL' : v);
  summaries.rontgen = desc(data?.kesanRontgen);
  summaries.ekg = desc(data?.ekgConclusion);
  summaries.mammae = desc(data?.usgMammaeKesimpulan);
  summaries.abdomen = desc(data?.usgAbdomenKesimpulan);
  summaries.fisik = 'NORMAL';
  return summaries;
};

// ————— ConclusionRow —————
const ConclusionRow = ({ number, label, value }) => {
  const lines = String(value).split("\n");
  return (
    <View style={localStyles.row}>
      <Text style={localStyles.num}>{number}.</Text>
      <Text style={localStyles.labelDynamic}>{label}</Text>
      <Text style={localStyles.colon}>:</Text>
      <View style={localStyles.valueFlex}>
        {lines.map((line, idx) => (
          <Text
            key={idx}
            style={[
              localStyles.valueLine,
              idx < lines.length - 1 && { marginBottom: 1 }, // multi-line rapat
            ]}
          >
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
};

// ————— component —————
export const ConclusionDocument = ({ data }) => {
  const summaries = summarizeResults(data);

  let saranList: string[] = [];
  if (data?.saran && typeof data.saran === 'string') {
    try { saranList = JSON.parse(data.saran); } catch { saranList = []; }
  } else if (Array.isArray(data?.saran)) {
    saranList = data.saran;
  }

  const hasSignature = !!(data?.conclusionValidatorName || data?.conclusionValidatorQr);

  return (
    <Page size="A4" style={{ ...globalStyles.page, paddingTop: 120 }}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={globalStyles.mainTitle}>KESIMPULAN DAN REKOMENDASI</Text>

        <View style={globalStyles.conclusionContainer}>
          <Text style={globalStyles.sectionTitle}>RESUME HASIL PEMERIKSAAN SEBAGAI BERIKUT :</Text>
          <View style={{ gap: 6 }}> {/* spasi antar item */}
            <ConclusionRow number="1" label="Pemeriksaan Fisik" value={summaries.fisik} />
            <ConclusionRow number="2" label="Lab - Hematologi Darah Rutin" value={summaries.hematologi} />
            <ConclusionRow number="3" label="Lab - Hasil Kimia Darah" value={summaries.kimiaDarah} />
            <ConclusionRow number="4" label="Lab - Urin Rutin" value={summaries.urinRutin} />
            <ConclusionRow number="5" label="Pemeriksaan Rontgen Thorax" value={summaries.rontgen} />
            <ConclusionRow number="6" label="Pemeriksaan EKG" value={summaries.ekg} />
            <ConclusionRow number="7" label="Pemeriksaan Mammae" value={summaries.mammae} />
            <ConclusionRow number="8" label="Pemeriksaan USG Abdomen" value={summaries.abdomen} />
          </View>
        </View>

        <View style={globalStyles.conclusionContainer}>
          <Text style={globalStyles.sectionTitle}>
            DARI HASIL PEMERIKSAAN DI ATAS, MAKA DAPAT DISIMPULKAN BAHWA KONDISI PASIEN:
          </Text>
          <View style={globalStyles.conclusionBox}>
            <Text style={globalStyles.conclusionText}>{data?.kesimpulan || 'FIT TO WORK'}</Text>
          </View>
        </View>

        {/* ======= SARAN + SIGNATURE ======= */}
        <View style={globalStyles.conclusionContainer}>
          <Text style={globalStyles.sectionTitle}>SARAN YANG DAPAT DIBERIKAN:</Text>

          <View style={localStyles.saranRow}>
            <View style={[localStyles.saranCol, { width: hasSignature ? '68%' : '100%' }]}>
              {saranList.length > 0 ? (
                saranList.map((saran, idx) => (
                  <Text key={idx} style={localStyles.saranItem}>- {saran}</Text>
                ))
              ) : (
                <Text style={localStyles.saranItem}>Tidak ada saran tambahan.</Text>
              )}
            </View>

            {hasSignature && (
              <View style={localStyles.signCol}>
                {data?.conclusionValidatorQr && (
                  <Image
                    src={data.conclusionValidatorQr}
                    style={{ width: 70, height: 70, marginBottom: 3 }}
                  />
                )}
                {data?.conclusionValidatorName && (
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>
                    {data.conclusionValidatorName}
                  </Text>
                )}
                <Text style={{ fontSize: 5 }}>Validator</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ReportFooter />
    </Page>
  );
};

// ————— styles —————
const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    fontSize: 9,
  },
  num: { width: '5%' },
  labelDynamic: {
    minWidth: '40%', // ":" sejajar
    flexShrink: 0,
  },
  colon: {
    width: 8,
    textAlign: 'center',
  },
  valueFlex: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  valueLine: {
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
    fontSize: 9,
  },
  saranItem: { marginBottom: 3, fontSize: 9 },
  saranRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  saranCol: { paddingRight: 6 },
  signCol: { width: '30%', alignItems: 'flex-end', paddingRight: 6 },
});
