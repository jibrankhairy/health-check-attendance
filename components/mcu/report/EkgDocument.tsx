"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import type { Patient } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

type EkgData = {
  patient?: Patient | null;
  ekgImage1?: string | null;
  ekgImage2?: string | null;
  ekgImage3?: string | null;
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

const localStyles = StyleSheet.create({
  headerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    textDecoration: "underline",
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

export const EkgDocument: React.FC<{ data: EkgData }> = ({ data }) => {
  return (
    <>
      <Page size="A4" style={globalStyles.page} break>
        <ReportHeader />
        <PatientInfo patient={data?.patient} />

        <View style={globalStyles.body}>
          <Text style={localStyles.headerText}>HASIL PEMERIKSAAN EKG</Text>

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
        </View>

        {(data?.ekgValidatorName || data?.ekgValidatorQr) && (
          <View style={localStyles.validatorBox}>
            {data?.ekgValidatorQr && (
              <Image
                src={data.ekgValidatorQr as string}
                style={localStyles.validatorQr}
              />
            )}
            {data?.ekgValidatorName && (
              <Text style={localStyles.validatorName}>
                {data.ekgValidatorName as string}
              </Text>
            )}
            <Text style={localStyles.validatorLabel}>Validator</Text>
          </View>
        )}

        <ReportFooter />
      </Page>

      {data?.ekgImage1 && (
        <ImageAttachmentPage src={data.ekgImage1} title="Lampiran EKG 1" />
      )}
      {data?.ekgImage2 && (
        <ImageAttachmentPage src={data.ekgImage2} title="Lampiran EKG 2" />
      )}
      {data?.ekgImage3 && (
        <ImageAttachmentPage src={data.ekgImage3} title="Lampiran EKG 3" />
      )}
    </>
  );
};
