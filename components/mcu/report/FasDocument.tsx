"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

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
  patient?: Maybe<Patient & { age?: number }>;
  fasTestAnswers?: FasAnswers | null;
  dassFasValidatorName?: string | null;
  dassFasValidatorQr?: string | null;
};

const fasQuestions: { id: FasId; reverse?: boolean }[] = [
  { id: "fas1" },
  { id: "fas2" },
  { id: "fas3" },
  { id: "fas4", reverse: true },
  { id: "fas5" },
  { id: "fas6" },
  { id: "fas7" },
  { id: "fas8" },
  { id: "fas9" },
  { id: "fas10", reverse: true },
];

const toScore = (v: unknown): number | null => {
  const n = Number(v as any);
  if (!Number.isFinite(n) || n < 1 || n > 5) return null;
  return Math.trunc(n);
};

const normalizeToTen = (total: number): number => {
  const clamped = Math.max(10, Math.min(50, total));
  const normalized = Math.round(((clamped - 10) / 40) * 9 + 1);
  return Math.max(1, Math.min(10, normalized));
};

type Category = "FIT" | "SLIGHTLY TIRED" | "TIRED" | "FATIGUED" | "N/A";

const categoryFromScore = (s: number | null): Category => {
  if (s == null) return "N/A";
  if (s >= 10) return "FATIGUED"; // 10
  if (s >= 7) return "TIRED"; // 7..9
  if (s >= 4) return "SLIGHTLY TIRED"; // 4..6
  return "FIT"; // 1..3
};

const categoryExplanation: Record<Exclude<Category, "N/A">, string> = {
  FATIGUED:
    "Tidak dapat mengatasi kelelahan akibat aktivitas berat dimana kondisi kesehatan mengalami gangguan.",
  TIRED:
    "Rutin melakukan aktivitas yang berat dan kurang istirahat yang cukup.",
  "SLIGHTLY TIRED":
    "Mengalami sedikit kelelahan karena melakukan aktivitas yang cukup berat.",
  FIT: "Faktor terjadi lelah karena adanya aktivitas normal, hanya membutuhkan tidur yang cukup.",
};

const calculateFas = (
  answers?: FasAnswers | null
): {
  rawTotal: number | null;
  score1to10: number | null;
  category: Category;
  explanation?: string;
} => {
  if (!answers) return { rawTotal: null, score1to10: null, category: "N/A" };

  let total = 0;
  let answered = 0;

  fasQuestions.forEach((q) => {
    const raw = answers[q.id];
    const base = toScore(raw);
    if (base != null) {
      answered++;
      const v = q.reverse ? 6 - base : base;
      total += v;
    }
  });

  if (answered === 0)
    return { rawTotal: null, score1to10: null, category: "N/A" };

  const score1to10 = normalizeToTen(total);
  const category = categoryFromScore(score1to10);
  const explanation =
    category === "N/A"
      ? undefined
      : categoryExplanation[category as Exclude<Category, "N/A">];

  return { rawTotal: total, score1to10, category, explanation };
};

const getGenderDisplay = (gender?: string | null): string => {
  const g = (gender || "").toLowerCase();
  if (g === "male" || g === "laki-laki") return "Laki-laki";
  if (g === "female" || g === "perempuan") return "Perempuan";
  return "-";
};

