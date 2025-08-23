"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type TreadmillData = {
  patient?: Patient | null;
  treadmillImage1?: string | null;
  treadmillImage2?: string | null;
  treadmillImage3?: string | null;
  treadmillLamaLatihan?: string | null;
  treadmillKlasifikasiKebugaran?: string | null;
  treadmillKerjaFisik?: string | null;
  treadmillKelasFungsional?: string | null;
  treadmillHasilTest?: string | null;
  treadmillSaran?: string | null;
  treadmillValidatorName?: string | null;
  treadmillValidatorQr?: string | null;
};

const localStyles = StyleSheet.create({
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    textDecoration: "underline",
  },
  resultBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginTop: 15,
    fontSize: 10,
  },
  resultRow: {
    flexDirection: "row",
    marginBottom: 5,
    paddingBottom: 5,
  },
  resultLabel: {
    width: "40%",
    fontFamily: "Helvetica",
  },
  resultValue: {
    width: "60%",
    fontFamily: "Helvetica-Bold",
  },
  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 80,
    alignItems: "center",
  },
  validatorQr: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  validatorName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
  },
  validatorTitle: {
    fontSize: 9,
    marginBottom: 60,
  },
  imagePage: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "90%",
    objectFit: "contain",
  },
  lampiranTitle: {
    position: "absolute",
    top: 40,
    left: 40,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
});

const ImageAttachmentPage: React.FC<{ src: string; title: string }> = ({
  src,
  title,
}) => (
  <Page size="A4" style={localStyles.imagePage} break>
    <Text style={localStyles.lampiranTitle}>{title}</Text>
    <Image style={localStyles.image} src={src} />
    <ReportFooter />
  </Page>
);

export const TreadmillDocument: React.FC<{ data: TreadmillData }> = ({
  data,
}) => {
  return (
    <>
      <Page size="A4" style={globalStyles.page} break>
        <ReportHeader />
        <PatientInfo patient={data?.patient} />

        <View style={globalStyles.body}>
          <Text style={localStyles.headerText}>
            HASIL PEMERIKSAAN TREADMILL TEST
          </Text>

          <View style={localStyles.resultBox}>
            <View style={localStyles.resultRow}>
              <Text style={localStyles.resultLabel}>Lama Latihan</Text>
              <Text style={localStyles.resultValue}>
                : {data?.treadmillLamaLatihan ?? "-"}
              </Text>
            </View>
            <View style={localStyles.resultRow}>
              <Text style={localStyles.resultLabel}>
                Klasifikasi Kebugaran Fisik
              </Text>
              <Text style={localStyles.resultValue}>
                : {data?.treadmillKlasifikasiKebugaran ?? "-"}
              </Text>
            </View>
            <View style={localStyles.resultRow}>
              <Text style={localStyles.resultLabel}>Treadmill Kerja Fisik</Text>
              <Text style={localStyles.resultValue}>
                : {data?.treadmillKerjaFisik ?? "-"}
              </Text>
            </View>
            <View style={localStyles.resultRow}>
              <Text style={localStyles.resultLabel}>Kelas Fungsional</Text>
              <Text style={localStyles.resultValue}>
                : {data?.treadmillKelasFungsional ?? "-"}
              </Text>
            </View>
            <View style={localStyles.resultRow}>
              <Text style={localStyles.resultLabel}>Hasil Test Treadmill</Text>
              <Text style={localStyles.resultValue}>
                : {data?.treadmillHasilTest ?? "-"}
              </Text>
            </View>
            <View
              style={[
                localStyles.resultRow,
                { borderBottomWidth: 0, marginBottom: 0 },
              ]}
            >
              <Text style={localStyles.resultLabel}>Saran</Text>
              <Text style={localStyles.resultValue}>
                : {data?.treadmillSaran ?? "-"}
              </Text>
            </View>
          </View>
        </View>

        {(data?.treadmillValidatorName || data?.treadmillValidatorQr) && (
          <View style={localStyles.validatorBox}>
            <Text style={localStyles.validatorTitle}>Pembaca</Text>
            {data?.treadmillValidatorQr && (
              <Image
                src={data.treadmillValidatorQr as string}
                style={localStyles.validatorQr}
              />
            )}
            {data?.treadmillValidatorName && (
              <Text style={localStyles.validatorName}>
                {data.treadmillValidatorName}
              </Text>
            )}
          </View>
        )}

        <ReportFooter />
      </Page>

      {data?.treadmillImage1 && (
        <ImageAttachmentPage
          src={data.treadmillImage1}
          title="Lampiran Gambar Treadmill"
        />
      )}
      {data?.treadmillImage2 && (
        <ImageAttachmentPage
          src={data.treadmillImage2}
          title="Lampiran Gambar Treadmill"
        />
      )}
      {data?.treadmillImage3 && (
        <ImageAttachmentPage
          src={data.treadmillImage3}
          title="Lampiran Gambar Treadmill"
        />
      )}
    </>
  );
};
