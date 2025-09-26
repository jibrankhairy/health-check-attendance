"use client";

import React from "react";
import { Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    paddingHorizontal: 36,
    paddingVertical: 32,
    flexDirection: "column",
    position: "relative",
  },

  frame: {
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    borderWidth: 2,
    borderColor: "#01449D",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    minHeight: 80,
    marginBottom: 60,
  },
  mainLogo: {
    width: 120,
    height: 80,
  },
  topLogos: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  sideLogo: {
    width: 55,
    height: 55,
  },
  sideLogoSpacing: {
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: "row",
    marginRight: 20,
    alignItems: "center",
    marginBottom: "auto",
  },
  titleBar: {
    width: 8,
    backgroundColor: "#000000",
    marginTop: 150,
    marginRight: 20,
    height: 70,
  },
  titleTextContainer: {
    flexDirection: "column",
  },
  mainTitle: {
    marginTop: 150,
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 30,
    fontFamily: "Helvetica",
    marginTop: 2,
  },

  footerWrap: {
    position: "absolute",
    bottom: 28,
    left: 36,
    right: 36,
  },
  footerLine: {
    borderTopWidth: 3,
    borderTopColor: "#01449D",
    marginBottom: 6,
  },
  footer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  contactText: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
});

type MainCoverData = Record<string, unknown>;

type MainCoverDocumentProps = {
  data?: MainCoverData;
};

export const MainCoverDocument: React.FC<MainCoverDocumentProps> = ({
  data: _data,
}) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.frame} />

    <View style={styles.header}>
      <Image style={styles.mainLogo} src="/images/logo-klinik.png" />

      <View style={styles.topLogos}>
        <Image style={styles.sideLogo} src="/images/logosatusehat.png" />
        <Image
          style={[styles.sideLogo, styles.sideLogoSpacing]}
          src="/images/logoparipurna.png"
        />
        <Image
          style={[styles.sideLogo, styles.sideLogoSpacing]}
          src="/images/logokemenaker.png"
        />
      </View>
    </View>

    <View style={styles.titleRow}>
      <View style={styles.titleBar} />
      <View style={styles.titleTextContainer}>
        <Text style={styles.mainTitle}>MEDICAL CHECK UP</Text>
        <Text style={styles.subTitle}>REPORT</Text>
      </View>
    </View>

    <View style={styles.footerWrap}>
      <View style={styles.footerLine} />
      <View style={styles.footer}>
        <Text style={styles.contactText}>
          Jl. Raya Setu Km 3 No. 149 Cibuntu Cibitung Kab Bekasi
        </Text>
        <Text style={styles.contactText}>
          www.klinikym.com | klinikym@gmail.com
        </Text>
        <Text style={styles.contactText}>(021) 2210 5268 | 087878752222</Text>
      </View>
    </View>
  </Page>
);
