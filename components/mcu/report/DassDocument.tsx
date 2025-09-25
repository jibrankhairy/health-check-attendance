"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type Maybe<T> = T | null | undefined;

type Scale = "d" | "a" | "s";
type DassId = `dass${number}`;
type DassAnswers = Partial<Record<DassId, string | number>>;
type DassAnswersInput = DassAnswers | { raw?: DassAnswers } | null | undefined;

type DassData = {
  patient?: Maybe<Patient & { age?: number }>;
  dassTestAnswers?: DassAnswers | null;
  dassFasValidatorName?: string | null;
  dassFasValidatorQr?: string | null;
};

const dassQuestions: { id: DassId; scale: Scale }[] = [
  { id: "dass1", scale: "s" },
  { id: "dass2", scale: "a" },
  { id: "dass3", scale: "d" },
  { id: "dass4", scale: "a" },
  { id: "dass5", scale: "d" },
  { id: "dass6", scale: "s" },
  { id: "dass7", scale: "a" },
  { id: "dass8", scale: "s" },
  { id: "dass9", scale: "a" },
  { id: "dass10", scale: "d" },
  { id: "dass11", scale: "s" },
  { id: "dass12", scale: "s" },
  { id: "dass13", scale: "d" },
  { id: "dass14", scale: "s" },
  { id: "dass15", scale: "a" },
  { id: "dass16", scale: "d" },
  { id: "dass17", scale: "d" },
  { id: "dass18", scale: "s" },
  { id: "dass19", scale: "a" },
  { id: "dass20", scale: "a" },
  { id: "dass21", scale: "d" },
];

const calculateDassScores = (answers?: DassAnswersInput) => {
  const flat: DassAnswers | null =
    answers && typeof answers === "object" && "raw" in (answers as any)
      ? ((answers as any).raw as DassAnswers)
      : (answers as any as DassAnswers) ?? null;

  if (!flat) return { depression: 0, anxiety: 0, stress: 0 };

  const scores: Record<Scale, number> = { d: 0, a: 0, s: 0 };

  dassQuestions.forEach((q) => {
    const raw = flat[q.id as keyof DassAnswers];
    if (raw != null && raw !== "") {
      const v = Number(raw);
      if (Number.isFinite(v)) scores[q.scale] += v;
    }
  });

  return {
    depression: scores.d * 2,
    anxiety: scores.a * 2,
    stress: scores.s * 2,
  };
};

type Domain = "depression" | "anxiety" | "stress";
const cutoffs: Record<
  Domain,
  {
    normal: number;
    mild: number;
    moderate: number;
    severe: number;
    extremelySevere: number;
  }
> = {
  depression: {
    normal: 9,
    mild: 13,
    moderate: 20,
    severe: 27,
    extremelySevere: 999,
  },
  anxiety: {
    normal: 7,
    mild: 9,
    moderate: 14,
    severe: 19,
    extremelySevere: 999,
  },
  stress: {
    normal: 14,
    mild: 18,
    moderate: 25,
    severe: 33,
    extremelySevere: 999,
  },
};

const getSeverity = (
  scale: Domain,
  score: number
): "Normal" | "Ringan" | "Sedang" | "Parah" | "Sangat Parah" => {
  if (score <= cutoffs[scale].normal) return "Normal";
  if (score <= cutoffs[scale].mild) return "Ringan";
  if (score <= cutoffs[scale].moderate) return "Sedang";
  if (score <= cutoffs[scale].severe) return "Parah";
  return "Sangat Parah";
};

