// components/mcu/report/ReportLayout.tsx
"use client";

import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { styles } from "./reportStyles";

/** ===================== Types ===================== */
type Maybe<T> = T | null | undefined;
type MaybeDate = Date | string | number | null | undefined;

interface Company {
  name?: Maybe<string>;
}

export interface Patient {
  fullName?: Maybe<string>;
  dob?: MaybeDate;
  age?: Maybe<number | string>;
  gender?: Maybe<string>;
  company?: Maybe<Company>;
  updatedAt?: MaybeDate;
  patientId?: Maybe<string | number>;
  // tambahkan field lain jika diperlukan
}

interface PatientInfoProps {
  patient?: Maybe<Patient>;
}

/** ===================== Utils ===================== */
const formatDate = (value: MaybeDate): string => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "-";
  return format(date, "dd MMMM yyyy", { locale: localeID });
};

/** ===================== HEADER ===================== */
export const ReportHeader: React.FC = () => (
  <View style={styles.headerContainer} fixed>
    <View style={styles.headerLeft}>
      <Image style={styles.logoYm} src="/images/logo-klinik.png" />
    </View>
    <View style={styles.headerCenter}>
      <Text style={styles.headerTitle}>HASIL PEMERIKSAAN</Text>
    </View>
    <View style={styles.headerRight}>
      <Image style={styles.logoSide} src="/images/logosatusehat.png" />
      <Image style={styles.logoSide} src="/images/logoparipurna.png" />
      <Image style={styles.logoSide} src="/images/logokemenaker.png" />
    </View>
  </View>
);

/** ===================== PATIENT INFO ===================== */
export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => (
  <View style={styles.patientInfoContainer}>
    <View style={styles.patientInfoColumn}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nama Pasien</Text>
        <Text style={styles.infoValue}>: {patient?.fullName ?? "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Tgl Lahir / Umur</Text>
        <Text style={styles.infoValue}>
          : {formatDate(patient?.dob)} / {patient?.age ?? "-"} Tahun
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Jenis Kelamin</Text>
        <Text style={styles.infoValue}>: {patient?.gender ?? "-"}</Text>
      </View>
    </View>

    <View style={styles.patientInfoColumn}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Perusahaan</Text>
        <Text style={styles.infoValue}>: {patient?.company?.name ?? "-"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Tgl Pemeriksaan</Text>
        <Text style={styles.infoValue}>: {formatDate(patient?.updatedAt)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nomor Pasien</Text>
        <Text style={styles.infoValue}>: {patient?.patientId ?? "-"}</Text>
      </View>
    </View>
  </View>
);

/** ===================== FOOTER ===================== */
export const ReportFooter: React.FC = () => (
  <View style={styles.footerContainer} fixed>
    {/* GARIS BIRU DEKORATIF */}
    <View style={styles.footerBlueBar} />

    {/* Info perusahaan sekarang di tengah */}
    <View style={styles.companySection}>
      <Text style={styles.companyName}>PT. SUDAMI JAYA MEDIKA</Text>
      <Text style={styles.companyAddress}>
        Jl. Raya Setu Km. 3 Cibuntu Cibitung Kab. Bekasi
      </Text>
      {/* TAMBAHAN WEB & TELP */}
      <Text style={styles.companyContact}>
        www.sudamijayamedika.com | Telp: (021) 1234 5678
      </Text>
    </View>
  </View>
);
