// components/mcu/report/FasDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

/** ===================== Types ===================== */
type Maybe<T> = T | null | undefined;

type FasId =
  | "fas1"
  | "fas2"
  | "fas3"
  | "fas4"
  | "fas5"
  | "fas6"
  | "fas7"
  | "fas8"
  | "fas9"
  | "fas10";

type FasAnswers = Partial<Record<FasId, string | number>>;

type FasData = {
  patient?: Maybe<Patient>;
  fasTestAnswers?: FasAnswers | null;
  dassFasValidatorName?: string | null;
  dassFasValidatorQr?: string | null;
};

/** ===================== Data & Scoring ===================== */
const fasQuestions: { id: FasId; text: string; reverse?: boolean }[] = [
  { id: "fas1", text: "Saya terganggu karena kelelahan." },
  { id: "fas2", text: "Saya sangat cepat untuk mudah merasa lelah." },
  {
    id: "fas3",
    text: "Saya tidak dapat banyak melakukan sesuatu selama seharian penuh.",
  },
  {
    id: "fas4",
    text: "Saya memiliki energi untuk aktivitas harian.",
    reverse: true,
  },
  { id: "fas5", text: "Secara fisik, saya merasa kelelahan." },
  { id: "fas6", text: "Saya memiliki masalah untuk mulai berpikir." },
  { id: "fas7", text: "Saya memiliki masalah untuk berpikir secara jernih." },
  {
    id: "fas8",
    text: "Saya tidak punya gairah untuk melakukan segala sesuatu.",
  },
  { id: "fas9", text: "Secara mental, saya merasa kelelahan." },
  {
    id: "fas10",
    text: "Ketika saya melakukan sesuatu, saya dapat berkonsentrasi dengan baik.",
    reverse: true,
  },
];

const toScore = (v: unknown): number | null => {
  const n = Number(v as any);
  if (!Number.isFinite(n)) return null;
  if (n < 1 || n > 5) return null;
  return Math.trunc(n);
};

const calculateFasScore = (
  answers?: FasAnswers | null
): { totalScore: number; conclusion: string } => {
  if (!answers) return { totalScore: 0, conclusion: "Data tidak lengkap." };

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

  const conclusion =
    totalScore >= 22
      ? "Terdapat indikasi kelelahan yang signifikan (Skor ≥ 22)."
      : "Tidak terdapat indikasi kelelahan yang signifikan (Skor < 22).";

  return { totalScore, conclusion };
};

/** ===================== Component ===================== */
export const FasDocument: React.FC<{ data: FasData }> = ({ data }) => {
  const { totalScore, conclusion } = calculateFasScore(
    data?.fasTestAnswers ?? undefined
  );

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={localStyles.bodyContainer}>
        <Text style={localStyles.title}>HASIL PEMERIKSAAN FAS</Text>
        <Text style={localStyles.subTitle}>(FATIGUE ASSESSMENT SCALE)</Text>

        <View style={localStyles.resultBox}>
          <Text style={localStyles.scoreLabel}>Total Skor Kelelahan:</Text>
          <Text style={localStyles.scoreValue}>{totalScore}</Text>
        </View>

        <View style={localStyles.conclusionSection}>
          <Text style={localStyles.sectionTitle}>Kesimpulan</Text>
          <Text style={localStyles.conclusionText}>{conclusion}</Text>
        </View>

        {(data?.dassFasValidatorName || data?.dassFasValidatorQr) && (
          <View
            style={{ marginTop: 40, alignItems: "flex-end", paddingRight: 40 }}
          >
            {data?.dassFasValidatorQr && (
              <Image
                src={data.dassFasValidatorQr as string}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.dassFasValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {data.dassFasValidatorName as string}
              </Text>
            )}
            <Text style={{ fontSize: 5 }}>Psikolog / Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  );
};

/** ===================== Styles ===================== */
const localStyles = StyleSheet.create({
  bodyContainer: {
    // memastikan layout konsisten jika globalStyles.body tidak diberi padding dalam beberapa halaman
    paddingHorizontal: 36,
    paddingTop: 12,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    textDecoration: "underline",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 10,
    fontFamily: "Helvetica",
    textAlign: "center",
    marginBottom: 30,
  },
  resultBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    padding: 15,
    marginBottom: 25,
  },
  scoreLabel: { fontSize: 11, fontFamily: "Helvetica" },
  scoreValue: { fontSize: 20, fontFamily: "Helvetica-Bold", marginLeft: 10 },
  conclusionSection: { marginBottom: 25 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 11, marginBottom: 5 },
  conclusionText: { fontSize: 10, lineHeight: 1.5 },
});
