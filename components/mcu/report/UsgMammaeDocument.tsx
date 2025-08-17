"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

export interface UsgMammaeData {
  patient?: any;

  usgMammaeImage1?: string;
  usgMammaeImage2?: string;
  usgMammaeImage3?: string;
  usgMammaeImage4?: string;
  usgMammaeImage5?: string;
  usgMammaeImage6?: string;

  usgMammaeLaporan?: string;
  usgMammaeKesimpulan?: string;

  usgMammaeValidatorName?: string;
  usgMammaeValidatorQr?: string;
}

interface UsgMammaeDocumentProps {
  data?: UsgMammaeData;
}

const localStyles = StyleSheet.create({
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    textDecoration: "underline",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageContainer: {
    width: "48%",
    height: 150,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  reportSection: {
    marginTop: 20,
    fontSize: 10,
  },
  reportLabel: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  reportValue: {
    marginBottom: 15,
    lineHeight: 1.4,
  },

  validatorBox: {
    position: "absolute",
    right: 40,
    bottom: 72,
    alignItems: "center",
  },
  validatorQr: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  validatorName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  validatorLabel: {
    fontSize: 5,
  },
});

export const UsgMammaeDocument: React.FC<UsgMammaeDocumentProps> = ({
  data,
}) => {
  const images: string[] = [
    data?.usgMammaeImage1,
    data?.usgMammaeImage2,
    data?.usgMammaeImage3,
    data?.usgMammaeImage4,
    data?.usgMammaeImage5,
    data?.usgMammaeImage6,
  ].filter((x): x is string => Boolean(x));

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.headerText}>HASIL PEMERIKSAAN USG MAMMAE</Text>

        {images.length > 0 && (
          <View style={localStyles.imageGrid}>
            {images.map((src, index) => (
              <View key={index} style={localStyles.imageContainer}>
                <Image style={localStyles.image} src={src} />
              </View>
            ))}
          </View>
        )}

        <View style={localStyles.reportSection}>
          <Text style={localStyles.reportLabel}>
            LAPORAN USG MAMMAE DEXTRA DAN SINISTRA:
          </Text>
          <Text style={localStyles.reportValue}>
            {data?.usgMammaeLaporan ?? "-"}
          </Text>

          <Text style={localStyles.reportLabel}>KESIMPULAN:</Text>
          <Text style={localStyles.reportValue}>
            {data?.usgMammaeKesimpulan ?? "-"}
          </Text>
        </View>
      </View>

      {(data?.usgMammaeValidatorName || data?.usgMammaeValidatorQr) && (
        <View style={localStyles.validatorBox}>
          {data?.usgMammaeValidatorQr && (
            <Image
              src={data.usgMammaeValidatorQr as string}
              style={localStyles.validatorQr}
            />
          )}
          {data?.usgMammaeValidatorName && (
            <Text style={localStyles.validatorName}>
              {data.usgMammaeValidatorName}
            </Text>
          )}
          <Text style={localStyles.validatorLabel}>Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};

export default UsgMammaeDocument;
