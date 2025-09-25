"use client";

import React from "react";
import { Page, Text, View, Image } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles } from "./reportStyles";

interface PatientMin {
  gender?: string | null;
  [k: string]: unknown;
}

export interface RefraktometriData extends Record<string, unknown> {
  patient?: PatientMin | null;
  refraKananSpheris?: string | null;
  refraKananChylinder?: string | null;
  refraKananAxis?: string | null;
  refraKananAdd?: string | null;
  refraKiriSpheris?: string | null;
  refraKiriChylinder?: string | null;
  refraKiriAxis?: string | null;
  refraKiriAdd?: string | null;
  refraValidatorName?: string | null;
  refraValidatorQr?: string | null;
}

const validatorStyles = {
  validatorBox: {
    position: "absolute" as const,
    right: 40,
    bottom: 72,
    alignItems: "center" as const,
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
};

const displayValue = (v: unknown): string =>
  v === null || v === undefined || String(v) === "" ? "-" : String(v);

export const RefraktometriDocument: React.FC<{ data: RefraktometriData }> = ({
  data,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <ReportHeader />

      <View style={styles.body}>
        <PatientInfo patient={data?.patient} />

        <Text style={styles.mainTitle}>HASIL PEMERIKSAAN REFRAKTOMETRI</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, styles.colJenis]}>MATA</Text>
            <Text
              style={[styles.tableColHeader, styles.colHasil, { width: "20%" }]}
            >
              SPHERIS
            </Text>
            <Text
              style={[styles.tableColHeader, styles.colHasil, { width: "20%" }]}
            >
              CHYLNDER
            </Text>
            <Text
              style={[styles.tableColHeader, styles.colHasil, { width: "20%" }]}
            >
              AXIS
            </Text>
            <Text
              style={[styles.tableColHeader, styles.colHasil, { width: "20%" }]}
            >
              ADD
            </Text>
          </View>

          {/* Baris Kanan */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.colJenis]}>Kanan / OD</Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKananSpheris)}
            </Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKananChylinder)}
            </Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKananAxis)}
            </Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKananAdd)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.colJenis]}>Kiri / OS</Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKiriSpheris)}
            </Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKiriChylinder)}
            </Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKiriAxis)}
            </Text>
            <Text style={[styles.tableCol, styles.colHasil, { width: "20%" }]}>
              {displayValue(data.refraKiriAdd)}
            </Text>
          </View>
        </View>
      </View>

      {(data?.refraValidatorName || data?.refraValidatorQr) && (
        <View style={validatorStyles.validatorBox}>
          {data?.refraValidatorQr && (
            <Image
              src={String(data.refraValidatorQr)}
              style={validatorStyles.validatorQr}
            />
          )}
          {data?.refraValidatorName && (
            <Text style={validatorStyles.validatorName}>
              {String(data.refraValidatorName)}
            </Text>
          )}
          <Text style={validatorStyles.validatorLabel}>Validator</Text>
        </View>
      )}

      <ReportFooter />
    </Page>
  );
};