export const FasDocument: React.FC<{ data: FasData }> = ({ data }) => {
  const result = calculateFas(data?.fasTestAnswers ?? undefined);

  const scoreDisplay =
    result.score1to10 == null ? "-" : String(result.score1to10);
  const categoryDisplay = result.category === "N/A" ? "-" : result.category;

  // Definisi “rowspan” per rentang skor
  const ROW_H = 20; // tinggi 1 baris skor (kompak)
  const scoreRows = Array.from({ length: 10 }, (_, i) => 10 - i); // 10..1

  const groups: Array<{
    label: Exclude<Category, "N/A">;
    from: number; // inclusive
    to: number; // inclusive
    explanation: string;
  }> = [
    {
      label: "FATIGUED",
      from: 10,
      to: 10,
      explanation: categoryExplanation.FATIGUED,
    },
    { label: "TIRED", from: 9, to: 7, explanation: categoryExplanation.TIRED },
    {
      label: "SLIGHTLY TIRED",
      from: 6,
      to: 4,
      explanation: categoryExplanation["SLIGHTLY TIRED"],
    },
    { label: "FIT", from: 3, to: 1, explanation: categoryExplanation.FIT },
  ];

  const groupHeight = (g: (typeof groups)[number]) =>
    (g.from - g.to + 1) * ROW_H;

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={s.title}>LAPORAN HASIL PEMERIKSAAN</Text>
        <Text style={s.subTitle}>Fatigue Assessment Scale (FAS)</Text>

        {/* Identitas */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Identitas Pribadi</Text>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Nama</Text>
            <Text style={s.infoValue}>: {data?.patient?.fullName ?? "-"}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Usia</Text>
            <Text style={s.infoValue}>
              : {data?.patient?.age ? `${data.patient.age} Tahun` : "-"}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Jenis Kelamin</Text>
            <Text style={s.infoValue}>
              : {getGenderDisplay(data?.patient?.gender)}
            </Text>
          </View>
        </View>

        {/* Hasil */}
        <View style={s.section}>
          <Text style={s.paragraph}>
            Berikut adalah hasil Assessment pasien untuk Fatigue Assessment
            Scale (FAS):
          </Text>
          <View style={s.resultBox}>
            <Text style={s.resultText}>
              {categoryDisplay}, Score ({scoreDisplay})
            </Text>
          </View>
          {result.explanation && (
            <Text style={s.conclusionText}>{result.explanation}</Text>
          )}
        </View>

        {/* Tabel interpretasi dengan “merge & center” per rentang skor */}
        <View style={s.section}>
          <Text style={s.paragraph}>
            Manual untuk interpretasi terhadap hasil Fatigue Assessment Scale
            (FAS):
          </Text>

          {/* Header */}
          <View style={s.table}>
            <View style={s.tableHeaderRow}>
              <Text style={[s.tableColHeader, { width: "15%" }]}>Score</Text>
              <Text style={[s.tableColHeader, { width: "25%" }]}>Kategori</Text>
              <Text style={[s.tableColHeader, { width: "60%" }]}>
                Penjelasan
              </Text>
            </View>

            {/* Body emulasi rowspan */}
            <View style={s.tableBody}>
              {/* Kolom Score: 10 baris */}
              <View style={[s.bodyCol, { width: "15%" }]}>
                {scoreRows.map((sc, idx) => (
                  <View
                    key={sc}
                    style={[
                      s.scoreRow,
                      {
                        height: ROW_H,
                        borderTopWidth: idx === 0 ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={s.scoreText}>{sc}</Text>
                  </View>
                ))}
              </View>

              {/* Kolom Kategori: 4 blok digabung */}
              <View style={[s.bodyCol, { width: "25%" }]}>
                {groups.map((g, i) => (
                  <View
                    key={g.label}
                    style={[
                      s.mergeCell,
                      {
                        height: groupHeight(g),
                        borderTopWidth: i === 0 ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={s.mergeText}>{g.label}</Text>
                  </View>
                ))}
              </View>

              {/* Kolom Penjelasan: 4 blok digabung */}
              <View style={[s.bodyCol, { width: "60%" }]}>
                {groups.map((g, i) => (
                  <View
                    key={g.label}
                    style={[
                      s.mergeCellLeftAlign,
                      {
                        height: groupHeight(g),
                        borderTopWidth: i === 0 ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={s.mergeTextLeft}>{g.explanation}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={s.note}>
            Catatan: Penentuan kategori hasil mengikuti tabel interpretasi di
            atas (1–3 = FIT, 4–6 = SLIGHTLY TIRED, 7–9 = TIRED, 10 = FATIGUED).
          </Text>
        </View>

        <View style={{ height: 8 }} />
      </View>

      {(data?.dassFasValidatorName || data?.dassFasValidatorQr) && (
        <View style={s.validatorBox}>
          {data?.dassFasValidatorQr && (
            <Image
              src={data.dassFasValidatorQr as string}
              style={s.validatorQr}
            />
          )}
          {data?.dassFasValidatorName && (
            <Text style={s.validatorName}>
              {data.dassFasValidatorName as string}
            </Text>
          )}
          <Text style={s.validatorLabel}>Psikolog / Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};

const s = StyleSheet.create({
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
    marginBottom: 16,
  },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    textDecoration: "underline",
  },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: { fontSize: 10, width: "22%" },
  infoValue: { fontSize: 10, width: "78%" },

  paragraph: { fontSize: 10, marginBottom: 6, lineHeight: 1.3 },

  resultBox: {
    borderWidth: 1,
    borderColor: "#333",
    padding: 8,
    marginBottom: 6,
  },
  resultText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  conclusionText: { fontSize: 10, fontStyle: "italic" },

  // Table shell
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#333",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tableColHeader: {
    padding: 4,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#333",
    fontSize: 8,
  },
  tableBody: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 150, // 10 baris x 15
  },
  bodyCol: {
    borderRightWidth: 1,
    borderRightColor: "#333",
  },

  // Kolom Score: 10 baris rata tengah
  scoreRow: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  scoreText: { fontSize: 8, textAlign: "center" },

  // Kolom Kategori (merged cells)
  mergeCell: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderTopColor: "#333",
  },
  mergeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },

  mergeCellLeftAlign: {
    justifyContent: "center",
    paddingHorizontal: 6,
    borderTopColor: "#333",
  },
  mergeTextLeft: {
    fontSize: 8,
    textAlign: "left",
    lineHeight: 1.25,
  },

  note: { fontSize: 8, marginTop: 6, fontStyle: "italic" },

  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 70,
    alignItems: "center",
  },
  validatorQr: {
    width: 70,
    height: 70,
    marginBottom: 6,
  },
  validatorName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  validatorLabel: {
    fontSize: 5,
  },
});
