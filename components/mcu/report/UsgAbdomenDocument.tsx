// components/mcu/report/UsgAbdomenDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

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
  reportRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reportLabel: {
    width: "25%",
    fontFamily: "Helvetica-Bold",
  },
  reportValue: {
    width: "75%",
  },
});

export const UsgAbdomenDocument = ({ data }) => {
  const images = [
    data.usgAbdomenImage1,
    data.usgAbdomenImage2,
    data.usgAbdomenImage3,
    data.usgAbdomenImage4,
    data.usgAbdomenImage5,
    data.usgAbdomenImage6,
  ].filter(Boolean);

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.headerText}>HASIL PEMERIKSAAN USG ABDOMEN</Text>

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
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>HEPAR</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenHepar || "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>GALL BLADDER</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenGallBladder || "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>LIEN</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenLien || "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>PANCREAS</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenPancreas || "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>GINJAL DEKSTRA</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenGinjalDekstra || "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>GINJAL SINISTRA</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenGinjalSinistra || "-"}
            </Text>
          </View>
          <View style={[localStyles.reportRow, { marginTop: 15 }]}>
            <Text style={localStyles.reportLabel}>KESIMPULAN</Text>
            <Text style={localStyles.reportValue}>
              : {data.usgAbdomenKesimpulan || "-"}
            </Text>
          </View>
        </View>

        {/* Signature ala Hematologi */}
        {(data?.usgAbdomenValidatorName || data?.usgAbdomenValidatorQr) && (
          <View style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}>
            {data?.usgAbdomenValidatorQr && (
              <Image
                src={data.usgAbdomenValidatorQr}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.usgAbdomenValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {data.usgAbdomenValidatorName}
              </Text>
            )}
            <Text style={{ fontSize: 5 }}>Validator</Text>
          </View>
        )}
      </View>

      <ReportFooter />
    </Page>
  );
};