export const DassDocument: React.FC<{ data: DassData }> = ({ data }) => {
  const scores = calculateDassScores(data?.dassTestAnswers);
  const results = {
    depression: {
      score: scores.depression,
      severity: getSeverity("depression", scores.depression),
    },
    anxiety: {
      score: scores.anxiety,
      severity: getSeverity("anxiety", scores.anxiety),
    },
    stress: {
      score: scores.stress,
      severity: getSeverity("stress", scores.stress),
    },
  };

  const getGenderDisplay = (gender?: string | null): string => {
    const g = (gender || "").toLowerCase();
    if (g === "male" || g === "laki-laki") return "Laki-laki";
    if (g === "female" || g === "perempuan") return "Perempuan";
    return "-";
  };

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.title}>Laporan Hasil Pemeriksaan</Text>
        <Text style={localStyles.subTitle}>
          Depression Anxiety Stress (DASS-21)
        </Text>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Identitas Pribadi</Text>
          <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Nama</Text>
            <Text style={localStyles.infoValue}>
              : {data?.patient?.fullName ?? "-"}
            </Text>
          </View>
          <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Usia</Text>
            <Text style={localStyles.infoValue}>
              : {data?.patient?.age ? `${data.patient.age} Tahun` : "-"}
            </Text>
          </View>
          <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Jenis Kelamin</Text>
            <Text style={localStyles.infoValue}>
              : {getGenderDisplay(data?.patient?.gender)}
            </Text>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.paragraph}>
            Berikut adalah hasil Assessment pasien untuk Depression Anxiety
            Stress Scale (DASS):
          </Text>
          <View style={localStyles.table}>
            <View style={localStyles.tableRow}>
              <Text style={[localStyles.tableColHeader, { width: "50%" }]}>
                Trait
              </Text>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>
                Score
              </Text>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>
                Kategori
              </Text>
            </View>

            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "50%", textAlign: "left" },
                ]}
              >
                Depression
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                {results.depression.score}
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                {results.depression.severity}
              </Text>
            </View>

            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "50%", textAlign: "left" },
                ]}
              >
                Anxiety
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                {results.anxiety.score}
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                {results.anxiety.severity}
              </Text>
            </View>

            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "50%", textAlign: "left" },
                ]}
              >
                Stress
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                {results.stress.score}
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                {results.stress.severity}
              </Text>
            </View>
          </View>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.paragraph}>
            Manual untuk interpretasi terhadap hasil Depression Anxiety Stress
            Scale (DASS):
          </Text>
          <View style={localStyles.table}>
            <View style={localStyles.tableRow}>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>
                Kategori
              </Text>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>
                Depression
              </Text>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>
                Anxiety
              </Text>
              <Text style={[localStyles.tableColHeader, { width: "25%" }]}>
                Stress
              </Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "25%", textAlign: "left" },
                ]}
              >
                Normal
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>0-9</Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>0-7</Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>0-14</Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "25%", textAlign: "left" },
                ]}
              >
                Ringan
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                10-13
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>8-9</Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                15-18
              </Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "25%", textAlign: "left" },
                ]}
              >
                Sedang
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                14-20
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                10-14
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                19-25
              </Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "25%", textAlign: "left" },
                ]}
              >
                Parah
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                21-27
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                15-19
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>
                26-33
              </Text>
            </View>
            <View style={localStyles.tableRow}>
              <Text
                style={[
                  localStyles.tableCol,
                  { width: "25%", textAlign: "left" },
                ]}
              >
                Sangat Parah
              </Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>28+</Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>20+</Text>
              <Text style={[localStyles.tableCol, { width: "25%" }]}>34+</Text>
            </View>
          </View>
        </View>

        {(data?.dassFasValidatorName || data?.dassFasValidatorQr) && (
          <View style={localStyles.validatorBox}>
            {data?.dassFasValidatorQr && (
              <Image
                src={data.dassFasValidatorQr as string}
                style={localStyles.validatorQr}
              />
            )}
            {data?.dassFasValidatorName && (
              <Text style={localStyles.validatorName}>
                {data.dassFasValidatorName as string}
              </Text>
            )}
            <Text style={localStyles.validatorLabel}>Psikolog / Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  );
};

const localStyles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 11,
    fontFamily: "Helvetica",
    textAlign: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    textDecoration: "underline",
  },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: { fontSize: 10, width: "20%" },
  infoValue: { fontSize: 10, width: "80%" },
  paragraph: { fontSize: 10, marginBottom: 8, lineHeight: 1.4 },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#333",
  },
  tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#333" },
  tableColHeader: {
    padding: 5,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#333",
    fontSize: 9,
  },
  tableCol: {
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#333",
    fontSize: 9,
  },
  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 72,
    alignItems: "center",
  },
  validatorQr: { width: 80, height: 80, marginBottom: 8 },
  validatorName: { fontSize: 8, fontFamily: "Helvetica-Bold" },
  validatorLabel: { fontSize: 5 },
});
