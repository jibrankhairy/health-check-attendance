"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

const cm = (n: number) => n * 28.3465;

const PHOTO_W = cm(3.4);
const PHOTO_H = cm(4.5);

const localStyles = StyleSheet.create({
  bodyContent: {
    flexGrow: 1,
  },
  photoContainer: {
    marginTop: 8,
    alignItems: "center",
    marginBottom: 6,
  },
  photo: {
    width: PHOTO_W,
    height: PHOTO_H,
    objectFit: "cover",
    border: "0.75pt solid #E5E7EB",
  },
  coverHeader: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 15,
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
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
    marginTop: 15,
    marginBottom: 8,
  },
  listWrap: { marginTop: 3 },
  listRow: { flexDirection: "row", marginBottom: 6 },
  listNo: { width: "6%", fontSize: 10 },
  listText: { width: "94%", fontSize: 10 },
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
    nik: string;
    division: string;
    position: string;
    company: { name: string };
    mcuPackage?: string[];
    photoUrl?: string;
  };
  examinationStartedAt?: string | Date;
};

const formatDate = (dateInput?: string | Date) => {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Invalid Date";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatTime = (dateInput?: string | Date) => {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Invalid Time";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

function buildAttachedList(data: ReportData) {
  const raw = data?.patient?.mcuPackage || [];
  const lower = raw.map((x) => (x || "").toString().toLowerCase());
  const has = (s: string) => lower.includes(s.toLowerCase());

  // Logika paket dasar
  const hasBasicMcu =
    has("mcu regular") ||
    has("mcu eksekutif") ||
    has("mcu akhir") ||
    has("mcu dmc");

  const list: Array<{ type: "item" | "subhead"; text: string }> = [];

  list.push({
    type: "item",
    text: "RESUME DAN KESIMPULAN PEMERIKSAAN KESEHATAN",
  });
  list.push({ type: "item", text: "HASIL PEMERIKSAAN FISIK" });

  const labItems: string[] = [];
  if (hasBasicMcu) {
    labItems.push("HEMATOLOGI DARAH RUTIN");
    labItems.push("KIMIA DARAH");
    labItems.push("URINE RUTIN");
  }
  // Pemeriksaan lab tambahan (add-on)
  if (has("panel hepatitis")) labItems.push("PANEL HEPATITIS");
  if (has("biomonitoring")) labItems.push("BIOMONITORING");

  if (labItems.length) {
    list.push({ type: "subhead", text: "HASIL PEMERIKSAAN LABORATORIUM" });
    labItems.forEach((t) => list.push({ type: "item", text: t }));
  }

  const penunjangItems: string[] = [];
  if (
    has("radiologi thoraks") ||
    has("mcu regular") ||
    has("mcu akhir") ||
    has("mcu dmc") ||
    has("mcu eksekutif")
  )
    penunjangItems.push("HASIL PEMERIKSAAN RONTGEN");
  if (has("ekg") || has("mcu eksekutif"))
    penunjangItems.push("HASIL PEMERIKSAAN EKG");
  if (has("treadmill") || has("mcu eksekutif"))
    penunjangItems.push("HASIL PEMERIKSAAN TREADMILL");
  if (has("audiometry") || has("mcu eksekutif"))
    penunjangItems.push("HASIL PEMERIKSAAN AUDIOMETRY");
  if (has("spirometry") || has("mcu eksekutif"))
    penunjangItems.push("HASIL PEMERIKSAAN SPIROMETRY");
  if (has("usg whole abdomen") || has("mcu eksekutif"))
    penunjangItems.push("HASIL PEMERIKSAAN USG ABDOMEN");
  if (has("usg mammae") || has("mcu eksekutif"))
    penunjangItems.push("HASIL PEMERIKSAAN USG MAMMAE");

  if (has("refraktometri"))
    penunjangItems.push("HASIL PEMERIKSAAN REFRAKTOMETRI");

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
        {data.patient.photoUrl && (
          <View style={localStyles.photoContainer}>
            <Image style={localStyles.photo} src={data.patient.photoUrl} />
          </View>
        )}

        <Text style={localStyles.coverHeader}>
          IDENTITAS PESERTA PEMERIKSAAN KESEHATAN
        </Text>

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
            <Text style={localStyles.label}>NIK</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.nik?.toUpperCase() || "-"}
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>DIVISI</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.division?.toUpperCase() || "-"}
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>POSISI</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.position?.toUpperCase() || "-"}
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
            <Text style={localStyles.value}>
              {formatDate(data.examinationStartedAt)}
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>JAM PEMERIKSAAN</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {formatTime(data.examinationStartedAt)}
            </Text>
          </View>

          <View style={localStyles.row}>
            <Text style={localStyles.label}>PERUSAHAAN</Text>
            <Text style={localStyles.colon}>:</Text>
            <Text style={localStyles.value}>
              {data.patient.company?.name?.toUpperCase() || "-"}
            </Text>
          </View>
        </View>

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
