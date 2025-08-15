// components/mcu/report/KartuKontrolDocument.tsx
import React from "react";
// 1. Import 'Document' dari library-nya
import { Page, Text, View, StyleSheet, Image, Document } from "@react-pdf/renderer";

// Definisikan tipe data yang akan diterima komponen ini
type KartuKontrolData = {
  patient: {
    fullName: string;
    patientId: string; // Ini untuk Kode MCU
    location: string;
    mcuPackage: string[];
  };
  qrCodeUrl: string; // URL gambar QR code yang sudah di-generate
};

// Styling untuk PDF (tidak ada perubahan di sini)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  mainContent: {
    flexDirection: 'row',
    border: '1px solid black',
    padding: 10,
  },
  leftSection: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  rightSection: {
    width: '70%',
    paddingLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
  },
  colon: {
    width: '5%',
  },
  value: {
    width: '55%',
    fontFamily: 'Helvetica-Bold',
  },
  gridContainer: {
    marginTop: 15,
    borderTop: '1px solid black',
    paddingTop: 10,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  gridCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1px solid black',
    marginRight: 5,
  },
});

const examinationItems = [
  "PEMERIKSAAN FISIK", "LAB", "THORAX", "USG",
  "EKG", "TREADMILL", "GULA DARAH 2 JAM", "AUDIOMETRI",
  "SPIROMETRI", "URINALISA LENGKAP",
];

// Komponen utama PDF
export const KartuKontrolDocument = ({ data }: { data: KartuKontrolData }) => {
  // 2. Bungkus semua elemen <Page> dengan <Document>
  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>PT. TIMAH</Text>
        </View>
        <View style={styles.mainContent}>
          <View style={styles.leftSection}>
            <Image style={styles.qrCode} src={data.qrCodeUrl} />
          </View>
          <View style={styles.rightSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>NAMA</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{(data.patient.fullName || '').toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>KODE MCU</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{data.patient.patientId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>LOKASI</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{(data.patient.location || '').toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>JENIS PEMERIKSAAN</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{(data.patient.mcuPackage || []).join(', ').toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.gridContainer}>
          {Array.from({ length: Math.ceil(examinationItems.length / 2) }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              <View style={styles.gridCell}>
                <View style={styles.checkbox} />
                <Text>{examinationItems[rowIndex * 2]}</Text>
              </View>
              {examinationItems[rowIndex * 2 + 1] && (
                <View style={styles.gridCell}>
                  <View style={styles.checkbox} />
                  <Text>{examinationItems[rowIndex * 2 + 1]}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};