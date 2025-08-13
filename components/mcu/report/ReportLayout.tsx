// components/mcu/report/ReportLayout.tsx
"use client";

import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { styles } from './reportStyles';

// --- KOMPONEN HEADER BARU ---
export const ReportHeader = () => (
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

// --- KOMPONEN INFO PASIEN (SEKARANG TERPISAH) ---
export const PatientInfo = ({ patient }) => (
    <View style={styles.patientInfoContainer}>
        <View style={styles.patientInfoColumn}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nama Pasien</Text>
                <Text style={styles.infoValue}>: {patient?.fullName || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tgl Lahir / Umur</Text>
                <Text style={styles.infoValue}>: {patient?.dob ? format(new Date(patient.dob), "dd MMMM yyyy", { locale: localeID }) : '-'} / {patient?.age || '-'} Tahun</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Jenis Kelamin</Text>
                <Text style={styles.infoValue}>: {patient?.gender || '-'}</Text>
            </View>
        </View>
        <View style={styles.patientInfoColumn}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Perusahaan</Text>
                <Text style={styles.infoValue}>: {patient?.company?.name || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tgl Pemeriksaan</Text>
                <Text style={styles.infoValue}>: {patient?.updatedAt ? format(new Date(patient.updatedAt), "dd MMMM yyyy", { locale: localeID }) : '-'}</Text>
            </View>
             <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nomor Pasien</Text>
                <Text style={styles.infoValue}>: {patient?.patientId || '-'}</Text>
            </View>
        </View>
    </View>
);

// --- KOMPONEN FOOTER ---
export const ReportFooter = () => (
    <View style={styles.footerContainer} fixed>
        {/* GARIS BIRU DEKORATIF */}
        <View style={styles.footerBlueBar} />

        {/* Info perusahaan sekarang di tengah */}
        <View style={styles.companySection}>
            <Text style={styles.companyName}>PT. SUDAMI JAYA MEDIKA</Text>
            <Text style={styles.companyAddress}>Jl. Raya Setu Km. 3 Cibuntu Cibitung Kab. Bekasi</Text>
            {/* TAMBAHAN WEB & TELP */}
            <Text style={styles.companyContact}>www.sudamijayamedika.com | Telp: (021) 1234 5678</Text>
        </View>
    </View>
);