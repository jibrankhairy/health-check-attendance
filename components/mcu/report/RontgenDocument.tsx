// components/mcu/report/RontgenDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Layout & style global
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

/** ===================== Types ===================== */
type Maybe<T> = T | null | undefined;

type RontgenData = {
  patient?: Maybe<Patient>;
  rontgenImage?: string | null;
  kesanRontgen?: string | null;

  rontgenValidatorName?: string | null;
  rontgenValidatorQr?: string | null;
};

/** ===================== Styles (local) ===================== */
const localStyles = StyleSheet.create({
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    textDecoration: "underline",
  },
  imageContainer: {
    width: "100%",
    height: 400,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  reportSection: {
    marginTop: 20,
  },
  reportLabel: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    textDecoration: "underline",
    fontSize: 10,
  },
  reportValue: {
    marginBottom: 15,
    lineHeight: 1.5,
    fontSize: 10,
  },
});

/** ===================== Component ===================== */
export const RontgenDocument: React.FC<{ data: RontgenData }> = ({ data }) => {
  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.headerText}>HASIL PEMERIKSAAN RONTGEN</Text>

        {data?.rontgenImage && (
          <View style={localStyles.imageContainer}>
            <Image
              style={localStyles.image}
              src={data.rontgenImage as string}
            />
          </View>
        )}

        <View style={localStyles.reportSection}>
          <Text style={localStyles.reportLabel}>HASIL PEMERIKSAAN DOKTER:</Text>
          <Text style={localStyles.reportValue}>
            {data?.kesanRontgen ?? "-"}
          </Text>
        </View>

        {/* Signature ala Hematologi: kanan bawah */}
        {(data?.rontgenValidatorName || data?.rontgenValidatorQr) && (
          <View
            style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}
          >
            {data?.rontgenValidatorQr && (
              <Image
                src={data.rontgenValidatorQr as string}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.rontgenValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {data.rontgenValidatorName}
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
