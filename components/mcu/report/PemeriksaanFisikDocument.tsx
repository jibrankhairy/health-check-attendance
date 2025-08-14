// components/mcu/report/PemeriksaanFisikDocument.tsx
"use client";

import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportHeader, PatientInfo, ReportFooter } from "./ReportLayout";
import { styles as globalStyles } from './reportStyles';

// Style lokal khusus untuk halaman ini
const localStyles = StyleSheet.create({
    title: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        marginBottom: 16,
        textDecoration: 'underline',
        textAlign: 'center'
    },
    section: {
        marginBottom: 12, // DIUBAH: Menambah spasi antar seksi
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        backgroundColor: '#f0f0f0',
        padding: 4,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5, // DIUBAH: Menambah sedikit spasi
        fontSize: 9,
        lineHeight: 1.4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eaeaea',
        paddingBottom: 5, // DIUBAH: Menambah sedikit spasi
    },
    label: {
        width: '35%',
        fontFamily: 'Helvetica',
    },
    value: {
        width: '65%',
        fontFamily: 'Helvetica-Bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '50%',
        flexDirection: 'row',
        marginBottom: 6, // DIUBAH: Menambah spasi antar item di grid
        paddingRight: 10, // DIUBAH: Menambah spasi horizontal
    },
    gridLabel: {
        width: '50%',
    },
    gridValue: {
        width: '50%',
        fontFamily: 'Helvetica-Bold',
    }
});

// Helper untuk menampilkan baris data
const DataRow = ({ label, value, unit = "" }: { label: string, value: any, unit?: string }) => {
    const displayValue = value !== null && value !== undefined && value !== "" ? value : "-";
    return (
        <View style={localStyles.row}>
            <Text style={localStyles.label}>{label}</Text>
            <Text style={localStyles.value}>: {displayValue} {unit}</Text>
        </View>
    );
};

// Helper untuk menampilkan data dalam format grid (2 kolom)
const DataGrid = ({ children }: { children: React.ReactNode }) => (
    <View style={localStyles.grid}>{children}</View>
);

const GridItem = ({ label, value }: { label: string, value: any }) => {
     const displayValue = value !== null && value !== undefined && value !== "" ? value : "-";
    return (
        <View style={localStyles.gridItem}>
            <Text style={localStyles.gridLabel}>{label}</Text>
            <Text style={localStyles.gridValue}>: {displayValue}</Text>
        </View>
    );
};


