"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from "./reportStyles";

export interface UsgAbdomenData {
  patient?: any;

  usgAbdomenImage1?: string;
  usgAbdomenImage2?: string;
  usgAbdomenImage3?: string;
  usgAbdomenImage4?: string;
  usgAbdomenImage5?: string;
  usgAbdomenImage6?: string;

  usgAbdomenHepar?: string;
  usgAbdomenGallBladder?: string;
  usgAbdomenLien?: string;
  usgAbdomenPancreas?: string;
  usgAbdomenGinjalDekstra?: string;
  usgAbdomenGinjalSinistra?: string;
  usgAbdomenKesimpulan?: string;

  usgAbdomenValidatorName?: string;
  usgAbdomenValidatorQr?: string;
}

interface UsgAbdomenDocumentProps {
  data?: UsgAbdomenData;
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

export const UsgAbdomenDocument: React.FC<UsgAbdomenDocumentProps> = ({
  data,
}) => {
  const images: string[] = [
    data?.usgAbdomenImage1,
    data?.usgAbdomenImage2,
    data?.usgAbdomenImage3,
    data?.usgAbdomenImage4,
    data?.usgAbdomenImage5,
    data?.usgAbdomenImage6,
  ].filter((x): x is string => Boolean(x));

  return (
    <Page size="A4" style={globalStyles.page}>
      <ReportHeader />
      <PatientInfo patient={data?.patient} />

      <View style={globalStyles.body}>
        <Text style={localStyles.headerText}>
          HASIL PEMERIKSAAN USG ABDOMEN
        </Text>

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
              : {data?.usgAbdomenHepar ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>GALL BLADDER</Text>
            <Text style={localStyles.reportValue}>
              : {data?.usgAbdomenGallBladder ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>LIEN</Text>
            <Text style={localStyles.reportValue}>
              : {data?.usgAbdomenLien ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>PANCREAS</Text>
            <Text style={localStyles.reportValue}>
              : {data?.usgAbdomenPancreas ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>GINJAL DEKSTRA</Text>
            <Text style={localStyles.reportValue}>
              : {data?.usgAbdomenGinjalDekstra ?? "-"}
            </Text>
          </View>
          <View style={localStyles.reportRow}>
            <Text style={localStyles.reportLabel}>GINJAL SINISTRA</Text>
            <Text style={localStyles.reportValue}>
              : {data?.usgAbdomenGinjalSinistra ?? "-"}
            </Text>
          </View>
          <View style={[localStyles.reportRow, { marginTop: 15 }]}>
            <Text style={localStyles.reportLabel}>KESIMPULAN</Text>
            <Text style={localStyles.reportValue}>
              : {data?.usgAbdomenKesimpulan ?? "-"}
            </Text>
          </View>
        </View>
      </View>

      {(data?.usgAbdomenValidatorName || data?.usgAbdomenValidatorQr) && (
        <View style={localStyles.validatorBox}>
          {data?.usgAbdomenValidatorQr && (
            <Image
              src={data.usgAbdomenValidatorQr as string}
              style={localStyles.validatorQr}
            />
          )}
          {data?.usgAbdomenValidatorName && (
            <Text style={localStyles.validatorName}>
              {data.usgAbdomenValidatorName}
            </Text>
          )}
          <Text style={localStyles.validatorLabel}>Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};

export default UsgAbdomenDocument;
