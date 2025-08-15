// components/mcu/report/FasDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type Maybe<T> = T | null | undefined;
type FasId = "fas1" | "fas2" | "fas3" | "fas4" | "fas5" | "fas6" | "fas7" | "fas8" | "fas9" | "fas10";
type FasAnswers = Partial<Record<FasId, string | number>>;
type FasData = {
  patient?: Maybe<Patient & { age?: number }>;
  fasTestAnswers?: FasAnswers | null;
  dassFasValidatorName?: string | null;
  dassFasValidatorQr?: string | null;
};

const fasQuestions: { id: FasId; text: string; reverse?: boolean }[] = [
  { id: "fas1", text: "Saya terganggu karena kelelahan." },
  { id: "fas2", text: "Saya sangat cepat untuk mudah merasa lelah." },
  { id: "fas3", text: "Saya tidak dapat banyak melakukan sesuatu selama seharian penuh." },
  { id: "fas4", text: "Saya memiliki energi untuk aktivitas harian.", reverse: true },
  { id: "fas5", text: "Secara fisik, saya merasa kelelahan." },
  { id: "fas6", text: "Saya memiliki masalah untuk mulai berpikir." },
  { id: "fas7", text: "Saya memiliki masalah untuk berpikir secara jernih." },
  { id: "fas8", text: "Saya tidak punya gairah untuk melakukan segala sesuatu." },
  { id: "fas9", text: "Secara mental, saya merasa kelelahan." },
  { id: "fas10", text: "Ketika saya melakukan sesuatu, saya dapat berkonsentrasi dengan baik.", reverse: true },
];

const toScore = (v: unknown): number | null => {
  const n = Number(v as any);
  if (!Number.isFinite(n) || n < 1 || n > 5) return null;
  return Math.trunc(n);
};

const calculateFasScore = (answers?: FasAnswers | null): { totalScore: number; conclusion: string; category: string } => {
  if (!answers) return { totalScore: 0, conclusion: "Data tidak lengkap.", category: "N/A" };

  let totalScore = 0;
  fasQuestions.forEach((q) => {
    const raw = answers[q.id];
    if (raw != null) {
      let score = toScore(raw);
      if (score != null) {
        if (q.reverse) score = 6 - score;
        totalScore += score;
      }
    }
  });

  const category = totalScore >= 22 ? "FATIGUED" : "FIT";
  const conclusion =
    totalScore >= 22
      ? "Terdapat indikasi kelelahan yang signifikan (Skor ≥ 22)."
      : "Tidak terdapat indikasi kelelahan yang signifikan (Skor < 22).";

  return { totalScore, conclusion, category };
};

export const FasDocument: React.FC<{ data: FasData }> = ({ data }) => {
  const { totalScore, conclusion, category } = calculateFasScore(data?.fasTestAnswers ?? undefined);

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.title}>Laporan Hasil Pemeriksaan</Text>
        <Text style={localStyles.subTitle}>Fatigue Assessment Scale (FAS)</Text>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Identitas Pribadi</Text>
          <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Nama</Text>
            <Text style={localStyles.infoValue}>: {data?.patient?.fullName ?? "-"}</Text>
          </View>
          <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Usia</Text>
            <Text style={localStyles.infoValue}>: {data?.patient?.age ? `${data.patient.age} Tahun` : "-"}</Text>
          </View>
          <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Jenis Kelamin</Text>
            <Text style={localStyles.infoValue}>: {data?.patient?.gender === 'Male' ? 'Laki-laki' : data?.patient?.gender === 'Female' ? 'Perempuan' : "-"}</Text>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.paragraph}>
            Berikut adalah hasil Assessment pasien untuk Fatigue Assessment Scale (FAS):
          </Text>
          <View style={localStyles.resultBox}>
            <Text style={localStyles.resultText}>"{category}, Score ({totalScore})"</Text>
          </View>
          <Text style={localStyles.conclusionText}>{conclusion}</Text>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.paragraph}>
            Manual untuk interpretasi terhadap hasil Fatigue Assessment Scale (FAS):
          </Text>
          <View style={localStyles.table}>
            <View style={localStyles.tableRow}>
              <Text style={[localStyles.tableColHeader, { width: "20%" }]}>Skor</Text>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>Kategori</Text>
              <Text style={[localStyles.tableColHeader, { width: "55%" }]}>Penjelasan</Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text style={[localStyles.tableCol, { width: "20%" }]}>≥ 22</Text>
              <Text style={[localStyles.tableCol, { width: "25%", textAlign: 'left' }]}>FATIGUED (Lelah)</Text>
              <Text style={[localStyles.tableCol, { width: "55%", textAlign: 'left' }]}>
                Terdapat indikasi kelelahan signifikan yang dapat mengganggu aktivitas.
              </Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text style={[localStyles.tableCol, { width: "20%" }]}>{"< 22"}</Text>
              <Text style={[localStyles.tableCol, { width: "25%", textAlign: 'left' }]}>FIT (Bugar)</Text>
              <Text style={[localStyles.tableCol, { width: "55%", textAlign: 'left' }]}>
                Tidak terdapat indikasi kelelahan yang signifikan.
              </Text>
            </View>
          </View>
        </View>

        {(data?.dassFasValidatorName || data?.dassFasValidatorQr) && (
          <View style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}>
            {data?.dassFasValidatorQr && (
              <Image src={data.dassFasValidatorQr as string} style={{ width: 80, height: 80, marginBottom: 8 }} />
            )}
            {data?.dassFasValidatorName && (
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
                {data.dassFasValidatorName as string}
              </Text>
            )}
            <Text style={{ fontSize: 8 }}>Psikolog / Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  );
};

const localStyles = StyleSheet.create({
  title: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2, textAlign: "center" },
  subTitle: { fontSize: 11, fontFamily: "Helvetica", textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 8, textDecoration: 'underline' },
  infoRow: { flexDirection: 'row', marginBottom: 2 },
  infoLabel: { fontSize: 10, width: '20%' },
  infoValue: { fontSize: 10, width: '80%' },
  paragraph: { fontSize: 10, marginBottom: 8, lineHeight: 1.4 },
  resultBox: { borderWidth: 1, borderColor: "#333", padding: 10, marginBottom: 8 },
  resultText: { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: 'center' },
  conclusionText: { fontSize: 10, fontStyle: 'italic' },
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#333" },
  tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#333" },
  tableColHeader: { padding: 5, fontFamily: "Helvetica-Bold", backgroundColor: "#f0f0f0", textAlign: "center", borderRightWidth: 1, borderRightColor: "#333", fontSize: 9 },
  tableCol: { padding: 5, textAlign: "center", borderRightWidth: 1, borderRightColor: "#333", fontSize: 9 },
});