export const PemeriksaanFisikDocument = ({ data }) => {
    const pf = data.pemeriksaanFisikForm || {};

    return (
        <Page size="A4" style={globalStyles.page}>
            <ReportHeader />
            <PatientInfo patient={data?.patient} />

            <View style={globalStyles.body}>
                <Text style={localStyles.title}>HASIL PEMERIKSAAN FISIK</Text>
                
                {/* A. Pemeriksaan Umum */}
                <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>A. PEMERIKSAAN UMUM</Text>
                    <DataRow label="Kondisi Kesehatan" value={pf.kondisiKesehatan} />
                    <DataRow label="Kesadaran" value={pf.kesadaran} />
                    <DataGrid>
                        <GridItem label="Berat Badan" value={`${pf.beratBadanKg || '-'} kg`} />
                        <GridItem label="Tinggi Badan" value={`${pf.tinggiBadanCm || '-'} cm`} />
                        <GridItem label="BMI" value={`${pf.bmi || '-'} kg/m²`} />
                        <GridItem label="Lingkar Perut" value={`${pf.lingkarPerutCm || '-'} cm`} />
                        <GridItem label="Suhu" value={`${pf.suhuC || '-'} °C`} />
                        <GridItem label="Tekanan Darah" value={`${pf.tensiSistol || '-'}/${pf.tensiDiastol || '-'} mmHg`} />
                        <GridItem label="Nadi" value={`${pf.nadiPerMenit || '-'} /menit`} />
                        <GridItem label="Pernapasan" value={`${pf.pernapasanPerMenit || '-'} /menit`} />
                    </DataGrid>
                    <DataRow label="Kulit (Hipo/Hiperpigmentasi)" value={pf.hipoHiperpigmentasi} />
                    <DataRow label="Kulit (Rash)" value={pf.rash} />
                </View>

                {/* B. Kepala & Leher */}
                <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>B. KEPALA DAN LEHER</Text>
                    <DataRow label="Hidung (Deviasi Septum)" value={pf.deviasiSeptum} />
                    <DataRow label="Hidung (Pembesaran Konka)" value={pf.pembesaranKonka} />
                    <DataRow label="Tonsil - Ukuran" value={pf.tonsilUkuran} />
                    <DataRow label="Pharing - Hipermis" value={pf.pharingHipermis} />
                    <DataRow label="Lidah" value={pf.lidah} />
                    <DataGrid>
                        <GridItem label="Gigi Karies" value={pf.gigiKaries} />
                        <GridItem label="Gigi Hilang" value={pf.gigiHilang} />
                        <GridItem label="Gigi Palsu" value={pf.gigiPalsu} />
                    </DataGrid>
                    <DataRow label="Leher (Kondisi Umum)" value={pf.leherKondisi} />
                    <DataRow label="Leher (Kelenjar Tiroid)" value={pf.tiroid} />
                    <DataRow label="Leher (Kelenjar Lymph)" value={pf.kelenjarLymp} />
                </View>

                {/* C. Penglihatan (Mata) */}
                <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>C. SISTEM PENGLIHATAN (MATA)</Text>
                    <DataRow label="Buta Warna" value={pf.butaWarna} />
                    <DataGrid>
                        <GridItem label="Anemia OD/OS" value={`${pf.anemiaOD} / ${pf.anemiaOS}`} />
                        <GridItem label="Ikterik OD/OS" value={`${pf.ikterikOD} / ${pf.ikterikOS}`} />
                        <GridItem label="Pupil OD/OS" value={`${pf.pupilOD} / ${pf.pupilOS}`} />
                        <GridItem label="Refleks Cahaya OD/OS" value={`${pf.refleksOD} / ${pf.refleksOS}`} />
                        <GridItem label="Visus OD/OS" value={`${pf.visusOD} / ${pf.visusOS}`} />
                        <GridItem label="Kacamata" value={pf.kacamata} />
                        <GridItem label="Ukuran OD/OS" value={`${pf.ukuranOD} / ${pf.ukuranOS}`} />
                        <GridItem label="Lapang Pandang" value={pf.lapangPandang} />
                        <GridItem label="Ketajaman" value={pf.ketajaman} />
                        <GridItem label="Pupil Distance" value={pf.pupilDistance} />
                    </DataGrid>
                </View>

                 {/* D. Pendengaran (THT) */}
                 <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>D. SISTEM PENDENGARAN (THT)</Text>
                    <DataGrid>
                        <GridItem label="Pendengaran AD/AS" value={`${pf.kemampuanPendengaranAD} / ${pf.kemampuanPendengaranAS}`} />
                        <GridItem label="Telinga Luar AD/AS" value={`${pf.telingaLuarAD} / ${pf.telingaLuarAS}`} />
                        <GridItem label="Nyeri Tekan AD/AS" value={`${pf.nyeriTekanAD} / ${pf.nyeriTekanAS}`} />
                        <GridItem label="Serumen AD/AS" value={`${pf.serumenAD} / ${pf.serumenAS}`} />
                        <GridItem label="Gendang Telinga AD/AS" value={`${pf.gendangAD} / ${pf.gendangAS}`} />
                    </DataGrid>
                </View>
                
                {/* E. KARDIOVASKULAR */}
                <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>E. SISTEM KARDIOVASKULAR</Text>
                    <DataGrid>
                        <GridItem label="Ictus Cordis (Inspeksi)" value={pf.ictusInspeksi} />
                        <GridItem label="Ictus Cordis (Palpasi)" value={pf.ictusPalpasi} />
                        <GridItem label="Batas Jantung" value={pf.batasJantung} />
                        <GridItem label="Bising Jantung" value={pf.bisingJantung} />
                    </DataGrid>
                </View>

                {/* F. PERNAFASAN */}
                 <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>F. SISTEM PERNAFASAN</Text>
                    <DataGrid>
                        <GridItem label="Paru (Inspeksi)" value={pf.paruInspeksi} />
                        <GridItem label="Paru (Palpasi)" value={pf.paruPalpasi} />
                        <GridItem label="Paru (Perkusi)" value={pf.paruPerkusi} />
                        <GridItem label="Paru (Auskultasi)" value={pf.paruAuskultasi} />
                    </DataGrid>
                </View>

                {/* G. PENCERNAAN */}
                 <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>G. SISTEM PENCERNAAN</Text>
                    <DataGrid>
                        <GridItem label="Abdomen (Inspeksi)" value={pf.cernaInspeksi} />
                        <GridItem label="Hepar" value={pf.hepar} />
                        <GridItem label="Lien" value={pf.lien} />
                        <GridItem label="Peristaltik" value={pf.peristaltik} />
                    </DataGrid>
                </View>

                {/* H. EKSTREMITAS */}
                 <View style={localStyles.section}>
                    <Text style={localStyles.sectionTitle}>H. EKSTREMITAS</Text>
                    <DataGrid>
                        <GridItem label="Deformitas" value={pf.deformitas} />
                        <GridItem label="Oedema" value={pf.oedema} />
                        <GridItem label="Refleks Fisiologis" value={pf.refleksFisiologis} />
                        <GridItem label="Refleks Patologis" value={pf.refleksPatologis} />
                    </DataGrid>
                </View>

                {/* I & J */}
                <View style={localStyles.section}>
                    <DataGrid>
                        <GridItem label="Tulang Belakang" value={pf.tulangBelakang} />
                        <GridItem label="Kontak Psikis" value={pf.psikis} />
                        <GridItem label="Sikap & Tingkah Laku" value={pf.sikap} />
                        <GridItem label="Daya Ingat" value={pf.dayaIngat} />
                    </DataGrid>
                </View>

            </View>

            <ReportFooter />
        </Page>
    );
};
