"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

type ConsentPatient = {
  fullName?: string | null;
  patientId?: string | number | null;
  qrCode?: string | null;
  gender?: string | null;
};

type ConsentData = {
  formSubmittedAt?: string | number | Date | null;
  patient?: ConsentPatient | null;
} & Record<string, unknown>;

export const ConsentDocument: React.FC<{ data: ConsentData }> = ({ data }) => {
  const submissionDate = data?.formSubmittedAt
    ? format(new Date(data.formSubmittedAt), "dd MMMM yyyy", {
        locale: localeID,
      })
    : "Tidak Tercatat";

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.title}>
          PERNYATAAN PERSETUJUAN PEMERIKSAAN KESEHATAN
        </Text>

        <View style={localStyles.consentTextContainer}>
          <Text style={localStyles.paragraph}>
            Melalui pengisian formulir MCU (Medical Check Up) secara elektronik,
            dengan ini saya menyatakan persetujuan ketentuan sebagai berikut:
          </Text>

          <View style={localStyles.list}>
            <View style={localStyles.listItem}>
              <Text style={localStyles.listNumber}>1.</Text>
              <Text style={localStyles.listContent}>
                Seluruh pernyataan yang saya jawab diatas adalah benar dan dapat
                dipertanggungjawabkan, apabila terdapat ketidaksesuaian
                dikemudian hari, saya bersedia diberi sanksi sesuai dengan
                ketentuan perusahaan.
              </Text>
            </View>
            <View style={localStyles.listItem}>
              <Text style={localStyles.listNumber}>2.</Text>
              <Text style={localStyles.listContent}>
                Saya menyetujui bahwa hasil pemeriksaan kesehatan yang telah
                dilakukan dapat disimpan dalam bentuk tertulis (hardcopy)
                ataupun elektronik (softcopy) oleh perusahaan.
              </Text>
            </View>
            <View style={localStyles.listItem}>
              <Text style={localStyles.listNumber}>3.</Text>
              <Text style={localStyles.listContent}>
                Saya menyetujui dan memberikan kewenangan pada staf kesehatan
                kerja perusahaan untuk melakukan analisa terkait hasil
                pemeriksaan kesehatan saya. Hal tersebut terkait kegunaan untuk
                dievaluasi berkaitan dengan pekerjaan saya diperusahaan ini.
              </Text>
            </View>
            <View style={localStyles.listItem}>
              <Text style={localStyles.listNumber}>4.</Text>
              <Text style={localStyles.listContent}>
                Saya memberikan wewenang bagi staf kesehatan kerja perusahaan
                untuk memberikan hasil analisa dan evaluasi pemeriksaan terhadap
                kesehatan saya kepada manajemen perusahaan agar dilakukan
                tindaklanjut berdasarkan hasil pemeriksaan kondisi fisik dan
                kesehatan saya.
              </Text>
            </View>
          </View>

          <Text style={localStyles.paragraph}>
            Demikian pernyataan persetujuan ini saya buat dengan sebenar
            benarnya dalam keadaan sadar dan tanpa ada paksaan dari pihak
            manapun.
          </Text>
        </View>

        <View style={localStyles.signatureSection}>
          <View style={localStyles.signatureBox}>
            <Text style={localStyles.signatureDate}>
              Disetujui pada: {submissionDate}
            </Text>

            {data?.patient?.qrCode ? (
              <Image
                style={localStyles.qrCode}
                src={data.patient.qrCode as string}
              />
            ) : (
              <View style={localStyles.qrCodePlaceholder}>
                <Text style={localStyles.qrCodePlaceholderText}>
                  QR Code Tidak Tersedia
                </Text>
              </View>
            )}

            <Text style={localStyles.signatureName}>
              {data?.patient?.fullName}
            </Text>
            <Text style={localStyles.signatureId}>
              (ID Pasien: {data?.patient?.patientId ?? "-"})
            </Text>
          </View>
        </View>
      </View>

      <ReportFooter />
    </Page>
  );
};

const localStyles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    textDecoration: "underline",
    textAlign: "center",
  },
  consentTextContainer: { fontSize: 9, lineHeight: 1.6, textAlign: "justify" },
  paragraph: { marginBottom: 10 },
  list: { paddingLeft: 10, marginBottom: 10 },
  listItem: { flexDirection: "row", marginBottom: 5 },
  listNumber: { width: "5%" },
  listContent: { width: "95%" },
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureBox: { width: "40%", textAlign: "center" },
  signatureDate: { fontSize: 8, marginBottom: 10, fontStyle: "italic" },
  qrCode: { width: 80, height: 80, alignSelf: "center" },
  qrCodePlaceholder: {
    width: 80,
    height: 80,
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  qrCodePlaceholderText: { fontSize: 8, color: "#777", textAlign: "center" },
  signatureName: {
    marginTop: 10,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 5,
  },
  signatureId: { fontSize: 8, color: "#555" },
});
