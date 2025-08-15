// components/mcu/report/EkgDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

/** ===================== Types ===================== */
type Maybe<T> = T | null | undefined;

type EkgData = {
  patient?: Maybe<Patient>;

  ekgImage?: string | null;
  ekgRhythm?: string | null;
  ekgQrsRate?: string | number | null;
  ekgAxis?: string | null;
  ekgPWave?: string | null;
  ekgPrInterval?: string | null;
  ekgQrsDuration?: string | null;
  ekgQWave?: string | null;
  ekgTWave?: string | null;
  ekgStChanges?: string | null;
  ekgOthers?: string | null;
  ekgConclusion?: string | null;
  ekgAdvice?: string | null;

  ekgValidatorName?: string | null;
  ekgValidatorQr?: string | null;
};

/** ===================== Styles ===================== */
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
    height: 250,
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
    fontSize: 10,
  },
  reportRow: {
    flexDirection: "row",
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 6,
  },
  reportLabel: {
    width: "30%",
    fontFamily: "Helvetica-Bold",
  },
  reportValue: {
    width: "70%",
  },
});

/** ===================== Component ===================== */
export const EkgDocument: React.FC<{ data: EkgData }> = ({ data }) => {
  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.headerText}>HASIL PEMERIKSAAN EKG</Text>

        {data?.ekgImage && (
          <View style={localStyles.imageContainer}>
            <Image style={localStyles.image} src={data.ekgImage as string} />
          </View>
        )}

        <View style={localStyles.reportSection}>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>Rhythm</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgRhythm ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>QRS Rate</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgQrsRate ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>Axis</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgAxis ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>P. Wave</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgPWave ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>P. R Interval</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgPrInterval ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>QRS Duration</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgQrsDuration ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>Q. Wave</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgQWave ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>T. Wave</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgTWave ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>ST-T Changes</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgStChanges ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>Others</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgOthers ?? "-"}
            </Text>
          </View>
          <View style={[localStyles.reportRow, { marginTop: 10 }]}>
            <Text style={localStyles.reportLabel}>Conclusion</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgConclusion ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>Advice</Text>
            <Text style={localStyles.reportValue}>
              : {data?.ekgAdvice ?? "-"}
            </Text>
          </View>
        </View>

        {(data?.ekgValidatorName || data?.ekgValidatorQr) && (
          <View
            style={{ marginTop: 10, alignItems: "flex-end", paddingRight: 40 }}
          >
            {data?.ekgValidatorQr && (
              <Image
                src={data.ekgValidatorQr as string}
                style={{ width: 80, height: 80, marginBottom: 8 }}
              />
            )}
            {data?.ekgValidatorName && (
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
                {data.ekgValidatorName as string}
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
