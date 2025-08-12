// components/mcu/report/CoverPageDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

const localStyles = StyleSheet.create({
  bodyContent: {
    flexGrow: 1,
  },
  coverHeader: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "38%",
    color: "#333",
    fontSize: 11,
  },
  value: {
    width: "62%",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  colon: {
    marginHorizontal: 6,
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    marginTop: 26,
    marginBottom: 8,
  },

  // List "Hasil Terlampir"
  listWrap: { marginTop: 6 },
  listRow: { flexDirection: "row", marginBottom: 6 },
  listNo: { width: "6%", fontSize: 10 },
  listText: { width: "94%", fontSize: 10 },

  // Subjudul kategori (cetak miring tebal)
  subheading: {
    fontFamily: "Helvetica-BoldOblique",
    fontSize: 10,
    marginTop: 6,
    marginBottom: 2,
  },
});

type ReportData = {
  patient: {
    fullName: string;
    dob: string;
    age: number;
    gender: string;
    company: { name: string };
    mcuPackage?: string[]; // <— penting untuk hasil terlampir
  };
  examinationDate: string;
  examinationTime: string;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Invalid Date";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/** Bangun daftar "Hasil Terlampir" dari paket + add-ons */
function buildAttachedList(data: ReportData) {
  const raw = data?.patient?.mcuPackage || [];
  const lower = raw.map((x) => (x || "").toString().toLowerCase());
  const has = (s: string) => lower.includes(s.toLowerCase());

  // Lab
  const showHematologi = has("mcu regular") || has("mcu eksekutif") || has("mcu akhir");
  const showKimiaDarah = showHematologi;
  const showUrinalisa = showHematologi;

  // Penunjang
  const showRontgen =
    showHematologi || has("radiologi thoraks");
  const showEkg = has("mcu eksekutif") || has("ekg") || has("treadmill");
  const showAudiometri = has("mcu eksekutif") || has("audiometri");
  const showSpirometri = has("mcu eksekutif") || has("spirometri");
  const showUsgAbdomen = has("mcu eksekutif") || has("usg whole abdomen");
  const showUsgMammae = has("mcu eksekutif") || has("usg mammae");

  const list: Array<{ type: "item" | "subhead"; text: string }> = [];

  // 1–2 selalu ada
  list.push({ type: "item", text: "RESUME DAN KESIMPULAN PEMERIKSAAN KESEHATAN" });
  list.push({ type: "item", text: "HASIL PEMERIKSAAN FISIK" });

  // Lab
  const labItems: string[] = [];
  if (showHematologi) labItems.push("HEMATOLOGI DARAH RUTIN");
  if (showKimiaDarah) labItems.push("KIMIA DARAH");
  if (showUrinalisa) labItems.push("URINE RUTIN");
  if (labItems.length) {
    list.push({ type: "subhead", text: "HASIL PEMERIKSAAN LABORATORIUM" });
    labItems.forEach((t) => list.push({ type: "item", text: t }));
  }

  // Penunjang
  const penunjangItems: string[] = [];
  if (showRontgen) penunjangItems.push("HASIL PEMERIKSAAN RONTGEN");
  if (showEkg) penunjangItems.push("HASIL PEMERIKSAAN EKG");
  if (showAudiometri) penunjangItems.push("HASIL PEMERIKSAAN AUDIOMETRI");
  if (showSpirometri) penunjangItems.push("HASIL PEMERIKSAAN SPIROMETRI");
  if (showUsgMammae) penunjangItems.push("HASIL PEMERIKSAAN USG MAMMAE");
  if (showUsgAbdomen) penunjangItems.push("HASIL PEMERIKSAAN USG ABDOMEN");
  if (penunjangItems.length) {
    list.push({ type: "subhead", text: "HASIL PEMERIKSAAN PENUNJANG MEDIS" });
    penunjangItems.forEach((t) => list.push({ type: "item", text: t }));
  }

  return list;
}

export const CoverPageDocument = ({ data }: { data: ReportData }) => {
  const attached = buildAttachedList(data);

  let runningNo = 0;

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />

      <View style={localStyles.bodyContent}>
        <Text style={localStyles.coverHeader}>
          IDENTITAS PESERTA PEMERIKSAAN KESEHATAN
        </Text>

        {/* Identitas */}
        <View style={localStyles.section}>
          <View style={localStyles.row}>
            <Text style={localStyles.label}>NAMA LENGKAP</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.fullName?.toUpperCase() || "-"}
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>TANGGAL LAHIR / UMUR</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {formatDate(data.patient.dob)} / {data.patient.age} Tahun
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>JENIS KELAMIN</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.gender?.toUpperCase() || "-"}
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>TANGGAL PEMERIKSAAN</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>{formatDate(data.examinationDate)}</Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>JAM PEMERIKSAAN</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>{data.examinationTime || "-"}</Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>PERUSAHAAN</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.company?.name?.toUpperCase() || "-"}
            </Text>
          </View>
        </View>

        {/* Hasil terlampir dinamis */}
        <Text style={localStyles.title}>HASIL TERLAMPIR :</Text>

        <View style={localStyles.listWrap}>
          {attached.map((entry, idx) => {
            if (entry.type === "subhead") {
              return (
                <Text key={`sub-${idx}`} style={localStyles.subheading}>
                  {entry.text}
                </Text>
              );
            }
            // item bernomor
            runningNo += 1;
            return (
              <View key={`it-${idx}`} style={localStyles.listRow}>
                <Text style={localStyles.listNo}>{runningNo}.</Text>
                <Text style={localStyles.listText}>{entry.text}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <ReportFooter />
    </Page>
  );
};
